import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

// RSS 파서 인스턴스 생성
const parser = new Parser({
  customFields: {
    item: ['media:content'],
  }
});

export async function GET() {
  try {
    // 한국 Google News 주요 기사 RSS
    const feedUrl = 'https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko';

    // RSS 피드 파싱
    const feed = await parser.parseURL(feedUrl);

    // 프론트엔드에서 쓰기 쉽게 데이터 가공
    const news = feed.items.slice(0, 15).map((item, index) => {
      // 구글 뉴스의 경우 "제목 - 매체명" 형태가 많음, 이를 분리
      const titleParts = item.title?.split(' - ') || [];
      const publisher = titleParts.length > 1 ? titleParts.pop() : '뉴스';
      const cleanTitle = titleParts.join(' - ') || item.title;

      return {
        id: index.toString(),
        title: cleanTitle,
        link: item.link,
        pubDate: item.pubDate,
        publisher: publisher,
        contentSnippet: item.contentSnippet,
      };
    });

    return NextResponse.json({ news });
  } catch (error) {
    console.error('RSS News Fetch Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news feed' },
      { status: 500 }
    );
  }
}
