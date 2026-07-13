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
              
