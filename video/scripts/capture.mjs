// 실제 앱(체험 모드)을 띄워 두고 장면마다 스크린샷과 클릭 좌표를 저장한다.
// 사용법: 앱을 `npm run dev -- -p 3100`으로 띄운 뒤 `node scripts/capture.mjs`
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.APP_URL ?? "http://localhost:3100";
const OUT = path.resolve("public/shots");
const SHOW_HOST = "cardprofile-xi.vercel.app";
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.resolve("src"), { recursive: true });

const seed = {
  users: [{ id: "u1", email: "hana@example.com", password: "x" }],
  session: "u1",
  profiles: [
    {
      id: "u1",
      username: "hana",
      published: true,
      updatedAt: new Date().toISOString(),
      card: {
        preset: "paper",
        // design을 비워 두면 앱이 종이 프리셋 값으로 채운다
        blocks: [
          { id: "p1", type: "profile", name: "김하나", bio: "식물 키우는 일러스트레이터", avatar: "" },
          { id: "l1", type: "link", label: "작업 포트폴리오", url: "https://example.com" },
          { id: "s1", type: "socials", items: [{ platform: "instagram", value: "hana" }, { platform: "youtube", value: "hana" }] },
        ],
      },
    },
  ],
};

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();

// 체험 모드 안내와 개발 표시를 숨기고, 주소 표시를 실제 서비스 주소로 바꾼다
const tidy = async () => {
  await page.addStyleTag({
    content: `nextjs-portal{display:none!important} p.bg-cobalt-soft.rounded-xl{display:none!important} *{caret-color:transparent!important}`,
  });
  await page.evaluate((host) => {
    for (const a of document.querySelectorAll("a")) {
      if (a.textContent?.includes("localhost")) a.textContent = a.textContent.replace(/localhost:\d+/, host);
    }
  }, SHOW_HOST);
};

await page.goto(BASE + "/");
await page.evaluate(([k, v]) => localStorage.setItem(k, v), ["cardprofile-demo-v1", JSON.stringify(seed)]);

const meta = {};
const box = async (loc) => {
  const b = await loc.boundingBox();
  return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width, h: b.height, top: b.y, left: b.x };
};
const shot = async (name) => {
  await page.mouse.move(-10, -10);
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, `${name}.png`) });
  console.log("shot", name);
};

await page.goto(BASE + "/editor");
await page.getByRole("button", { name: "+ 링크 버튼" }).waitFor();
await page.evaluate(() => document.fonts.ready);
// 웹폰트를 못 받는 환경에서도 글씨가 보이도록 글꼴 대기 시간(font-display: block)이 지나길 기다린다
await page.waitForTimeout(3500);
await tidy();
// 프로필 블록이 열려 있으면 닫아서 목록을 짧게
await page.getByRole("button", { name: /프로필\s*김하나/ }).click();
await shot("01-editor");

// ① 블록 추가
meta.addLink = await box(page.getByRole("button", { name: "+ 링크 버튼" }));
await page.getByRole("button", { name: "+ 링크 버튼" }).click();
await shot("02-added");
const labelInput = page.getByLabel("버튼 이름");
meta.labelInput = await box(labelInput);
await labelInput.fill("굿즈 스토어");
await page.getByLabel("이동할 주소").fill("https://example.com/shop");
await shot("03-typed");

// ② 드래그로 순서 바꾸기: 새 링크(4번째)를 2번째 자리로
const handles = page.getByRole("button", { name: "링크 버튼 블록 옮기기" });
// 열린 편집기를 닫아 목록만 보이게
await page.getByRole("button", { name: /링크 버튼\s*굿즈 스토어/ }).click();
await shot("04-collapsed");
const from = await box(handles.nth(1));
const fromRow = await box(handles.nth(1).locator("xpath=ancestor::li[1]"));
const to = await box(handles.nth(0));
const toRow = await box(handles.nth(0).locator("xpath=ancestor::li[1]"));
const profRow = await box(page.locator("li").first());
meta.drag = { from, fromRow, to, toRow, profRow };
await page.mouse.move(from.x, from.y);
await page.mouse.down();
await page.mouse.move(from.x, from.y - 10, { steps: 4 });
await page.mouse.move(to.x, to.y - 8, { steps: 15 });
await page.waitForTimeout(300);
await page.mouse.up();
await shot("05-reordered");

// ③ 디자인: 프리셋
meta.designTab = await box(page.getByRole("button", { name: "디자인", exact: true }));
await page.getByRole("button", { name: "디자인", exact: true }).click();
await shot("06-design");
for (const name of ["노을", "밤", "민트"]) {
  meta["preset_" + name] = await box(page.getByRole("button", { name: new RegExp("^" + name) }));
}
await page.getByRole("button", { name: /^밤/ }).click();
await shot("07-night");
await page.getByRole("button", { name: /^민트/ }).click();
await shot("08-mint");
// 버튼 스타일: 테두리
const outline = page.getByRole("radio", { name: "테두리" }).or(page.getByRole("button", { name: "테두리", exact: true }));
await outline.first().scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await shot("09-scrolled");
meta.outline = await box(outline.first());
await outline.first().click();
await shot("10-outline");

// ④ 저장 → 공개
meta.save = await box(page.getByRole("button", { name: "저장", exact: true }));
await page.getByRole("button", { name: "저장", exact: true }).click();
await page.getByRole("status").waitFor();
await tidy();
await shot("11-saved");

// 공개 페이지 (휴대폰 화면)
const m = await browser.newContext({ viewport: { width: 390, height: 780 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
await m.addInitScript(([k, v]) => localStorage.setItem(k, v), ["cardprofile-demo-v1", await page.evaluate(() => localStorage.getItem("cardprofile-demo-v1"))]);
const mp = await m.newPage();
await mp.goto(BASE + "/hana");
await mp.waitForTimeout(1500);
await mp.evaluate(() => document.fonts.ready);
await mp.addStyleTag({ content: `nextjs-portal{display:none!important}` });
await mp.screenshot({ path: path.join(OUT, "12-public.png") });
console.log("shot 12-public");

fs.writeFileSync(path.resolve("src/shots.json"), JSON.stringify(meta, null, 2));
await browser.close();
