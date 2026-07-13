# 은하수 — AI 사주 해석 웹사이트

생년월일(+시간)을 입력하면 Claude API가 사주를 해석해주고,
입력값을 기반으로 고유한 "별자리"를 그려주는 Next.js 웹앱입니다.

## 1. 로컬에서 실행해보기

```bash
npm install
cp .env.example .env.local   # 파일 열어서 ANTHROPIC_API_KEY 값 채우기
npm run dev
```

브라우저에서 http://localhost:3000 접속.

### API 키 발급 방법
1. https://console.anthropic.com 접속 후 로그인/가입
2. 결제수단 등록 (소액 크레딧 충전, 예: $5)
3. API Keys 메뉴에서 새 키 생성 → `.env.local`의 `ANTHROPIC_API_KEY`에 붙여넣기

## 2. 배포하기 (Vercel, 무료)

1. 이 폴더를 GitHub 저장소로 올리기
   ```bash
   git init
   git add .
   git commit -m "init"
   git remote add origin <본인의 GitHub 저장소 주소>
   git push -u origin main
   ```
2. https://vercel.com 가입 (GitHub 계정으로 로그인 가능)
3. "Add New Project" → 방금 만든 GitHub 저장소 선택 → Import
4. **Environment Variables**에 다음을 추가:
   - Key: `ANTHROPIC_API_KEY`
   - Value: 발급받은 API 키
5. Deploy 클릭 → 몇 분 뒤 `https://프로젝트명.vercel.app` 주소로 사이트가 열립니다.
6. 이후 GitHub에 코드를 push할 때마다 자동으로 재배포됩니다.

### 내 도메인 연결하고 싶다면
Vercel 프로젝트 → Settings → Domains 에서 보유한 도메인을 연결하면 됩니다.
(가비아, 후이즈 등에서 도메인을 구매한 뒤 Vercel이 안내하는 대로 DNS만 설정하면 됩니다.)

## 3. 결제 기능은 어떻게 추가하나요?

지금 버전은 무료로 동작합니다. 나중에 유료 전환 시 추천 순서:

1. **PG사 선택**: 국내 서비스라면 토스페이먼츠(문서가 쉬움) 또는
   아임포트/포트원(여러 PG 한번에 연동 가능) 추천
2. 사업자 등록 및 PG사 가맹 계약 (개인 간이과세자도 가능한 곳들이 있음)
3. 결제 성공 시 "무료 횟수 소진" 또는 "월 구독" 여부를 체크하는 로직을
   `/app/api/interpret/route.ts`에 추가 (사용자 인증 + DB 필요해짐)
4. 이 단계부터는 사용자 로그인(예: 카카오 소셜 로그인)과 DB(예: Supabase)가
   함께 필요해집니다 — 준비되시면 이어서 설계 도와드릴게요.

## 4. 프로젝트 구조

```
app/
  page.tsx              # 랜딩 페이지 + 입력 폼
  result/page.tsx        # 결과 페이지 (Suspense 래퍼)
  api/interpret/route.ts # Claude API 호출 서버 라우트
  globals.css             # 디자인 시스템 (은하수 컬러/타이포)
components/
  Starfield.tsx           # 배경 별 애니메이션
  Constellation.tsx        # 생년월일 기반 별자리 SVG
  ResultContent.tsx        # 결과 페이지 실제 로직
lib/
  constellation.ts         # 별자리 생성 알고리즘 (결정론적 시드)
```

## 5. 주의사항

- `ANTHROPIC_API_KEY`는 절대 GitHub에 커밋하지 마세요 (`.gitignore`에 이미 제외 처리됨).
- 실제 만세력(정확한 사주 계산)은 사용하지 않고, AI가 생년월일 정보만 보고
  해석하는 방식입니다. 추후 정확한 오행/십성 계산 로직을 붙이고 싶으시면
  말씀해주세요.
