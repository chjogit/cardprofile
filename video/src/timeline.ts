// 영상의 모든 타이밍은 여기 한 곳에서 정한다. BRIEF.md의 표와 같은 숫자다.
// 좌표는 1280×800 편집기 화면 기준이며, scripts/capture.mjs가 저장한 shots.json에서 온다.
import shots from "./shots.json";

export const FPS = 30;
export const WIDTH = 1280;
export const HEIGHT = 800;

// 장면 경계 (프레임)
export const S = {
  intro: 0, // 제목
  editorIn: 48, // 편집기 등장
  add: 72, // ① 블록 추가
  drag: 188, // ② 드래그로 순서 바꾸기
  preset: 296, // ③ 프리셋
  button: 420, // ④ 버튼 스타일
  publish: 486, // ⑤ 저장하면 바로 공개
  publicIn: 528, // 공개 페이지 등장
  outro: 612, // 마무리
} as const;
export const DURATION = 672; // 22.4초

const d = shots.drag;

// 화면 상태: 이 프레임부터 이 스크린샷을 보여준다 (fade 프레임 동안 이전 화면과 겹친다)
export const SCREENS: { f: number; src: string; fade?: number }[] = [
  { f: 0, src: "01-editor" },
  { f: 108, src: "02-added", fade: 2 },
  { f: 162, src: "03-typed", fade: 2 },
  { f: 192, src: "04-collapsed", fade: 2 },
  { f: 262, src: "05-reordered", fade: 2 },
  { f: 321, src: "06-design", fade: 2 },
  { f: 352, src: "07-night", fade: 2 },
  { f: 394, src: "08-mint", fade: 2 },
  { f: 424, src: "09-scrolled", fade: 8 },
  { f: 456, src: "10-outline", fade: 2 },
  { f: 506, src: "11-saved", fade: 2 },
];

// 카메라: 화면의 어느 점(x, y)을 가운데에 두고 몇 배로 볼지
export const CAMERA: { f: number; x: number; y: number; s: number }[] = [
  { f: 0, x: 640, y: 400, s: 1 },
  { f: 76, x: 640, y: 400, s: 1 },
  { f: 100, x: 330, y: 330, s: 1.45 },
  { f: 180, x: 330, y: 300, s: 1.45 },
  { f: 196, x: 300, y: 260, s: 1.55 },
  { f: 286, x: 300, y: 260, s: 1.55 },
  { f: 304, x: 640, y: 400, s: 1 },
  { f: 420, x: 640, y: 400, s: 1 },
  { f: 436, x: 420, y: 620, s: 1.35 },
  { f: 476, x: 420, y: 620, s: 1.35 },
  { f: 492, x: 640, y: 400, s: 1 },
];

const p = (k: string) => (shots as unknown as Record<string, { x: number; y: number }>)[k];

// 커서 경로 (편집기 화면 좌표)
export const CURSOR: { f: number; x: number; y: number }[] = [
  { f: 72, x: 760, y: 640 },
  { f: 100, x: shots.addLink.x, y: shots.addLink.y },
  { f: 116, x: shots.addLink.x + 4, y: shots.addLink.y + 2 },
  { f: 134, x: shots.labelInput.x - 60, y: shots.labelInput.y },
  { f: 168, x: shots.labelInput.x - 40, y: shots.labelInput.y + 6 },
  { f: 204, x: d.from.x, y: d.from.y },
  { f: 214, x: d.from.x, y: d.from.y },
  { f: 250, x: d.to.x, y: d.to.y },
  { f: 266, x: d.to.x + 6, y: d.to.y + 4 },
  { f: 312, x: shots.designTab.x, y: shots.designTab.y },
  { f: 340, x: p("preset_밤").x, y: p("preset_밤").y },
  { f: 360, x: p("preset_밤").x + 6, y: p("preset_밤").y + 4 },
  { f: 384, x: p("preset_민트").x, y: p("preset_민트").y },
  { f: 420, x: p("preset_민트").x + 10, y: p("preset_민트").y + 30 },
  { f: 450, x: shots.outline.x, y: shots.outline.y },
  { f: 470, x: shots.outline.x + 8, y: shots.outline.y + 6 },
  { f: 500, x: shots.save.x, y: shots.save.y },
  { f: 524, x: shots.save.x - 10, y: shots.save.y + 30 },
];
export const CURSOR_SHOW: [number, number] = [72, 530];

// 클릭 (누르는 순간). 결과 화면은 클릭 3~4프레임 뒤에 바뀐다.
export const CLICKS = [104, 138, 318, 348, 390, 452, 502];

// 타자: 버튼 이름 칸에 "굿즈 스토어"가 써지는 구간
export const TYPE = { from: 140, to: 162, rect: shots.labelInput };

// 드래그: 누르고 있는 구간
export const DRAG = { down: 214, up: 258, ...d };

export const CAPTIONS: { from: number; to: number; n: string; text: string; top?: boolean }[] = [
  { from: S.add, to: S.drag - 4, n: "1", text: "블록을 추가하고 내용을 적어요" },
  { from: S.drag, to: S.preset - 4, n: "2", text: "드래그로 순서를 바꿔요" },
  { from: S.preset, to: S.button - 4, n: "3", text: "프리셋으로 분위기를 한 번에" },
  { from: S.button, to: S.publish - 4, n: "4", text: "버튼 모양도 하나씩 바꿀 수 있어요", top: true },
  { from: S.publish, to: S.outro - 4, n: "5", text: "저장하면 바로 내 주소로 공개" },
];
