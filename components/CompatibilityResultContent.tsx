"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Constellation from "@/components/Constellation";

type CompatibilityResult = {
  headline: string;
  vibeLabel: string;
  overallVibe: string;
  strengths: string;
  challenges: string;
  advice: string;
  closing: string;
};

export default function CompatibilityResultContent() {
  const params = useSearchParams();
  const router = useRouter();

  const p1BirthDate = params.get("p1BirthDate") ?? "";
  const p1BirthTime = params.get("p1BirthTime") ?? "";
  const p1CalendarType = params.get("p1CalendarType") ?? "solar";
  const p1Gender = params.get("p1Gender") ?? "unspecified";

  const p2BirthDate = params.get("p2BirthDate") ?? "";
  const p2BirthTime = params.get("p2BirthTime") ?? "";
  const p2CalendarType = params.get("p2CalendarType") ?? "solar";
  const p2Gender = params.get("p2Gender") ?? "unspecified";

  const [status, setStatus] = useState<"loading" | "done" | "error">(
    "loading"
  );
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!p1BirthDate || !p2BirthDate) {
      router.replace("/");
      return;
    }

    let cancelled = false;

    async function run() {
      setStatus("loading");
      try {
        const res = await fetch("/api/compatibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            person1: {
              birthDate: p1BirthDate,
              birthTime: p1BirthTime || undefined,
              calendarType: p1CalendarType,
              gender: p1Gender,
            },
            person2: {
              birthDate: p2BirthDate,
              birthTime: p2BirthTime || undefined,
              calendarType: p2CalendarType,
              gender: p2Gender,
            },
          }),
        });
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setErrorMsg(data.error ?? "궁합 해석에 실패했습니다.");
          setStatus("error");
          return;
        }

        setResult(data.result);
        setStatus("done");
      } catch {
        if (!cancelled) {
          setErrorMsg("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
          setStatus("error");
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p1BirthDate, p1BirthTime, p1CalendarType, p1Gender, p2BirthDate, p2BirthTime, p2CalendarType, p2Gender]);

  const seedKeyA = `${p1BirthDate}|${p1BirthTime}|${p1CalendarType}|${p1Gender}`;
  const seedKeyB = `${p2BirthDate}|${p2BirthTime}|${p2CalendarType}|${p2Gender}`;

  if (status === "loading") {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>두 사람의 기운을 읽는 중이에요...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="error-state">
        <p>{errorMsg}</p>
        <a href="/" className="btn ghost">
          처음으로
        </a>
      </div>
    );
  }

  if (!result) return null;

  return (
    <main className="result-page">
      <div className="result-header">
        <span className="eyebrow">{result.vibeLabel}</span>
      </div>

      <div className="constellation-pair">
        <Constellation seedKey={seedKeyA} />
        <span className="constellation-link">✦</span>
        <Constellation seedKey={seedKeyB} />
      </div>

      <div className="result-card">
        <h2
          style={{
            fontFamily: "var(--font-display)",
            textAlign: "center",
            fontSize: "26px",
            marginBottom: "8px",
          }}
        >
          {result.headline}
        </h2>

        <div className="result-block">
          <span className="label">전체적인 기운</span>
          <p>{result.overallVibe}</p>
        </div>
        <div className="result-block">
          <span className="label">잘 맞는 부분</span>
          <p>{result.strengths}</p>
        </div>
        <div className="result-block">
          <span className="label">유의할 부분</span>
          <p>{result.challenges}</p>
        </div>
        <div className="result-block">
          <span className="label">더 좋은 관계를 위해</span>
          <p>{result.advice}</p>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "30px",
            color: "var(--text-muted)",
            fontSize: "14px",
          }}
        >
          {result.closing}
        </p>
      </div>

      <div className="result-actions">
        <a href="/" className="btn ghost">
          처음으로
        </a>
      </div>
    </main>
  );
}
