import { Suspense } from "react";
import Starfield from "@/components/Starfield";
import CompatibilityResultContent from "@/components/CompatibilityResultContent";

export const metadata = {
  title: "궁합 결과 | 은하수",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CompatibilityResultPage() {
  return (
    <>
      <Starfield />
      <Suspense
        fallback={
          <div className="loading-state">
            <div className="spinner" />
            <p>두 사람의 기운을 읽는 중이에요...</p>
          </div>
        }
      >
        <CompatibilityResultContent />
      </Suspense>
    </>
  );
}
