<div align="center">

# CardProfile

**링크 하나로 나를 소개하는 반응형 프로필 카드 빌더**

블록을 끌어다 놓고, 색을 고르고, 저장하면 바로 `내주소/아이디` 공개 페이지가 생겨요.

[**cardprofile-xi.vercel.app**](https://cardprofile-xi.vercel.app) 에서 바로 써보세요

<br />

<img src="docs/demo.gif" alt="블록을 추가하고, 드래그로 순서를 바꾸고, 프리셋과 버튼 스타일을 바꾼 뒤 저장해서 공개 페이지를 여는 시연" width="860" />

<br />
<br />

![Next.js](https://img.shields.io/badge/Next.js_16-000?logo=nextdotjs&logoColor=fff)
![React](https://img.shields.io/badge/React_19-149eca?logo=react&logoColor=fff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-0b1120?logo=tailwindcss&logoColor=38bdf8)
![Supabase](https://img.shields.io/badge/Supabase-1c1c1c?logo=supabase&logoColor=3ecf8e)
![Vercel](https://img.shields.io/badge/Vercel-000?logo=vercel&logoColor=fff)

</div>

## 기능

### 블록으로 만드는 카드
- **블록 6종**: 프로필(사진·이름·소개), 텍스트, 링크 버튼, 소셜 아이콘, 이미지, 구분선
- **드래그로 순서 바꾸기**: 손잡이를 잡고 끌어서 놓으면 끝. 키보드로도 옮길 수 있어요
- **실시간 미리보기**: 고치는 즉시 휴대폰 / 데스크톱 화면으로 확인
- **소셜 아이콘 12종**: 인스타그램, 유튜브, 카카오톡 채널, 네이버 블로그, 스레드, 틱톡, X, 페이스북, GitHub, LinkedIn, 이메일, 웹사이트. 주소 대신 아이디만 적으면 링크가 만들어져요

### 꾸미기
- **프리셋 6종**: 종이, 노을, 밤, 민트, 벚꽃, 모노. 고른 뒤에도 값을 하나씩 바꿀 수 있어요
- **카드 전체**: 배경(단색·그라디언트·방향), 카드 색·불투명도·모서리·테두리·그림자·뒤 배경 흐리게
- **블록마다 따로**: 글꼴, 크기, 색, 굵게·기울임·밑줄, 정렬 / 버튼 모서리(알약·둥근 네모·네모)·스타일(채우기·테두리·연하게)·색 / 아이콘 모양·크기·색 / 프로필 사진 모양·크기
- **글꼴 60개**: 한국어 20(눈누 10 + Google Fonts 10), 영어 20, 일본어 20. 카드에 쓴 글꼴만 불러와요

### 계정과 공개
- 이메일 가입·로그인 (Supabase Auth, Google 로그인 연결 가능)
- 카드 저장, 공개 / 비공개 전환, 프로필 사진 업로드 (Supabase Storage)
- `사이트주소/아이디` 공개 페이지, 휴대폰에 맞춘 반응형 화면
- Supabase 설정이 없으면 **체험 모드**: 계정과 카드가 그 브라우저에만 저장돼요

## 사용한 오픈소스

### 앱

| 라이브러리 | 버전 | 쓰는 곳 | 라이선스 |
| --- | --- | --- | --- |
| [Next.js](https://github.com/vercel/next.js) | 16.4.3 | 앱 프레임워크, 페이지와 라우팅 | MIT |
| [React](https://github.com/facebook/react) / React DOM | 19.3.0 | 화면 구성 | MIT |
| [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) | 4 | 스타일 | MIT |
| [dnd kit](https://github.com/clauderic/dnd-kit) (`core`, `sortable`, `utilities`) | 6.3 / 10.0 / 3.2 | 블록 드래그 정렬 | MIT |
| [supabase-js](https://github.com/supabase/supabase-js) | 2.118 | 로그인, 데이터베이스, 이미지 저장 | MIT |
| [nanoid](https://github.com/ai/nanoid) | 6.0 | 블록 ID 만들기 | MIT |
| [TypeScript](https://github.com/microsoft/TypeScript) | 5 | 타입 검사 (개발용) | Apache-2.0 |
| [ESLint](https://github.com/eslint/eslint) / eslint-config-next | 9 / 16.4 | 코드 검사 (개발용) | MIT |

### 데모 영상 (`video/`, 앱 배포에는 포함되지 않음)

| 라이브러리 | 버전 | 쓰는 곳 | 라이선스 |
| --- | --- | --- | --- |
| [Remotion](https://github.com/remotion-dev/remotion) (`remotion`, `@remotion/cli`, `@remotion/google-fonts`) | 4.0.535 | README 시연 영상 | [Remotion License](https://www.remotion.dev/license): 개인·3인 이하 회사는 무료, 그 이상 영리 회사는 회사 라이선스 필요 |
| [Playwright](https://github.com/microsoft/playwright) | 1.63 | 앱 화면 캡처 | Apache-2.0 |
| [FFmpeg](https://ffmpeg.org/legal.html) | | MP4 → GIF 변환 (설치형 도구) | LGPL 2.1+ / GPL |

### 서비스
- [Supabase](https://supabase.com) (데이터베이스·인증·스토리지, 무료 플랜)와 [Vercel](https://vercel.com) (호스팅, Hobby 플랜)을 써요. 라이브러리가 아닌 외부 서비스라 각 서비스 약관을 따라요.

## 글꼴과 라이선스

글꼴 파일은 저장소에 들어 있지 않아요. 카드를 볼 때 Google Fonts와 jsDelivr(눈누 프로젝트)에서 바로 불러와요. 목록은 [`src/lib/fonts.ts`](src/lib/fonts.ts)에 있어요.

- **화면 기본 글꼴**: [IBM Plex Sans KR](https://fonts.google.com/specimen/IBM+Plex+Sans+KR), SIL Open Font License 1.1
- **Google Fonts 50개**: 48개는 [SIL Open Font License 1.1](https://openfontlicense.org), Roboto Slab과 Kosugi Maru 2개는 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). 라이선스는 [google/fonts](https://github.com/google/fonts) 저장소의 각 글꼴 `METADATA.pb`에서 확인했어요.

<details>
<summary>한국어 10개</summary>

| 글꼴 | 만든 곳 | 라이선스 |
| --- | --- | --- |
| [IBM Plex Sans KR](https://fonts.google.com/specimen/IBM+Plex+Sans+KR) | Mike Abbink, Bold Monday | OFL 1.1 |
| [Noto Sans KR](https://fonts.google.com/specimen/Noto+Sans+KR) | Google | OFL 1.1 |
| [Noto Serif KR](https://fonts.google.com/specimen/Noto+Serif+KR) | Google | OFL 1.1 |
| [Nanum Gothic](https://fonts.google.com/specimen/Nanum+Gothic) | Sandoll Communication | OFL 1.1 |
| [Nanum Myeongjo](https://fonts.google.com/specimen/Nanum+Myeongjo) | Sandoll Communication | OFL 1.1 |
| [Gowun Dodum](https://fonts.google.com/specimen/Gowun+Dodum) | Yanghee Ryu | OFL 1.1 |
| [Gowun Batang](https://fonts.google.com/specimen/Gowun+Batang) | Yanghee Ryu | OFL 1.1 |
| [Jua](https://fonts.google.com/specimen/Jua) | Woowahan Brothers | OFL 1.1 |
| [Do Hyeon](https://fonts.google.com/specimen/Do+Hyeon) | Woowahan Brothers | OFL 1.1 |
| [Nanum Pen Script](https://fonts.google.com/specimen/Nanum+Pen+Script) | Sandoll Communication | OFL 1.1 |

</details>

<details>
<summary>영어 20개</summary>

| 글꼴 | 만든 곳 | 라이선스 |
| --- | --- | --- |
| [Inter](https://fonts.google.com/specimen/Inter) | Rasmus Andersson | OFL 1.1 |
| [Poppins](https://fonts.google.com/specimen/Poppins) | Indian Type Foundry, Jonny Pinhorn, Ninad Kale | OFL 1.1 |
| [Montserrat](https://fonts.google.com/specimen/Montserrat) | Julieta Ulanovsky, Sol Matas, Juan Pablo del Peral, Jacques Le Bailly | OFL 1.1 |
| [DM Sans](https://fonts.google.com/specimen/DM+Sans) | Colophon Foundry | OFL 1.1 |
| [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) | Florian Karsten | OFL 1.1 |
| [Outfit](https://fonts.google.com/specimen/Outfit) | Smartsheet Inc, Rodrigo Fuenzalida | OFL 1.1 |
| [Josefin Sans](https://fonts.google.com/specimen/Josefin+Sans) | Santiago Orozco | OFL 1.1 |
| [Syne](https://fonts.google.com/specimen/Syne) | Bonjour Monde, Lucas Descroix, George Triantafyllakos | OFL 1.1 |
| [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) | Claus Eggers Sørensen | OFL 1.1 |
| [Lora](https://fonts.google.com/specimen/Lora) | Cyreal | OFL 1.1 |
| [Fraunces](https://fonts.google.com/specimen/Fraunces) | Undercase Type, Phaedra Charles, Flavia Zimbardi | OFL 1.1 |
| [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) | Colophon Foundry | OFL 1.1 |
| [Roboto Slab](https://fonts.google.com/specimen/Roboto+Slab) | Christian Robertson | Apache 2.0 |
| [Oswald](https://fonts.google.com/specimen/Oswald) | Vernon Adams, Kalapi Gajjar, Cyreal | OFL 1.1 |
| [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) | Ryoichi Tsunekawa | OFL 1.1 |
| [Archivo Black](https://fonts.google.com/specimen/Archivo+Black) | Omnibus-Type | OFL 1.1 |
| [Righteous](https://fonts.google.com/specimen/Righteous) | Astigmatic | OFL 1.1 |
| [Pacifico](https://fonts.google.com/specimen/Pacifico) | Vernon Adams, Jacques Le Bailly, Botjo Nikoltchev, Ani Petrova | OFL 1.1 |
| [Caveat](https://fonts.google.com/specimen/Caveat) | Impallari Type | OFL 1.1 |
| [Dancing Script](https://fonts.google.com/specimen/Dancing+Script) | Impallari Type | OFL 1.1 |

</details>

<details>
<summary>일본어 20개</summary>

| 글꼴 | 만든 곳 | 라이선스 |
| --- | --- | --- |
| [Noto Sans JP](https://fonts.google.com/specimen/Noto+Sans+JP) | Google | OFL 1.1 |
| [Noto Serif JP](https://fonts.google.com/specimen/Noto+Serif+JP) | Google | OFL 1.1 |
| [M PLUS 1p](https://fonts.google.com/specimen/M+PLUS+1p) | Coji Morishita, M+ Fonts Project | OFL 1.1 |
| [M PLUS Rounded 1c](https://fonts.google.com/specimen/M+PLUS+Rounded+1c) | Coji Morishita, M+ Fonts Project | OFL 1.1 |
| [Zen Kaku Gothic New](https://fonts.google.com/specimen/Zen+Kaku+Gothic+New) | Yoshimichi Ohira | OFL 1.1 |
| [Zen Maru Gothic](https://fonts.google.com/specimen/Zen+Maru+Gothic) | Yoshimichi Ohira | OFL 1.1 |
| [Zen Old Mincho](https://fonts.google.com/specimen/Zen+Old+Mincho) | Yoshimichi Ohira | OFL 1.1 |
| [Shippori Mincho](https://fonts.google.com/specimen/Shippori+Mincho) | FONTDASU | OFL 1.1 |
| [Sawarabi Gothic](https://fonts.google.com/specimen/Sawarabi+Gothic) | mshio | OFL 1.1 |
| [Sawarabi Mincho](https://fonts.google.com/specimen/Sawarabi+Mincho) | mshio | OFL 1.1 |
| [Kosugi Maru](https://fonts.google.com/specimen/Kosugi+Maru) | MOTOYA | Apache 2.0 |
| [BIZ UDPGothic](https://fonts.google.com/specimen/BIZ+UDPGothic) | Type Bank Co., Morisawa Inc. | OFL 1.1 |
| [Kiwi Maru](https://fonts.google.com/specimen/Kiwi+Maru) | Hiroki-Chan | OFL 1.1 |
| [Klee One](https://fonts.google.com/specimen/Klee+One) | Fontworks Inc. | OFL 1.1 |
| [Yomogi](https://fonts.google.com/specimen/Yomogi) | Satsuyako | OFL 1.1 |
| [Hachi Maru Pop](https://fonts.google.com/specimen/Hachi+Maru+Pop) | Nonty | OFL 1.1 |
| [Yusei Magic](https://fonts.google.com/specimen/Yusei+Magic) | Tanukizamurai | OFL 1.1 |
| [Dela Gothic One](https://fonts.google.com/specimen/Dela+Gothic+One) | artakana | OFL 1.1 |
| [RocknRoll One](https://fonts.google.com/specimen/RocknRoll+One) | Fontworks Inc. | OFL 1.1 |
| [DotGothic16](https://fonts.google.com/specimen/DotGothic16) | Fontworks Inc. | OFL 1.1 |

</details>

### 눈누 한국어 글꼴 10개

| 글꼴 | 만든 곳 | 라이선스 | 상업적 사용 | 확인한 곳 |
| --- | --- | --- | --- | --- |
| 프리텐다드 (Pretendard) | 길형진 | SIL OFL 1.1 | 가능 | [LICENSE](https://github.com/orioncactus/pretendard/blob/main/LICENSE) |
| 수트 (SUIT) | SUNN | SIL OFL 1.1 | 가능 | [LICENSE](https://github.com/sun-typeface/SUIT/blob/main/LICENSE) |
| 페이퍼로지 | 이주임 X 김도균 | SIL OFL | 가능 | [눈누](https://noonnu.cc/font_page/1456) |
| 프리젠테이션 | 이주임 | SIL OFL | 가능 | [눈누](https://noonnu.cc/font_page/1369) |
| G마켓 산스 | Gmarket | SIL OFL | 가능 | [Gmarket 공식](https://corp.gmarket.com/fonts/) |
| 마루 부리 | 네이버 | 네이버 나눔글꼴 라이선스 (수정·재배포 가능, 글꼴 판매 금지) | 가능 | [눈누](https://noonnu.cc/font_page/487) |
| 여기어때 잘난체 | 여기어때컴퍼니 | 자체 라이선스 (글꼴 판매·수정 재배포 금지) | 가능 | [눈누](https://noonnu.cc/font_page/115), [공식](https://gccompany.co.kr/font) |
| 카페24 써라운드 | Cafe24 | 카페24 글꼴 약관 (글꼴 판매 금지, 수정본은 OFL) | 가능 | [눈누](https://noonnu.cc/font_page/669), [공식](https://fonts.cafe24.com/) |
| 어그로체 | (주)샌드박스네트워크 | 자체 라이선스 (지식재산권은 샌드박스) | 가능 | [눈누](https://noonnu.cc/font_page/738) |
| 온글잎 박다현체 | 온글잎 / (주)보이저엑스 | 자체 라이선스 (글꼴 파일 수정·배포·판매 금지) | 가능 | [눈누](https://noonnu.cc/font_page/1541) |

이 앱은 글꼴 파일을 고치거나 따로 배포하지 않고, 눈누가 jsDelivr에 올려 둔 웹폰트를 그대로 불러와 화면에 보여줘요. 자체 라이선스 글꼴은 조건이 바뀔 수 있으니 상업적으로 쓰기 전에 배포처 안내를 다시 확인해 주세요.

## 라이선스

아직 저장소에 `LICENSE` 파일이 없어요. 정해지면 이곳과 `LICENSE`에 적을게요.

## 실행하기

```bash
npm install
npm run dev   # http://localhost:3000
```

`.env.local`이 없으면 체험 모드로 실행돼요. Supabase와 Vercel로 배포하는 방법은 [docs/DEPLOY.md](docs/DEPLOY.md), 시연 영상을 다시 만드는 방법은 [video/README.md](video/README.md)에 있어요.
