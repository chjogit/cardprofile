# 카드프로필

Carrd처럼 링크 하나로 나를 소개하는 반응형 프로필 카드를 만드는 웹 앱이에요.

- 블록(프로필, 텍스트, 링크 버튼, 소셜 아이콘, 이미지, 구분선)을 추가하고 드래그로 순서 바꾸기
- 프리셋 6종(종이, 노을, 밤, 민트, 벚꽃, 모노). 고른 뒤에도 배경, 카드, 글씨, 버튼 값을 하나씩 수정
- 블록별 꾸미기: 글꼴, 크기, 색, 굵게/기울임/밑줄, 정렬, 버튼 모서리·스타일·색, 아이콘 모양·크기
- 글꼴 60개: 한국어 20(눈누 10, Google Fonts 10), 영어 20, 일본어 20 (`src/lib/fonts.ts`)
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

## 실제 서비스로 쓰기 (Supabase)

1. [supabase.com](https://supabase.com)에서 새 프로젝트를 만들어요.
2. SQL Editor에서 `supabase/schema.sql` 내용을 실행해요.
3. Project Settings > API의 URL과 anon key를 `.env.local`에 넣어요. (`.env.example` 참고)
4. Google 로그인을 쓰려면 Authentication > Providers에서 Google을 켜요.
5. 이메일 인증을 끄고 바로 로그인하게 하려면 Authentication > Providers > Email에서 "Confirm email"을 꺼요.

## 배포 (Vercel)

1. Vercel에서 이 저장소를 Import해요.
2. Environment Variables에 위 두 값을 넣고 Deploy해요.
3. Supabase Authentication > URL Configuration의 Site URL을 배포 주소로 바꿔요.

## 구조

- `src/app/page.tsx` 첫 화면
- `src/app/login` 가입·로그인
- `src/app/editor`, `src/components/editor` 카드 편집기
- `src/app/[username]` 공개 카드 페이지
- `src/components/CardView.tsx` 카드 렌더링 (미리보기와 공개 페이지가 함께 사용)
- `src/lib/store.ts` 저장소 (Supabase 또는 체험 모드)
- `src/lib/themes.ts` 테마와 글꼴
