export type LightSource = "daylight" | "studio" | "moonlight" | "ember";
export type ToolMode = "none" | "rotate" | "pan" | "zoom";
export type ResinType = "standard" | "french" | "environmental" | "vintage";
export type Scale = "1/3" | "1/4" | "1/6";
export type AspectRatio = "16:9" | "4:3" | "1:1";
export type LabTab = "light" | "lens" | "presets" | "material" | "layout";

export interface LabConfig {
  activeSource: LightSource;
  temperature: number;
  intensity: number;
  envRotation: number;
  camera: {
    zoom: number;
    rotation: number;
    position: { x: number; y: number };
  };
  focalLength: number;
  aperture: number;
  focusDistance: number;
  grain: boolean;
  autoRotate: boolean;
  skinTone: string;
  roughness: number;
  resinType: ResinType;
  resinAge: number;
  translucency: number;
  showGrid: boolean;
  scale: Scale;
  aspectRatio: AspectRatio;
  isRendering: boolean;
}

export interface Preset {
  id: string;
  name: string;
  config: Omit<LabConfig, "isRendering" | "camera" | "autoRotate">;
}

export type GuidanceConfig = Pick<LabConfig, "temperature" | "intensity" | "aperture" | "focalLength" | "focusDistance" | "activeSource">;
export type MaterialGuidanceConfig = Pick<LabConfig, "translucency" | "roughness" | "resinAge" | "resinType">;
export type LayoutGuidanceConfig = Pick<LabConfig, "scale" | "aspectRatio" | "showGrid">;

export interface GuidanceResult {
  mood: string;
  intensity: string;
  useCase: string;
  highlight: string;
  dof: string;
  perspective: string;
  focus: string;
  framing: string;
  bokeh: string;
}

export interface MaterialGuidanceResult {
  translucency: string;
  finish: string;
  age: string;
  base: string;
}

export interface LayoutGuidanceResult {
  scale: string;
  framing: string;
  composition: string;
}

export interface GuidanceRow {
  label: string;
  value: string;
}

export interface LightSliderConfig {
  hoverKey: string;
  title: string;
  valueDisplay: string;
  valueActive: boolean;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (nextValue: number) => void;
  fillPercent?: number;
  linePercent?: number;
  thumbPercent: number;
  showTicks?: boolean;
  useMotionThumb?: boolean;
  bottomLabels?: [string, string];
}

export interface LensSliderConfig {
  key: string;
  label: string;
  valueDisplay: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (nextValue: number) => void;
}

export interface MaterialRangeConfig {
  key: string;
  title: string;
  valueDisplay: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (nextValue: number) => void;
  leftLabel: string;
  rightLabel: string;
}
