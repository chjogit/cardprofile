# 데모 영상 (Remotion)

README 맨 위의 `docs/demo.gif`를 만드는 프로젝트예요. 앱과 따로 설치하고, Vercel 배포에는 포함되지 않아요(`.vercelignore`).
장면, 프레임, 자막은 [BRIEF.md](BRIEF.md)에 정리돼 있어요.

## 다시 만들기

```bash
# 1) 앱을 체험 모드로 띄운다 (.env.local 없이). 저장소 루트에서:
npm run dev -- -p 3100

# 2) 이 폴더에서 설치하고 화면을 캡처한다
cd video
npm install
npm run capture        # public/shots/*.png, src/shots.json

# 3) 미리 보기, 렌더, GIF
npm run studio         # 브라우저에서 타임라인 확인
npm run render         # out/demo.mp4
npm run gif            # ../docs/demo.gif (ffmpeg 필요)
npm run still          # ../docs/cover.png
```

`npm run render`는 `REMOTION_CHROME`(기본 `/opt/pw-browsers/chromium`)에 있는 Chromium을 써요. 다른 컴퓨터에서는 `npx remotion render Demo out/demo.mp4`처럼 실행하면 Remotion이 브라우저를 직접 받아요.

화면이 바뀌어 다시 캡처하면 버튼 좌표는 `src/shots.json`에서 자동으로 따라오고, 타이밍은 `src/timeline.ts`만 고치면 돼요.

Remotion은 개인과 3인 이하 회사는 무료, 그보다 큰 영리 회사는 회사 라이선스가 필요해요([LICENSE](https://www.remotion.dev/license)).
