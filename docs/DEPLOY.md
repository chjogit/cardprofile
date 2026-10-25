# 무료로 배포하기 (Supabase + Vercel)

두 서비스 모두 무료 플랜으로 충분해요. 신용카드도 필요 없어요. 처음 한 번만 하면 되고, 30분 정도 걸려요.

- **Supabase**: 회원가입·로그인, 카드 저장, 사진 저장 (데이터베이스)
- **Vercel**: 웹사이트를 인터넷에 올리고 주소(`xxx.vercel.app`)를 줘요

## 1. Supabase 프로젝트 만들기

1. [supabase.com](https://supabase.com)에서 **Start your project**를 누르고 GitHub 계정으로 가입해요.
2. **New project**를 눌러요.
   - Name: `cardprofile` (아무거나)
   - Database Password: **Generate a password**를 누르고 어딘가에 적어둬요. (나중에 거의 안 쓰지만 잃어버리면 다시 만들기 번거로워요)
   - Region: **Northeast Asia (Seoul)**
   - Plan: Free
3. **Create new project**를 누르고 1~2분 기다려요.

## 2. 데이터베이스 표 만들기

1. 왼쪽 메뉴에서 **SQL Editor**를 열어요.
2. 저장소의 [`supabase/schema.sql`](../supabase/schema.sql) 내용을 전부 복사해서 붙여넣어요.
3. 오른쪽 아래 **Run**을 눌러요. `Success. No rows returned`가 나오면 끝이에요.
   (여러 번 실행해도 괜찮아요.)

## 3. 로그인 설정

1. 왼쪽 메뉴 **Authentication > Sign In / Providers > Email**을 열어요.
2. **Confirm email**을 꺼요. 무료 플랜은 인증 메일을 한 시간에 몇 통밖에 못 보내서, 켜두면 가입이 막힐 수 있어요.
3. (선택) Google 로그인은 나중에 해도 돼요. 이메일 로그인만으로도 잘 동작해요.

## 4. 키 두 개 복사하기

1. 왼쪽 아래 **Project Settings > API Keys** (또는 **Data API**)를 열어요.
2. 아래 두 값을 메모장에 복사해둬요.
   - **Project URL** (`https://abcd1234.supabase.co` 모양)
   - **anon public** 키 (`eyJ...`로 시작하는 긴 글자). 새 화면에서는 **Publishable key**(`sb_publishable_...`)로 보일 수 있어요. 둘 다 써도 돼요.

> `service_role` / `secret` 키는 절대 쓰지 마세요. 그건 관리자 키예요.
> anon(publishable) 키는 웹사이트에 공개돼도 괜찮은 키예요. 각자 자기 카드만 고칠 수 있게 2번에서 규칙을 걸어뒀어요.

## 5. Vercel에 올리기

1. [vercel.com](https://vercel.com)에서 **Sign Up > Hobby(무료) > Continue with GitHub**로 가입해요.
2. **Add New... > Project**를 누르고 `chjogit/cardprofile` 옆의 **Import**를 눌러요.
   (목록에 없으면 **Adjust GitHub App Permissions**에서 저장소 접근을 허락해요.)
3. Framework는 자동으로 **Next.js**가 잡혀요. 다른 설정은 그대로 둬요.
4. **Environment Variables**를 펼쳐서 두 줄을 넣어요.

   | Key | Value |
   | --- | --- |
   | `NEXT_PUBLIC_SUPABASE_URL` | 4번의 Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 4번의 anon(publishable) 키 |

5. **Deploy**를 눌러요. 1~2분 뒤 `https://cardprofile-xxxx.vercel.app` 같은 주소가 나와요.

## 6. Supabase에 배포 주소 알려주기

1. Supabase로 돌아가 **Authentication > URL Configuration**을 열어요.
2. **Site URL**에 5번에서 받은 주소를 넣고 저장해요. (예: `https://cardprofile-xxxx.vercel.app`)
3. **Redirect URLs**에 `https://cardprofile-xxxx.vercel.app/**`를 추가해요. (Google 로그인을 쓸 때 필요해요)

## 7. 확인하기

1. 배포 주소에 들어가 가입해요. 화면에 "지금은 체험 모드예요" 안내가 없으면 Supabase에 연결된 거예요.
2. 카드를 만들고 저장한 뒤 다른 기기(휴대폰)에서 `배포주소/내아이디`를 열어 보여요.

이후에는 `main`에 push할 때마다 Vercel이 알아서 다시 배포해요.

## 알아두면 좋은 점

- **Supabase 무료 플랜은 7일 동안 아무도 안 쓰면 일시정지돼요.** 대시보드에서 **Restore**를 누르면 데이터 그대로 돌아와요.
- 무료 한도: 데이터베이스 500MB, 파일 1GB. 사진은 올릴 때 작게 줄여서 저장하니 한참 넉넉해요.
- 환경변수를 바꾼 뒤에는 Vercel **Deployments > 맨 위 배포 > ... > Redeploy**를 눌러야 반영돼요.

## (선택) Google 로그인 켜기

1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서 **OAuth 클라이언트 ID**(웹 애플리케이션)를 만들어요.
   - 승인된 리디렉션 URI: Supabase **Authentication > Sign In / Providers > Google** 화면에 나오는 Callback URL (`https://abcd1234.supabase.co/auth/v1/callback`)
2. 받은 Client ID와 Client Secret을 Supabase Google 설정에 넣고 켜요.
