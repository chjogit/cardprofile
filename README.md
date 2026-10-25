# 카드프로필

Carrd처럼 링크 하나로 나를 소개하는 반응형 프로필 카드를 만드는 웹 앱이에요.

- 블록(프로필, 텍스트, 링크 버튼, 소셜 아이콘, 이미지, 구분선)을 추가하고 드래그로 순서 바꾸기
- 테마 4종(종이, 노을, 밤, 민트)과 버튼 색, 배경 색, 글꼴 고르기
- 휴대폰/데스크톱 미리보기
- 이메일 가입·로그인(Supabase 연결 시 Google 로그인도 가능), 저장, 공개/비공개
- `사이트주소/아이디` 공개 페이지

## 실행하기

```bash
npm install
npm run dev
```

http://localhost:3000 을 열어보세요.

`.env.local`이 없으면 **체험 모드**로 실행돼요. 계정과 카드가 그 브라우저의 localStorage에만 저장되므로, 화면과 기능을 확인하는 용도예요.

## 실제 서비스로 배포하기 (무료)

Supabase(데이터베이스)와 Vercel(호스팅) 무료 플랜으로 배포해요.
순서대로 따라 하면 되는 안내는 [docs/DEPLOY.md](docs/DEPLOY.md)에 있어요.

## 구조

- `src/app/page.tsx` 첫 화면
- `src/app/login` 가입·로그인
- `src/app/editor`, `src/components/editor` 카드 편집기
- `src/app/[username]` 공개 카드 페이지
- `src/components/CardView.tsx` 카드 렌더링 (미리보기와 공개 페이지가 함께 사용)
- `src/lib/store.ts` 저장소 (Supabase 또는 체험 모드)
- `src/lib/themes.ts` 테마와 글꼴
