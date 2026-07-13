"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Constellation from "@/components/Constellation";

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

export default function ResultContent() {
  const params = useSearchParams();
  const router = useRouter();

  const birthDate = params.get("birthDate") ?? "";
  const birthTime = params.get("birthTime") ?? "";
  const calendarType = params.get("calendarType") ?? "solar";
  const gender = params.get("gender") ?? "unspecified";

  const [status, setStatus] = useState<"loading" | "done" | "error">(
    "loading"
  );
  const [result, setResult] = useState<InterpretationResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!birthDate) {
      router.replace("/");
      return;
    }

    let cancelled = false;

    async function run() {
      setStatus("loading");
      try {
        const res = await fetch("/api/interpret", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            birthDate,
            birthTime: birthTime || undefined,
            calendarType,
            gender,
          }),
        });
        const data = await res.json();

        if (cancelled) return;

        if (!res.ok) {
          setErrorMsg(data.error ?? "해석에 실패했습니다.");
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
  }, [birthDate, birthTime, calendarType, gender]);

  const seedKey = `${birthDate}|${birthTime}|${calendarType}|${gender}`;

  if (status === "loading") {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>당신의 하늘을 읽는 중이에요. 잠시만 기다려주세요.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="error-state">
        <p>{errorMsg}</p>
        <a href="/" className="btn ghost">
          다시 시도하기
        </a>
      </div>
    );
  }

  if (!result) return null;

  return (
    <main className="result-page">
      <div className="result-header">
        <span className="eyebrow">{result.keyword}</span>
      </div>

      <div className="constellation-wrap">
        <Constellation seedKey={seedKey} />
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
          <span className="label">오행의 기운</span>
          <p>{result.elements}</p>
        </div>
        <div className="result-block">
          <span className="label">타고난 성격</span>
          <p>{result.personality}</p>
        </div>
        <div className="result-block">
          <span className="label">연애와 관계</span>
          <p>{result.love}</p>
        </div>
        <div className="result-block">
          <span className="label">재물과 일</span>
          <p>{result.wealth}</p>
        </div>
        <div className="result-block">
          <span className="label">적성과 방향</span>
          <p>{result.career}</p>
        </div>
        <div className="result-block">
          <span className="label">지금 필요한 것</span>
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
          다시 보기
        </a>
      </div>
    </main>
  );
}
