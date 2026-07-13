import { Suspense } from "react";
import Starfield from "@/components/Starfield";
import CompatibilityForm from "@/components/CompatibilityForm";

export const metadata = {
  title: "궁합 보기 | 은하수",
};

export default function CompatibilityPage() {
  return (
    <>
      <Starfield />
      <Suspense
        fallback={
          <div className="loading-state">
            <div className="spinner" />
            <p>불러오는 중이에요...</p>
          </div>
        }
      >
        <CompatibilityForm />
      </Suspense>
    </>
  );
}
