"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Starfield from "@/components/Starfield";

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: currentYear - 1920 + 1 },
  (_, i) => currentYear - i
);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
  const [gender, setGender] = useState<"male" | "female" | "unspecified">(
    "unspecified"
  );
  const [error, setError] = useState("");

  const dayOptions = year && month
    ? Array.from(
        { length: daysInMonth(Number(year), Number(month)) },
        (_, i) => i + 1
      )
    : Array.from({ length: 31 }, (_, i) => i + 1);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!year || !month || !day) {
      setError("생년월일을 모두 선택해주세요.");
      return;
    }

    const birthDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const params = new URLSearchParams({
      birthDate,
      calendarType,
      gender,
    });
    if (birthTime) params.set("birthTime", birthTime);
    if (name.trim()) params.set("name", name.trim());

    router.push(`/result?${params.toString()}`);
  }

  return (
    <>
      <Starfield />
      <header className="site-header">
        <div className="logo">
          은<span>하</span>수
        </div>
      </header>

      <main>
        <section className="hero">
          <span className="eyebrow hero-eyebrow">AI 사주 해석</span>
          <h1>
            태어난 순간의 하늘이
            <br />
            <em>당신만의 별자리</em>를 그립니다
          </h1>
          <p className="lede">
            생년월일을 입력하면 AI가 당신의 기운과 흐름을 읽어
            이야기로 들려드려요. 나만의 별자리도 함께 그려드립니다.
          </p>
          <div className="hero-cta">
            <a href="#form" className="btn">
              내 사주 보러 가기
            </a>
          </div>
        </section>

        <section className="form-section" id="form">
          <div className="form-card">
            <h2>생년월일을 알려주세요</h2>
            <p className="sub">정확한 정보일수록 더 섬세한 해석이 가능해요.</p>

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="userName">닉네임 (선택)</label>
                <input
                  id="userName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="예: 은수"
                  maxLength={20}
                />
              </div>

              <div className="field">
                <label htmlFor="birthYear">생년월일</label>
                <div className="date-select-row">
                  <select
                    id="birthYear"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      년
                    </option>
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>
                        {y}년
                      </option>
                    ))}
                  </select>
                  <select
                    id="birthMonth"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      월
                    </option>
                    {MONTH_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}월
                      </option>
                    ))}
                  </select>
                  <select
                    id="birthDay"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      일
                    </option>
                    {dayOptions.map((d) => (
                      <option key={d} value={d}>
                        {d}일
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field-row">
                <div className="field">
                  <label htmlFor="birthTime">태어난 시간 (선택)</label>
                  <input
                    id="birthTime"
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="field">
                <label>양력 / 음력</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="calendarType"
                      checked={calendarType === "solar"}
                      onChange={() => setCalendarType("solar")}
                    />
                    양력
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="calendarType"
                      checked={calendarType === "lunar"}
                      onChange={() => setCalendarType("lunar")}
                    />
                    음력
                  </label>
                </div>
              </div>

              <div className="field">
                <label>성별 (선택)</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "female"}
                      onChange={() => setGender("female")}
                    />
                    여성
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "male"}
                      onChange={() => setGender("male")}
                    />
                    남성
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      checked={gender === "unspecified"}
                      onChange={() => setGender("unspecified")}
                    />
                    선택 안 함
                  </label>
                </div>
              </div>

              <button type="submit" className="btn">
                별자리 해석 보기
              </button>

              {error && <p className="form-error">{error}</p>}

              <p className="form-note">
                본 서비스의 해석은 재미와 자기 이해를 위한 콘텐츠이며,
                의학·법률·재정적 조언을 대신하지 않습니다.
              </p>
            </form>
          </div>
        </section>

        <section className="how">
          <div className="wrap">
            <span className="eyebrow">HOW IT WORKS</span>
            <div className="how-grid">
              <div className="how-item">
                <span className="mark">一</span>
        </section>

        <section className="info-section">
          <div className="wrap">
            <span className="eyebrow">사주, 알고 보면 더 재밌어요</span>

            <div className="info-block">
              <h3>사주란 무엇인가요?</h3>
              <p>
                사주(四柱)는 태어난 연·월·일·시, 네 개의 기둥으로 한 사람의
                타고난 기운을 읽어보는 동양의 전통적인 관점이에요. 오랜
                시간 동안 사람들은 이 네 기둥에 담긴 흐름을 통해 자신의
                성향과 삶의 리듬을 이해하려 해왔어요. 은하수는 이 전통적인
                정서를 AI의 언어로 풀어내, 누구나 쉽고 편하게 자신의 기운을
                들여다볼 수 있게 만들었어요.
              </p>
            </div>

            <div className="info-block">
              <h3>오행(五行)이란?</h3>
              <p>
                오행은 목(木)·화(火)·토(土)·금(金)·수(水), 다섯 가지
                기운을 뜻해요. 나무처럼 뻗어나가는 목, 불처럼 타오르는 화,
                땅처럼 품어주는 토, 쇠처럼 단단한 금, 물처럼 유연한 수까지 —
                이 다섯 기운이 각자 다른 비율로 어우러지면서 사람마다 고유한
                성향과 색깔을 만들어낸다고 봐요. 은하수의 사주 해석에서
                &apos;오행의 기운&apos; 항목이 바로 이 다섯 기운의 조합을
                풀어드리는 부분이에요.
              </p>
            </div>

            <div className="info-block">
              <h3>왜 하필 생년월일일까요?</h3>
              <p>
                태어난 날짜와 시간은 그 사람만이 가진, 다시 반복되지 않는
                고유한 좌표예요. 사주명리학에서는 이 좌표를 기준으로 하늘의
                기운이 어떻게 얽혀 있었는지를 살펴봐요. 은하수는 이 정서를
                가져와, 생년월일이라는 하나의 정보로 &apos;나만의 별자리&apos;와
                이야기를 함께 그려드려요.
              </p>
            </div>

            <div className="info-block">
              <h3>이 해석, 얼마나 믿어도 될까요?</h3>
              <p>
                은하수의 해석은 AI가 전통 사주명리학의 정서와 어휘를 참고해
                만든 콘텐츠예요. 실제 만세력 계산에 기반한 전문 상담을
                대체하지는 않지만, 나를 한 번 더 들여다보고 대화의 소재로
                삼기에는 충분히 즐거운 경험이 될 거예요. 재미와 자기 이해를
                위한 콘텐츠로 편하게 즐겨주세요.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
">
                <span className="mark">二</span>
                <h3>AI가 기운을 읽어요</h3>
                <p>오행과 흐름을 바탕으로 이야기를 엮어냅니다.</p>
              </div>
              <div className="how-item">
                <span className="mark">三</span>
                <h3>나만의 별자리</h3>
                <p>당신의 정보로 그려진 고유한 별자리를 받아보세요.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <hr className="divider" style={{ marginBottom: 24 }} />© 은하수. 모든
        해석은 오락 목적으로 제공됩니다.
        <div className="footer-links">
          <a href="/privacy">개인정보처리방침</a>
          <a href="/terms">이용약관</a>
        </div>
      </footer>
    </>
  );
}
