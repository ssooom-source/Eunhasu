"use client";

import { useState, FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from(
  { length: currentYear - 1920 + 1 },
  (_, i) => currentYear - i
);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export default function CompatibilityForm() {
  const params = useSearchParams();
  const router = useRouter();

  const p1Name = params.get("p1Name") ?? "";
  const p1BirthDate = params.get("p1BirthDate") ?? "";
  const p1BirthTime = params.get("p1BirthTime") ?? "";
  const p1CalendarType = params.get("p1CalendarType") ?? "solar";
  const p1Gender = params.get("p1Gender") ?? "unspecified";

  const [myName, setMyName] = useState(p1Name);
  const [friendName, setFriendName] = useState("");
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

  if (!p1BirthDate) {
    if (typeof window !== "undefined") {
      router.replace("/");
    }
    return null;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!year || !month || !day) {
      setError("친구의 생년월일을 모두 선택해주세요.");
      return;
    }

    const p2BirthDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const searchParams = new URLSearchParams({
      p1BirthDate,
      p1CalendarType,
      p1Gender,
      p2BirthDate,
      p2CalendarType: calendarType,
      p2Gender: gender,
    });
    if (p1BirthTime) searchParams.set("p1BirthTime", p1BirthTime);
    if (birthTime) searchParams.set("p2BirthTime", birthTime);
    if (myName.trim()) searchParams.set("p1Name", myName.trim());
    if (friendName.trim()) searchParams.set("p2Name", friendName.trim());

    router.push(`/compatibility/result?${searchParams.toString()}`);
  }

  return (
    <main className="form-section" style={{ paddingTop: 80 }}>
      <div className="form-card">
        <h2>친구의 생년월일을 알려주세요</h2>
        <p className="sub">두 사람의 기운이 어떻게 어우러지는지 봐드릴게요.</p>

        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="myName">내 닉네임 (선택)</label>
              <input
                id="myName"
                type="text"
                value={myName}
                onChange={(e) => setMyName(e.target.value)}
                placeholder="예: 은수"
                maxLength={20}
              />
            </div>
            <div className="field">
              <label htmlFor="friendName">친구 닉네임 (선택)</label>
              <input
                id="friendName"
                type="text"
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                placeholder="예: 하늘"
                maxLength={20}
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="friendYear">친구 생년월일</label>
            <div className="date-select-row">
              <select
                id="friendYear"
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
                id="friendMonth"
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
                id="friendDay"
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
              <label htmlFor="friendTime">태어난 시간 (선택)</label>
              <input
                id="friendTime"
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
                  name="friendCalendarType"
                  checked={calendarType === "solar"}
                  onChange={() => setCalendarType("solar")}
                />
                양력
              </label>
              <label>
                <input
                  type="radio"
                  name="friendCalendarType"
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
                  name="friendGender"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                />
                여성
              </label>
              <label>
                <input
                  type="radio"
                  name="friendGender"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                />
                남성
              </label>
              <label>
                <input
                  type="radio"
                  name="friendGender"
                  checked={gender === "unspecified"}
                  onChange={() => setGender("unspecified")}
                />
                선택 안 함
              </label>
            </div>
          </div>

          <button type="submit" className="btn">
            궁합 보기
          </button>

          {error && <p className="form-error">{error}</p>}
        </form>
      </div>
    </main>
  );
}
