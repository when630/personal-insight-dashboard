import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

const googleConfig = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
});

// Vercel Edge Runtime을 사용하여 빠른 응답 시간 확보
export const maxDuration = 30; // 30초 스트리밍 허용

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // 입력받은 메시지 목록을 바탕으로 Gemini 스트림 요청
    // (gemini-1.5-pro 속도가 빠르고 합리적인 gemini-1.5-flash 모델 권장)
    const result = streamText({
      model: googleConfig('gemini-1.5-flash'),
      messages,
      system: `당신은 사용자의 일정을 돕고 정보를 제공하는 친절하고 전문적인 AI 개인 비서 'P.I.D Assistant' 입니다. 
모든 답변은 한국어로 명확하고 간결하게 작성하며, 마크다운(Markdown) 포맷을 활용해 가독성 있게 답변해주세요.`,
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
