"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Starfield from "@/components/Starfield";

export default function HomePage() {
  const router = useRouter();
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [calendarType, setCalendarType] = useState<"solar" | "lunar">("solar");
  const [gender, setGender] = useState<"male" | "female" | "unspecified">(
    "unspecified"
  );
  const [error, setError] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!birthDate) {
      setError("생년월일을 입력해주세요.");
      return;
    }

    const params = new URLSearchParams({
      birthDate,
      calendarType,
      gender,
    });
    if (birthTime) params.set("birthTime", birthTime);

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
                <label htmlFor="birthDate">생년월일</label>
                <input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                  required
                />
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
                <h3>생년월일 입력</h3>
                <p>태어난 날짜와 시간을 알려주세요.</p>
              </div>
              <div className="how-item">
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
      </footer>
    </>
  );
}
