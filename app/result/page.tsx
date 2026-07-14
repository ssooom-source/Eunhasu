import { Suspense } from "react";
import Starfield from "@/components/Starfield";
import ResultContent from "@/components/ResultContent";

export const metadata = {
  title: "내 사주 결과 | 은하수",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResultPage() {
  return (
    <>
      <Starfield />
      <Suspense
        fallback={
          <div className="loading-state">
            <div className="spinner" />
            <p>별자리를 불러오는 중이에요...</p>
          </div>
        }
      >
        <ResultContent />
      </Suspense>
    </>
  );
}
