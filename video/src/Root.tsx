import { Composition } from "remotion";
import { Demo } from "./Demo";
import { DURATION, FPS, HEIGHT, WIDTH } from "./timeline";

export const Root = () => (
  <Composition id="Demo" component={Demo} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
