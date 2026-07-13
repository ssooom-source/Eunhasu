import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

type PersonInput = {
  birthDate: string;
  birthTime?: string;
  calendarType: "solar" | "lunar";
  gender?: "male" | "female" | "unspecified";
};

type RequestBody = {
  person1: PersonInput;
  person2: PersonInput;
};

type CompatibilityResult = {
  headline: string;
  vibeLabel: string;
  overallVibe: string;
  strengths: string;
  challenges: string;
  advice: string;
  closing: string;
};

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

function describePerson(label: string, p: PersonInput): string {
  const calendarLabel = p.calendarType === "solar" ? "양력" : "음력";
  const timeLabel = p.birthTime ? p.birthTime : "시간 정보 없음";
  const genderLabel =
    p.gender === "male" ? "남성" : p.gender === "female" ? "여성" : "미지정";
  return `${label}: ${p.birthDate} (${calendarLabel}), 태어난 시간 ${timeLabel}, 성별 ${genderLabel}`;
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const { person1, person2 } = body;

  if (
    !person1 ||
    !person2 ||
    !isValidDate(person1.birthDate) ||
    !isValidDate(person2.birthDate)
  ) {
    return NextResponse.json(
      { error: "두 사람의 생년월일을 올바르게 입력해주세요." },
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

  const systemPrompt = `당신은 따뜻하고 통찰력 있는 사주 궁합 해석가입니다. 두 사람의 생년월일(및 태어난 시간, 양/음력, 성별)을 바탕으로 전통 사주명리학의 정서와 어휘(오행, 상생상극 등)를 참고하여 두 사람의 기운이 어떻게 어우러지는지 이야기하듯 들려줍니다.

규칙:
- 실제 만세력 계산을 하지 않으므로 단정적인 미래 예측이나 관계의 성패를 확정짓는 표현은 피하세요.
- 이 서비스는 오락 목적임을 문체에서 은근히 드러내되, 직접적으로 "이것은 오락입니다"라고 딱딱하게 말하지는 마세요.
- 우정, 연인, 가족, 동료 등 관계의 종류를 특정하지 말고 범용적으로 "두 사람의 관계"라는 표현을 쓰세요.
- 따뜻하면서도 균형 잡힌 시각으로 작성하세요. 한쪽으로 치우쳐 좋다/나쁘다로 단정하지 말고, 강점과 유의할 점을 함께 다루세요.
- 반드시 아래 JSON 스키마만 출력하세요. 다른 설명, 마크다운, 코드블록 없이 순수 JSON만 응답하세요.

스키마 (각 항목은 반드시 지정된 문장 수를 넘지 않도록 간결하게 작성하세요):
{
  "headline": "두 사람의 궁합을 한 문장으로 요약하는 시적인 제목 (15자 내외)",
  "vibeLabel": "두 사람의 기운 조합을 상징하는 두 글자 내외의 키워드 (예: 상생, 조화, 자극)",
  "overallVibe": "전체적인 기운의 어우러짐에 대한 3문장",
  "strengths": "이 관계에서 자연스럽게 잘 맞는 부분 2~3문장",
  "challenges": "서로 다르거나 유의하면 좋을 부분 2~3문장",
  "advice": "두 사람의 관계를 더 좋게 만들 실천적 조언 2문장",
  "closing": "따뜻하게 마무리하는 1문장"
}

중요: 전체 응답은 반드시 완결된 JSON 객체로 끝나야 합니다. 문장 수를 넘기지 말고, 마지막 "}"로 정확히 마무리하세요.`;

  const userPrompt = `${describePerson("사람 A", person1)}
${describePerson("사람 B", person2)}

위 두 사람의 정보를 바탕으로 궁합을 해석해주세요.`;

  async function callClaude() {
    const message = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1600,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("텍스트 블록 없음");
    }

    let cleaned = textBlock.text.replace(/```json|```/g, "").trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
      throw new Error("JSON 형식을 찾을 수 없음");
    }
    cleaned = cleaned.slice(firstBrace, lastBrace + 1);

    return JSON.parse(cleaned) as CompatibilityResult;
  }

  try {
    let parsed: CompatibilityResult;
    try {
      parsed = await callClaude();
    } catch {
      parsed = await callClaude();
    }

    return NextResponse.json({ result: parsed });
  } catch (err) {
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: "궁합 결과를 읽는 데 실패했습니다. 다시 시도해주세요." },
      { status: 502 }
    );
  }
}
