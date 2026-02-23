import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createClient } from '@/lib/supabase/server';

const googleConfig = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Vercel Edge Runtime을 사용하여 빠른 응답 시간 확보
export const maxDuration = 30; // 30초 스트리밍 허용

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Supabase 서버 클라이언트 초기화 및 유저 정보 가져오기
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 방금 전송된 유저의 메시지 추출
    const lastMessage = messages[messages.length - 1];

    // 유저가 인증되어 있고, 마지막 메시지가 유저의 메시지인 경우 DB에 저장
    if (user && lastMessage?.role === 'user') {
      await supabase.from('chat_messages').insert({
        user_id: user.id,
        role: 'user',
        content: lastMessage.content,
      });
    }

    // 입력받은 메시지 목록을 바탕으로 Gemini 스트림 요청
    // (이전 3.x 버전 Vercel AI SDK는 내부적으로 구형 v1beta API를 호출하므로, 옛 모델명인 gemini-pro 사용)
    const result = await streamText({
      model: googleConfig('gemini-2.5-flash'),
      messages,
      system: `당신은 사용자의 일정을 돕고 정보를 제공하는 친절하고 전문적인 AI 개인 비서 'P.I.D Assistant' 입니다. 
모든 답변은 한국어로 명확하고 간결하게 작성하며, 마크다운(Markdown) 포맷을 활용해 가독성 있게 답변해주세요.`,
      onFinish: async ({ text }) => {
        // 스트리밍 후 AI의 답변 내용 완성 시 DB에 저장
        if (user) {
          await supabase.from('chat_messages').insert({
            user_id: user.id,
            role: 'assistant',
            content: text,
          });
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "채팅 응답을 생성하는 중 오류가 발생했습니다." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
