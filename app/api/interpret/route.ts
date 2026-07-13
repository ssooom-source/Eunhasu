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
  recommendedJobs: string[];
  similarFigure: string;
  similarFigureReason: string;
  advice: string;
  closing: string;
};

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

const INTERPRETATION_TOOL = {
  name: "submit_interpretation",
  description: "생성한 사주 해석 결과를 제출합니다.",
  input_schema: {
    type: "object" as const,
    properties: {
      headline: {
        type: "string",
        description: "이 사람의 사주를 한 문장으로 요약하는 시적인 제목 (15자 내외)",
      },
      keyword: {
        type: "string",
        description: "이 사람의 기운을 상징하는 두 글자 내외의 키워드 (예: 목화, 수생, 금극)",
      },
      elements: {
        type: "string",
        description: "오행(목화토금수) 중 도드라지는 기운에 대한 2문장 설명",
      },
      personality: {
        type: "string",
        description: "타고난 성격과 기질에 대한 3문장",
      },
      love: {
        type: "string",
        description: "연애와 관계의 흐름에 대한 3문장",
      },
      wealth: {
        type: "string",
        description: "재물운과 일에 대한 태도에 대한 3문장",
      },
      career: {
        type: "string",
        description: "적성과 일하는 방식에 대한 2문장 (구체적 직업명은 별도 필드에 작성)",
      },
      recommendedJobs: {
        type: "array",
        items: { type: "string" },
        description:
          "뻔한 대분류가 아닌 구체적인 직무명 3개 (예: UX 리서처, 브랜드 마케터, 임상 심리상담사)",
      },
      similarFigure: {
        type: "string",
        description: "기운이 비슷한 역사적 인물/문화 아이콘의 이름",
      },
      similarFigureReason: {
        type: "string",
        description: "왜 그 인물과 통하는지 1~2문장",
      },
      advice: {
        type: "string",
        description: "지금 이 사람에게 도움이 될 실천적 조언 2문장",
      },
      closing: {
        type: "string",
        description: "따뜻하게 마무리하는 1문장",
      },
    },
    required: [
      "headline",
      "keyword",
      "elements",
      "personality",
      "love",
      "wealth",
      "career",
      "recommendedJobs",
      "similarFigure",
      "similarFigureReason",
      "advice",
      "closing",
    ],
  },
};

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
- similarFigure는 널리 알려진 역사적 인물이나 문화적 아이콘 중에서 골라, 이 사람의 기운·성향과 "느낌이 통하는" 인물로 가볍게 소개하세요. 실존 인물의 실제 사주를 계산해 비교하는 것이 아니라 성향의 유사성을 재미로 표현하는 것임을 톤에서 드러내세요. 논란의 소지가 있는 정치인이나 현재 활동 중인 민감한 인물은 피하세요.
- 텍스트 값 안에서는 큰따옴표(")를 사용하지 마세요. 강조가 필요하면 작은따옴표(')를 쓰세요.
- 반드시 submit_interpretation 도구를 호출해서 결과를 제출하세요. 도구 호출 없이 텍스트로 답하지 마세요.`;

  const userPrompt = `생년월일: ${birthDate} (${calendarLabel})
태어난 시간: ${timeLabel}
성별: ${genderLabel}

위 정보를 바탕으로 사주를 해석해주세요.`;

  async function callClaude() {
    const message = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
      tools: [INTERPRETATION_TOOL],
      tool_choice: { type: "tool", name: "submit_interpretation" },
    });

    const toolUseBlock = message.content.find(
      (block) => block.type === "tool_use"
    );
    if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
      throw new Error("도구 호출 결과 없음");
    }

    return toolUseBlock.input as InterpretationResult;
  }

  try {
    let parsed: InterpretationResult;
    try {
      parsed = await callClaude();
    } catch {
      parsed = await callClaude();
    }

    return NextResponse.json({ result: parsed });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: "해석 결과를 읽는 데 실패했습니다. 다시 시도해주세요." },
      { status: 502 }
    );
  }
}
