import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type RequestBody = {
  birthDate: string; // YYYY-MM-DD
  birthTime?: string; // HH:mm, optional
  calendarType: "solar" | "lunar";
  gender?: "male" | "female" | "unspecified";
};

type InterpretationResult = {
  headline: string;
  keyword: string;
  elements: string;
  personality: string;
  love: string;
  wealth: string;
  career: string;
  advice: string;
  closing: string;
};

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const { birthDate, birthTime, calendarType, gender } = body;

  if (!birthDate || !isValidDate(birthDate)) {
    return NextResponse.json(
      { error: "생년월일을 올바른 형식(YYYY-MM-DD)으로 입력해주세요." },
      { status: 400 }
    );
  }

  if (calendarType !== "solar" && calendarType !== "lunar") {
    return NextResponse.json(
      { error: "양력/음력 구분이 필요합니다." },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "서버에 ANTHROPIC_API_KEY가 설정되어 있지 않습니다." },
      { status: 500 }
    );
  }

  const client = new Anthropic({ apiKey });

  const calendarLabel = calendarType === "solar" ? "양력" : "음력";
  const timeLabel = birthTime ? `${birthTime}` : "시간 정보 없음";
  const genderLabel =
    gender === "male" ? "남성" : gender === "female" ? "여성" : "미지정";

  const systemPrompt = `당신은 따뜻하고 통찰력 있는 사주 해석가입니다. 사용자의 생년월일(및 태어난 시간, 양/음력, 성별)을 바탕으로 전통 사주명리학의 정서와 어휘(오행, 기운, 십성 등)를 참고하여 이야기하듯 해석을 들려줍니다.

규칙:
- 실제 만세력 계산을 하지 않으므로 단정적인 미래 예측이나 의학적·법적·재정적 조언처럼 들리는 단정적 문장은 피하세요.
- 이 서비스는 오락 목적임을 문체에서 은근히 드러내되, 직접적으로 "이것은 오락입니다"라고 딱딱하게 말하지는 마세요.
- 따뜻하고 시적이면서도 구체적인 문장으로 작성하세요. 뻔한 별자리 운세 같은 문구는 피하세요.
- 반드시 아래 JSON 스키마만 출력하세요. 다른 설명, 마크다운, 코드블록 없이 순수 JSON만 응답하세요.

스키마:
{
  "headline": "이 사람의 사주를 한 문장으로 요약하는 시적인 제목 (15자 내외)",
  "keyword": "이 사람의 기운을 상징하는 두 글자 내외의 키워드 (예: 목화, 수생, 금극)",
  "elements": "오행(목화토금수) 중 도드라지는 기운에 대한 2~3문장 설명",
  "personality": "타고난 성격과 기질에 대한 3~4문장",
  "love": "연애와 관계의 흐름에 대한 3~4문장",
  "wealth": "재물운과 일에 대한 태도에 대한 3~4문장",
  "career": "적성과 일/커리어 방향에 대한 3~4문장",
  "advice": "지금 이 사람에게 도움이 될 실천적 조언 2~3문장",
  "closing": "따뜻하게 마무리하는 1~2문장"
}`;

  const userPrompt = `생년월일: ${birthDate} (${calendarLabel})
태어난 시간: ${timeLabel}
성별: ${genderLabel}

위 정보를 바탕으로 사주를 해석해주세요.`;

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(
        { error: "해석 결과를 생성하지 못했습니다." },
        { status: 502 }
      );
    }

let cleaned = textBlock.text.replace(/```json|```/g, "").trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.slice(firstBrace, lastBrace + 1);
    }
    let parsed: InterpretationResult;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "해석 결과 형식을 읽는 데 실패했습니다. 다시 시도해주세요." },
        { status: 502 }
      );
    }

    return NextResponse.json({ result: parsed });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: "해석 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
