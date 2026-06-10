export interface DollSpec {
  material: string;
  height: string;
  wigSize: string;
  eyeSize: string;
  weight: string;
  joints: number;
  resin: string;
}

export interface ResinColor {
  name: string;
  hex: string;
  description: string;
  available: boolean;
}

export interface PoseCapability {
  name: string;
  description: string;
  achievable: boolean;
}

export interface Compatibility {
  wigSize: string;
  eyeSize: string;
  clothingScale: string;
  shoeSize: string;
  compatibleBrands?: string[];
}

export interface Pricing {
  basePrice: number;
  currency: string;
  layaway: boolean;
  layawayMonths?: number;
  status: "available" | "preorder" | "waitlist" | "sold_out" | "concept";
  nextRestock?: string;
}

export interface LabPreset {
  name: string;
  activeSource: "daylight" | "studio" | "moonlight" | "ember";
  temperature: number;
  intensity: number;
  description: string;
}

export interface Doll {
  id: string;
  name: string;
  series: string;
  year: string;
  type: string;
  image: string;
  gallery: string[];
  spec: DollSpec;
  narrative: string;
  relatedIds: string[];
  resinColors: ResinColor[];
  poseCapabilities: PoseCapability[];
  compatibility: Compatibility;
  pricing: Pricing;
  features: string[];
  defaultSkinTone: string;
  defaultResinType: "standard" | "french" | "environmental" | "vintage";
  labPresets: LabPreset[];
}

export type DollSeries = "Series 01" | "Series 02" | "Collab" | "Concept" | "One-off";
export type DollType = "Standard" | "Limited" | "Prototype" | "One-off" | "Render" | "Sold Out";
