import Starfield from "@/components/Starfield";

export const metadata = {
  title: "이용약관 | 은하수",
};

export default function TermsPage() {
  return (
    <>
      <Starfield />
      <main className="legal-page">
        <div className="wrap">
          <h1>이용약관</h1>
          <p className="legal-updated">최종 수정일: 2026년 7월</p>

          <section>
            <h2>제1조 (목적)</h2>
            <p>
              본 약관은 은하수(이하 &quot;서비스&quot;)가 제공하는 AI 기반
              사주 해석 콘텐츠 이용과 관련하여 서비스와 이용자 간의 권리,
              의무 및 책임사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2>제2조 (서비스의 성격)</h2>
            <p>
              서비스가 제공하는 사주 해석은 실제 명리학적 계산(만세력 등)에
              기반하지 않고, 인공지능이 생성한 오락 및 자기 이해를 위한
              참고용 콘텐츠입니다. 해석 결과는 의학적, 법률적, 재정적
              조언을 대체하지 않으며, 중요한 의사결정의 근거로 사용해서는
              안 됩니다.
            </p>
          </section>

          <section>
            <h2>제3조 (이용자의 의무)</h2>
            <p>
              이용자는 서비스 이용 시 타인의 정보를 도용하거나 서비스를
              부정한 목적으로 이용해서는 안 됩니다.
            </p>
          </section>

          <section>
            <h2>제4조 (면책조항)</h2>
            <p>
              서비스는 AI가 생성한 해석 콘텐츠의 정확성, 완전성을 보장하지
              않으며, 이용자가 해석 결과를 신뢰하여 발생한 결과에 대해
              책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2>제5조 (지적재산권)</h2>
            <p>
              서비스가 제공하는 콘텐츠(별자리 이미지, 해석 텍스트 등)의
              저작권은 서비스 운영자에게 있으며, 무단으로 복제, 배포, 상업적
              이용할 수 없습니다.
            </p>
          </section>

          <section>
            <h2>제6조 (약관의 변경)</h2>
            <p>
              본 약관은 필요 시 개정될 수 있으며, 개정된 약관은 서비스
              화면에 게시함으로써 효력이 발생합니다.
            </p>
          </section>

          <section>
            <h2>제7조 (문의처)</h2>
            <p>서비스 관련 문의: hushmoon.radio@gmail.com</p>
          </section>
        </div>
      </main>
    </>
  );
}
