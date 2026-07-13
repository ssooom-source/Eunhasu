import Starfield from "@/components/Starfield";

export const metadata = {
  title: "개인정보처리방침 | 은하수",
};

export default function PrivacyPage() {
  return (
    <>
      <Starfield />
      <main className="legal-page">
        <div className="wrap">
          <h1>개인정보처리방침</h1>
          <p className="legal-updated">최종 수정일: 2026년 7월</p>

          <section>
            <h2>1. 수집하는 개인정보 항목</h2>
            <p>
              은하수(이하 &quot;서비스&quot;)는 사주 해석 결과를 제공하기 위해
              사용자가 직접 입력한 생년월일, 태어난 시간, 양/음력 구분,
              성별 정보를 일시적으로 처리합니다. 이 정보는 별도의 계정이나
              로그인 없이 입력 즉시 해석 결과 생성에만 사용되며, 서버에
              영구 저장되지 않습니다.
            </p>
          </section>

          <section>
            <h2>2. 개인정보의 이용 목적</h2>
            <p>
              입력하신 정보는 AI 사주 해석 결과 생성 및 개인화된 별자리
              이미지 표시를 위한 목적으로만 사용되며, 다른 목적으로
              이용되거나 제3자에게 제공되지 않습니다.
            </p>
          </section>

          <section>
            <h2>3. 개인정보의 보유 및 파기</h2>
            <p>
              서비스는 별도의 회원가입 절차가 없으며, 입력된 생년월일 등의
              정보는 해석 결과를 생성하는 요청 처리 과정에서만 일시적으로
              사용되고 이후 저장되지 않습니다.
            </p>
          </section>

          <section>
            <h2>4. 제3자 서비스 이용</h2>
            <p>
              해석 결과 생성을 위해 Anthropic의 Claude API를 이용하며, 해당
              처리 과정에서 입력된 생년월일 정보가 API 요청에 포함되어
              전송됩니다. 자세한 내용은 Anthropic의 개인정보처리방침을
              참고하실 수 있습니다.
            </p>
            <p>
              서비스는 방문자 통계 분석 및 광고 게재를 위해 Google
              애널리틱스, Google AdSense 등의 서비스를 이용할 수 있으며,
              이 과정에서 쿠키가 사용될 수 있습니다. 쿠키는 웹브라우저
              설정에서 언제든지 거부하실 수 있습니다.
            </p>
          </section>

          <section>
            <h2>5. 이용자의 권리</h2>
            <p>
              본 서비스는 개인정보를 저장하지 않으므로 별도의 열람, 정정,
              삭제 절차가 필요하지 않습니다. 서비스 이용과 관련한 문의사항은
              아래 연락처로 문의해주세요.
            </p>
          </section>

          <section>
            <h2>6. 문의처</h2>
            <p>개인정보 관련 문의: hushmoon.radio@gmail.com</p>
          </section>
        </div>
      </main>
    </>
  );
}
