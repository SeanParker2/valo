"use client";

import { useState, useRef, useEffect, useCallback, Suspense, type ComponentType } from "react";
import { Sidebar, SidebarButton } from "@/components/organisms/Sidebar";
import InfoHover from "@/components/molecules/InfoHover";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  Layout,
  Grid,
  Monitor,
  Settings,
  RotateCw,
  Move,
  ZoomIn,
  Circle,
  Square,
  Triangle,
  Hexagon,
  CheckCircle2,
  Download,
  Camera,
  Aperture,
  Save,
  Play,
  Pause,
  Command,
  Trash2,
  Palette,
  type LucideIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, PresentationControls, Sphere, useGLTF, Html, useProgress } from "@react-three/drei";
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { Group } from "three";

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E`;
const NoiseEffect = Noise as unknown as ComponentType<{ opacity: number }>;

type LightSource = "daylight" | "studio" | "moonlight" | "ember";
type ToolMode = "none" | "rotate" | "pan" | "zoom";

interface LabConfig {
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
  resinType: "standard" | "french" | "environmental" | "vintage";
  resinAge: number;
  translucency: number;
  showGrid: boolean;
  scale: "1/3" | "1/4" | "1/6";
  aspectRatio: "16:9" | "4:3" | "1:1";
  isRendering: boolean;
}

interface Preset {
  id: string;
  name: string;
  config: Omit<LabConfig, "isRendering" | "camera" | "autoRotate">;
}

type GuidanceConfig = Pick<LabConfig, "temperature" | "intensity" | "aperture" | "focalLength" | "focusDistance" | "activeSource">;
type MaterialGuidanceConfig = Pick<LabConfig, "translucency" | "roughness" | "resinAge" | "resinType">;
type LayoutGuidanceConfig = Pick<LabConfig, "scale" | "aspectRatio" | "showGrid">;

function buildGuidance(config: GuidanceConfig) {
  const mood = config.temperature < 3200
    ? "CANDLE WARM"
    : config.temperature < 4500
      ? "GOLDEN"
      : config.temperature < 6000
        ? "NEUTRAL DAY"
        : config.temperature < 7500
          ? "COOL DAY"
          : "MOONLIT";
  const intensity = config.intensity < 0.8
    ? "SOFT VOLUME"
    : config.intensity < 1.2
      ? "BALANCED"
      : config.intensity < 1.6
        ? "CONTRASTED"
        : "HIGH DRAMA";
  const useCase = config.temperature < 3500
    ? "WARM PORTRAIT"
    : config.temperature > 7000
      ? "SCULPT STUDY"
      : "CATALOG NEUTRAL";
  const highlight = config.intensity < 0.9
    ? "SOFT EDGE"
    : config.intensity < 1.3
      ? "DEFINED FORM"
      : "HARD RIM";
  const dof = config.aperture > 0.7
    ? "SHALLOW DOF"
    : config.aperture > 0.4
      ? "MODERATE DOF"
      : "DEEP DOF";
  const perspective = config.focalLength > 0.7
    ? "TELE COMPRESSION"
    : config.focalLength > 0.4
      ? "STANDARD VIEW"
      : "WIDE CONTEXT";
  const focus = config.focusDistance < 0.35
    ? "SUBJECT EMPHASIS"
    : config.focusDistance > 0.7
      ? "SCENE BALANCE"
      : "MID FOCUS";
  const framing = config.focalLength > 0.75
    ? "DETAIL CROP"
    : config.focalLength > 0.5
      ? "PORTRAIT"
      : "FULL BODY";
  const bokeh = config.aperture > 0.7
    ? "BOKEH EMPHASIS"
    : config.aperture > 0.4
      ? "SOFT BACKGROUND"
      : "CRISP LAYERS";

  return {
    mood,
    intensity,
    useCase,
    highlight,
    dof,
    perspective,
    focus,
    framing,
    bokeh
  };
}

function buildMaterialGuidance(config: MaterialGuidanceConfig) {
  const translucency = config.translucency > 0.7
    ? "JELLY GLOW"
    : config.translucency > 0.4
      ? "MILKY DEPTH"
      : "OPAQUE CORE";
  const finish = config.roughness < 0.25
    ? "WET POLISH"
    : config.roughness < 0.55
      ? "SATIN SKIN"
      : "MATTE SHELL";
  const age = config.resinAge > 0.7
    ? "ARCHIVAL PATINA"
    : config.resinAge > 0.35
      ? "AGED RESIN"
      : "FRESH CAST";
  const base = config.resinType === "environmental"
    ? "ECO RESIN"
    : config.resinType === "french"
      ? "FRENCH CAST"
      : config.resinType === "vintage"
        ? "VINTAGE BLEND"
        : "STANDARD BASE";

  return {
    translucency,
    finish,
    age,
    base
  };
}

function buildLayoutGuidance(config: LayoutGuidanceConfig) {
  const scale = config.scale === "1/6"
    ? "MINIATURE STUDY"
    : config.scale === "1/4"
      ? "BALANCED SCALE"
      : "DETAIL SCALE";
  const framing = config.aspectRatio === "16:9"
    ? "CINEMA WIDE"
    : config.aspectRatio === "4:3"
      ? "CLASSIC FRAME"
      : "SQUARE STUDY";
  const composition = config.showGrid
    ? "GRID LOCKED"
    : "FREE COMPOSE";

  return {
    scale,
    framing,
    composition
  };
}

const DEFAULT_PRESETS: Preset[] = [
  {
    id: "studio_neutral",
    name: "Neutral Studio",
    config: { activeSource: "studio", temperature: 5600, intensity: 1.0, envRotation: 0, focalLength: 0.5, aperture: 0.5, focusDistance: 0.5, grain: true, skinTone: "#f5e6d3", roughness: 0.2, resinType: "standard", resinAge: 0, translucency: 0.4, showGrid: true, scale: "1/3", aspectRatio: "16:9" }
  },
  {
    id: "warm_sunset",
    name: "Golden Hour",
    config: { activeSource: "daylight", temperature: 3500, intensity: 1.2, envRotation: 90, focalLength: 0.3, aperture: 0.6, focusDistance: 0.5, grain: true, skinTone: "#f5e6d3", roughness: 0.2, resinType: "standard", resinAge: 0.1, translucency: 0.5, showGrid: false, scale: "1/3", aspectRatio: "16:9" }
  },
  {
    id: "cool_night",
    name: "Moonlight Drama",
    config: { activeSource: "moonlight", temperature: 8000, intensity: 0.8, envRotation: 180, focalLength: 0.8, aperture: 0.2, focusDistance: 0.6, grain: true, skinTone: "#f0f4f5", roughness: 0.1, resinType: "french", resinAge: 0, translucency: 0.6, showGrid: false, scale: "1/3", aspectRatio: "4:3" }
  },
  {
    id: "macro_detail",
    name: "Macro Detail",
    config: { activeSource: "studio", temperature: 5000, intensity: 1.5, envRotation: 45, focalLength: 0.9, aperture: 0.1, focusDistance: 0.2, grain: false, skinTone: "#f5e6d3", roughness: 0.3, resinType: "environmental", resinAge: 0, translucency: 0.3, showGrid: true, scale: "1/4", aspectRatio: "1:1" }
  },
  {
    id: "vintage_mellow",
    name: "Vintage Mellow",
    config: { activeSource: "ember", temperature: 4000, intensity: 0.9, envRotation: 20, focalLength: 0.6, aperture: 0.4, focusDistance: 0.5, grain: true, skinTone: "#f5e6d3", roughness: 0.35, resinType: "vintage", resinAge: 0.6, translucency: 0.2, showGrid: true, scale: "1/3", aspectRatio: "4:3" }
  }
];

function kelvinToRgb(k: number): string {
  const temp = k / 100;
  let r, g, b;

  if (temp <= 66) {
    r = 255;
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
    if (temp <= 19) {
      b = 0;
    } else {
      b = temp - 10;
      b = 138.5177312231 * Math.log(b) - 305.0447927307;
    }
  } else {
    r = temp - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    g = temp - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);
    b = 255;
  }

  return `rgb(${Math.min(255, Math.max(0, r))}, ${Math.min(255, Math.max(0, g))}, ${Math.min(255, Math.max(0, b))})`;
}

function LightRig({ config }: { config: LabConfig }) {
  const lightColor = kelvinToRgb(config.temperature);
  
  return (
    <>
      <ambientLight intensity={0.2 * config.intensity} color={lightColor} />
      
      {config.activeSource === "daylight" && (
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={1.5 * config.intensity} 
          color={lightColor} 
          castShadow 
          shadow-bias={-0.0001}
        />
      )}
      
      {config.activeSource === "studio" && (
        <>
          <spotLight 
            position={[5, 5, 5]} 
            angle={0.15} 
            penumbra={1} 
            intensity={2 * config.intensity} 
            color={lightColor} 
            castShadow 
          />
          <pointLight position={[-5, -5, -5]} intensity={0.5} color="#blue" />
        </>
      )}

      {config.activeSource === "moonlight" && (
        <directionalLight 
          position={[-2, 5, -2]} 
          intensity={0.8 * config.intensity} 
          color="#aaccff" 
          castShadow 
        />
      )}

      {config.activeSource === "ember" && (
        <pointLight 
          position={[2, 0, 2]} 
          intensity={3 * config.intensity} 
          color="#ffaa00" 
          distance={10}
        />
      )}
    </>
  );
}

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 min-w-52">
        <div className="text-valo-gold font-serif text-2xl tracking-widest animate-pulse">VALO</div>
        <div className="text-gray-500 font-mono text-xs tracking-widest">LOADING ASSETS</div>
        <div className="w-full h-0.5 bg-white/10 overflow-hidden">
           <motion.div 
             className="h-full bg-valo-gold"
             initial={{ width: 0 }}
             animate={{ width: `${progress}%` }}
           />
        </div>
        <div className="text-gray-500 font-mono text-xs">{progress.toFixed(0)}%</div>
      </div>
    </Html>
  );
}

function ScreenshotHandler({ 
  captureTrigger, 
  onCaptured 
}: { 
  captureTrigger: boolean, 
  onCaptured: (dataUrl: string) => void 
}) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    if (captureTrigger) {
      gl.render(scene, camera);
      const data = gl.domElement.toDataURL("image/png");
      onCaptured(data);
    }
  }, [captureTrigger, gl, scene, camera, onCaptured]);

  return null;
}

function AutoRotator({ enabled, children }: { enabled: boolean, children: React.ReactNode }) {
  const group = useRef<Group>(null);
  useFrame((state, delta) => {
    if (enabled && group.current) {
      group.current.rotation.y += delta * 0.2;
    }
  });
  return <group ref={group}>{children}</group>;
}

function CustomModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2} />;
}

function ResinSphere({ config }: { config: LabConfig }) {
  const ior = config.resinType === "french" ? 1.54 : config.resinType === "vintage" ? 1.52 : 1.5;
  const clearcoat = config.resinType === "french" ? 1.0 : config.resinType === "vintage" ? 0.3 : 0.5;

  return (
    <Sphere args={[1, 64, 64]}>
       <meshPhysicalMaterial 
         color={config.skinTone} 
         transmission={config.translucency}
         opacity={1}
         metalness={0.1}
         roughness={config.roughness}
         ior={ior}
         thickness={2}
         clearcoat={clearcoat}
         clearcoatRoughness={0.1}
         attenuationColor={config.resinAge > 0 ? "#f0e68c" : "#ffffff"}
         attenuationDistance={1.0 - (config.resinAge * 0.5)}
       />
    </Sphere>
  );
}

export default function LabClient() {
  const [activeTab, setActiveTab] = useState<"light" | "lens" | "presets" | "material" | "layout">("light");
  const [labConfig, setLabConfig] = useState<LabConfig>({
    activeSource: "studio",
    temperature: 5600,
    intensity: 1.0,
    envRotation: 0,
    camera: { zoom: 1, rotation: 0, position: { x: 0, y: 0 } },
    focalLength: 0.5,
    aperture: 0.5,
    focusDistance: 0.5,
    grain: true,
    autoRotate: false,
    skinTone: "#f5e6d3",
    roughness: 0.2,
    resinType: "standard",
    resinAge: 0,
    translucency: 0.4,
    showGrid: true,
    scale: "1/3",
    aspectRatio: "16:9",
    isRendering: false,
  });

  const [customModel, setCustomModel] = useState<string | null>(null);
  const [captureTrigger, setCaptureTrigger] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState<"READY" | "SIMULATING">("READY");
  const [simulationTimeoutId, setSimulationTimeoutId] = useState<ReturnType<typeof setTimeout> | null>(null);

  const [activeTool, setActiveTool] = useState<ToolMode>("none");
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [renderSuccess, setRenderSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  const [savedPresets, setSavedPresets] = useLocalStorage<Preset[]>("valo-lab-presets", []);
  
  const allPresets = [...DEFAULT_PRESETS, ...savedPresets];
  const guidance = buildGuidance(labConfig);
  const materialGuidance = buildMaterialGuidance(labConfig);
  const layoutGuidance = buildLayoutGuidance(labConfig);
  const lightSliders: {
    key: string;
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
  }[] = [
    {
      key: "rotation",
      title: "ENV ROTATION",
      valueDisplay: `${labConfig.envRotation}°`,
      valueActive: hoveredValue === "rotation",
      min: 0,
      max: 360,
      step: 1,
      value: labConfig.envRotation,
      onChange: (nextValue: number) => updateLabParams({ envRotation: nextValue }),
      fillPercent: (labConfig.envRotation / 360) * 100,
      thumbPercent: (labConfig.envRotation / 360) * 94
    },
    {
      key: "temp",
      title: "TEMPERATURE",
      valueDisplay: `${labConfig.temperature}K`,
      valueActive: hoveredValue === "temp" || labConfig.isRendering,
      min: 2000,
      max: 9000,
      step: 100,
      value: labConfig.temperature,
      onChange: (nextValue: number) => updateLabParams({ temperature: nextValue }),
      linePercent: ((labConfig.temperature - 2000) / 7000) * 100,
      thumbPercent: ((labConfig.temperature - 2000) / 7000) * 94,
      showTicks: true,
      useMotionThumb: true,
      bottomLabels: ["WARM / 2000K", "COOL / 9000K"]
    },
    {
      key: "intensity",
      title: "INTENSITY",
      valueDisplay: labConfig.intensity.toFixed(1),
      valueActive: hoveredValue === "intensity",
      min: 0.5,
      max: 2.0,
      step: 0.1,
      value: labConfig.intensity,
      onChange: (nextValue: number) => updateLabParams({ intensity: nextValue }),
      fillPercent: ((labConfig.intensity - 0.5) / 1.5) * 100,
      thumbPercent: ((labConfig.intensity - 0.5) / 1.5) * 94
    }
  ];
  const lensSliders = [
    {
      key: "focal",
      label: "Focal Length",
      valueDisplay: `${(20 + labConfig.focalLength * 180).toFixed(0)}mm`,
      min: 0,
      max: 1,
      step: 0.01,
      value: labConfig.focalLength,
      onChange: (nextValue: number) => updateLabParams({ focalLength: nextValue })
    },
    {
      key: "aperture",
      label: "Aperture (Bokeh)",
      valueDisplay: `f/${(1.4 + (1 - labConfig.aperture) * 14).toFixed(1)}`,
      min: 0,
      max: 1,
      step: 0.01,
      value: labConfig.aperture,
      onChange: (nextValue: number) => updateLabParams({ aperture: nextValue })
    }
  ];
  const materialRanges = [
    {
      key: "translucency",
      title: "TRANSLUCENCY",
      valueDisplay: `${(labConfig.translucency * 100).toFixed(0)}%`,
      min: 0,
      max: 1,
      step: 0.01,
      value: labConfig.translucency,
      onChange: (nextValue: number) => updateLabParams({ translucency: nextValue }),
      leftLabel: "OPAQUE",
      rightLabel: "JELLY"
    },
    {
      key: "resinAge",
      title: "RESIN AGE",
      valueDisplay: `${(labConfig.resinAge * 100).toFixed(0)} YRS`,
      min: 0,
      max: 1,
      step: 0.01,
      value: labConfig.resinAge,
      onChange: (nextValue: number) => updateLabParams({ resinAge: nextValue }),
      leftLabel: "NEW",
      rightLabel: "VINTAGE"
    }
  ];
  const finishRanges = [
    {
      key: "roughness",
      title: "ROUGHNESS / TEXTURE",
      valueDisplay: labConfig.roughness.toFixed(2),
      min: 0,
      max: 1,
      step: 0.01,
      value: labConfig.roughness,
      onChange: (nextValue: number) => updateLabParams({ roughness: nextValue }),
      leftLabel: "GLOSSY",
      rightLabel: "MATTE"
    }
  ];
  const shotGuidanceRows = [
    { label: "SOURCE", value: labConfig.activeSource.toUpperCase() },
    { label: "USE CASE", value: guidance.useCase },
    { label: "HIGHLIGHT", value: guidance.highlight },
    { label: "DEPTH", value: guidance.dof },
    { label: "PERSPECTIVE", value: guidance.perspective },
    { label: "FOCUS", value: guidance.focus },
    { label: "BOKEH", value: guidance.bokeh }
  ];
  const materialGuidanceRows = [
    { label: "TRANSLUCENCY", value: materialGuidance.translucency },
    { label: "AGE", value: materialGuidance.age }
  ];
  const layoutGuidanceRows = [
    { label: "COMPOSITION", value: layoutGuidance.composition }
  ];
  const lensGuidanceRows = [
    { label: "DEPTH", value: guidance.dof },
    { label: "FOCUS", value: guidance.focus },
    { label: "BOKEH", value: guidance.bokeh }
  ];
  const semanticSummary = {
    lighting: guidance,
    material: materialGuidance,
    layout: layoutGuidance
  };

  const handleSavePreset = () => {
    const name = prompt("Name your preset:");
    if (!name) return;
    
    const newPreset: Preset = {
      id: `custom_${Date.now()}`,
      name,
      config: {
        activeSource: labConfig.activeSource,
        temperature: labConfig.temperature,
        intensity: labConfig.intensity,
        envRotation: labConfig.envRotation,
        focalLength: labConfig.focalLength,
        aperture: labConfig.aperture,
        focusDistance: labConfig.focusDistance,
        grain: labConfig.grain,
        skinTone: labConfig.skinTone,
        roughness: labConfig.roughness,
        resinType: labConfig.resinType,
        resinAge: labConfig.resinAge,
        translucency: labConfig.translucency,
        showGrid: labConfig.showGrid,
        scale: labConfig.scale,
        aspectRatio: labConfig.aspectRatio
      }
    };
    
    setSavedPresets([...savedPresets, newPreset]);
  };

  const handleDeletePreset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this preset?")) {
      setSavedPresets(savedPresets.filter(p => p.id !== id));
    }
  };

  const updateLabParams = useCallback((updates: Partial<LabConfig>) => {
    setLabConfig(prev => ({ ...prev, ...updates }));
    if (!labConfig.isRendering) {
      setSimulationStatus("SIMULATING");
      if (simulationTimeoutId) {
        clearTimeout(simulationTimeoutId);
      }
      const nextTimeoutId = setTimeout(() => {
        setSimulationStatus("READY");
      }, 300);
      setSimulationTimeoutId(nextTimeoutId);
    }
  }, [labConfig.isRendering, simulationTimeoutId]);

  const handleRender = useCallback(() => {
    setLabConfig(prev => ({ ...prev, isRendering: true }));
    setRenderSuccess(false);
    setDownloadUrl(null);
    
    setTimeout(() => {
      setCaptureTrigger(true);
    }, 2000);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") return;

      switch(e.key.toLowerCase()) {
        case "r":
          if (!labConfig.isRendering) handleRender();
          break;
        case " ":
          e.preventDefault();
          updateLabParams({ autoRotate: !labConfig.autoRotate });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRender, labConfig, updateLabParams]);

  useEffect(() => {
    return () => {
      if (simulationTimeoutId) clearTimeout(simulationTimeoutId);
      if (customModel) URL.revokeObjectURL(customModel);
    };
  }, [customModel, simulationTimeoutId]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith('.glb') || file.name.endsWith('.gltf'))) {
      const url = URL.createObjectURL(file);
      setCustomModel(url);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCaptureComplete = (dataUrl: string) => {
    setCaptureTrigger(false);
    setLabConfig(prev => ({ ...prev, isRendering: false }));
    setDownloadUrl(dataUrl);
    setRenderSuccess(true);
    setTimeout(() => setRenderSuccess(false), 5000);
  };

  const handleDownload = () => {
    if (downloadUrl) {
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `valo_lab_render_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetScene = () => {
    setCustomModel(null);
    if (customModel) URL.revokeObjectURL(customModel);
    setLabConfig({
      activeSource: "studio",
      temperature: 5600,
      intensity: 1.0,
      envRotation: 0,
      camera: { zoom: 1, rotation: 0, position: { x: 0, y: 0 } },
      focalLength: 0.5,
      aperture: 0.5,
      focusDistance: 0.5,
      grain: true,
      autoRotate: false,
      skinTone: "#f5e6d3",
      roughness: 0.2,
      resinType: "standard",
      resinAge: 0,
      translucency: 0.4,
      showGrid: true,
      scale: "1/3",
      aspectRatio: "16:9",
      isRendering: false,
    });
  };

  const handleExportJSON = () => {
    const exportPayload = {
      config: labConfig,
      summary: semanticSummary
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `valo_lab_config_${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div 
      className="flex h-screen w-screen overflow-hidden bg-lab-bg font-sans text-gray-300 selection:bg-valo-gold/30"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-5 mix-blend-overlay"
        style={{ backgroundImage: `url("${NOISE_SVG}")` }}
      />

      <Sidebar variant="lab">
        <div className="flex flex-col gap-6 w-full items-center px-2">
          <SidebarButton icon={Layout} variant="dark" active={activeTab === "layout"} onClick={() => setActiveTab("layout")} label="Layout" />
          <SidebarButton icon={Settings} variant="dark" active={activeTab === "light"} onClick={() => setActiveTab("light")} label="Lighting" />
          <SidebarButton icon={Camera} variant="dark" active={activeTab === "lens"} onClick={() => setActiveTab("lens")} label="Camera" />
          <SidebarButton icon={Palette} variant="dark" active={activeTab === "material"} onClick={() => setActiveTab("material")} label="Material" />
          <SidebarButton icon={Save} variant="dark" active={activeTab === "presets"} onClick={() => setActiveTab("presets")} label="Presets" />
        </div>
      </Sidebar>

      <main className="flex-1 relative bg-lab-viewport flex flex-col items-center justify-center overflow-hidden cursor-default ml-28 md:ml-32">
        
        <div className="absolute top-10 left-10 right-10 flex justify-between items-start z-30 pointer-events-none select-none">
           <div className="flex flex-col">
             <h1 className="font-serif text-4xl text-white tracking-widest opacity-90">LIGHT LAB</h1>
             <span className="font-mono text-xs text-gray-600 tracking-widest mt-1">MODERN ATELIER v1.1</span>
           </div>
           
           <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-sm">
             <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-500", 
               labConfig.isRendering || simulationStatus === "SIMULATING" ? "bg-amber-500 animate-pulse" : "bg-green-500/80"
             )}></div>
             <span className="font-mono text-xs tracking-widest transition-colors duration-500" style={{ color: labConfig.isRendering || simulationStatus === "SIMULATING" ? '#f59e0b' : 'rgba(34, 197, 94, 0.8)' }}>
                {labConfig.isRendering ? "RENDERING..." : (simulationStatus === "SIMULATING" ? "SIMULATING..." : "ENGINE_READY")}
             </span>
           </div>
        </div>

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-12">
          <div 
            className="relative transition-all duration-700 ease-out bg-lab-viewport pointer-events-auto overflow-hidden"
            style={{
              aspectRatio: labConfig.aspectRatio.replace(':', '/'),
              height: labConfig.aspectRatio === "16:9" ? "100%" : labConfig.aspectRatio === "4:3" ? "90%" : "80%",
              maxHeight: "100%"
            }}
          >
            <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
              <ScreenshotHandler captureTrigger={captureTrigger} onCaptured={handleCaptureComplete} />
              <color attach="background" args={['#0f0f0f']} />
              
              <PresentationControls 
                global 
                zoom={0.8} 
                rotation={[0, -Math.PI / 4, 0]} 
                polar={[-Math.PI / 4, Math.PI / 4]} 
                azimuth={[-Math.PI / 4, Math.PI / 4]}
              >
                <group position={[0, -0.5, 0]}>
                  <AutoRotator enabled={labConfig.autoRotate}>
                    <Suspense fallback={<Loader />}>
                      {customModel ? (
                        <CustomModel url={customModel} />
                      ) : (
                        <ResinSphere config={labConfig} />
                      )}
                    </Suspense>
                  </AutoRotator>
                  <ContactShadows 
                    position={[0, -1.4, 0]} 
                    opacity={0.5} 
                    scale={10} 
                    blur={2.5} 
                    far={4} 
                    frames={labConfig.autoRotate || activeTool !== "none" ? Infinity : 1}
                  />
                  {labConfig.showGrid && (
                    <gridHelper 
                      args={[20, labConfig.scale === "1/6" ? 40 : labConfig.scale === "1/4" ? 30 : 20, 0x333333, 0x111111]} 
                      position={[0, -1.39, 0]} 
                    />
                  )}
                </group>
              </PresentationControls>

              <LightRig config={labConfig} />
              <Suspense fallback={null}>
                <Environment 
                  preset="city" 
                  background={false}
                >
                  <group rotation={[0, (labConfig.envRotation * Math.PI) / 180, 0]} />
                </Environment>
              </Suspense>
              
              <EffectComposer enableNormalPass={false}>
                <DepthOfField 
                  focusDistance={labConfig.focusDistance} 
                  focalLength={labConfig.focalLength} 
                  bokehScale={labConfig.aperture * 5} 
                  height={480} 
                />
                <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
                <Vignette eskil={false} offset={0.1} darkness={0.5} />
                <NoiseEffect opacity={labConfig.grain ? 0.15 : 0} />
              </EffectComposer>
            </Canvas>
          </div>
        </div>

        <AnimatePresence>
          {customModel && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 bg-valo-gold/10 backdrop-blur-md px-4 py-1 rounded-full z-30 pointer-events-none"
            >
              <span className="text-xs text-valo-gold font-mono tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                CUSTOM MODEL ACTIVE
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {labConfig.isRendering && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 pointer-events-none flex items-center justify-center bg-black/10"
            >
              <motion.div 
                className="absolute w-full h-0.5 bg-valo-gold"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <div className="font-mono text-valo-gold text-xs tracking-widest bg-black/80 px-4 py-2 backdrop-blur-md">
                PROCESSING FRAMES...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {renderSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute z-50 flex flex-col items-center gap-4 bg-lab-panel p-8 rounded"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-serif text-2xl text-white mb-1">Render Complete</h3>
                <p className="font-mono text-xs text-gray-500">High-Res Snapshot Generated</p>
                <div className="mt-4 space-y-2">
                  <div className="text-xs font-mono tracking-widest text-gray-500">CAPTURE SUMMARY</div>
                  <div className="font-serif text-lg text-white">
                    {guidance.mood} / {guidance.intensity}
                  </div>
                  <div className="font-mono text-xs text-gray-600 tracking-widest uppercase">
                    {guidance.framing} • {guidance.dof} • {materialGuidance.finish}
                  </div>
                </div>
              </div>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-2 text-white text-xs tracking-widest transition-colors border-b border-transparent hover:text-valo-gold hover:border-valo-gold/60"
              >
                <Download className="w-3 h-3" />
                DOWNLOAD
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-2 bg-lab-panel/90 backdrop-blur-xl rounded-full px-2 py-1.5">
            <div 
              onClick={() => updateLabParams({ autoRotate: !labConfig.autoRotate })}
              className={cn(
                "w-8 h-8 flex items-center justify-center cursor-pointer transition-colors border-b border-transparent",
                labConfig.autoRotate ? "text-valo-gold border-valo-gold/60" : "text-gray-400 hover:text-white hover:border-white/30"
              )}
            >
              {labConfig.autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </div>
            <div className="w-px h-3 bg-white/5 mx-1"></div>
            
            <ControlButton 
              icon={RotateCw} 
              label="ROTATE" 
              active={activeTool === "rotate"}
              onClick={() => setActiveTool(activeTool === "rotate" ? "none" : "rotate")}
            />
            <div className="w-px h-3 bg-white/5 mx-1"></div>
            <ControlButton 
              icon={Move} 
              label="PAN" 
              active={activeTool === "pan"}
              onClick={() => setActiveTool(activeTool === "pan" ? "none" : "pan")}
            />
            <div className="w-px h-3 bg-white/5 mx-1"></div>
            <ControlButton 
              icon={ZoomIn} 
              label="ZOOM" 
              active={activeTool === "zoom"}
              onClick={() => setActiveTool(activeTool === "zoom" ? "none" : "zoom")}
            />
          </div>
          <div className="text-center mt-3 h-4">
             {activeTool !== "none" && (
               <motion.span 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="font-mono text-xs text-valo-gold tracking-widest uppercase"
               >
                 [ DRAG TO ADJUST {activeTool} ]
               </motion.span>
             )}
          </div>
        </div>

      </main>

      <aside className="w-96 bg-lab-panel flex flex-col z-40 shrink-0 relative border-l border-white/5">
        <div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-white/10 to-transparent opacity-50"></div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-12 space-y-16">
          <section>
            <SectionHeader title="CAPTURE SUMMARY" subtitle="GLOBAL" />
            <div className="mt-4 bg-lab-element/30 p-4">
              <div className="text-xs font-mono tracking-widest text-gray-500">MOOD • OPTICS • MATERIAL</div>
              <div className="font-serif text-lg text-white mt-2">
                {guidance.mood} / {guidance.intensity}
              </div>
              <div className="font-mono text-xs text-gray-600 tracking-widest uppercase mt-2">
                {guidance.framing} • {guidance.dof} • {materialGuidance.finish}
              </div>
            </div>
          </section>
          
          {activeTab === "layout" ? (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              <SectionHeader title="VIEWPORT SETTINGS" subtitle="WORKSPACE" />
              
              <div className="grid grid-cols-1 gap-4">
                <div 
                  onClick={() => updateLabParams({ showGrid: !labConfig.showGrid })}
                  className={cn(
                    "flex items-center justify-between p-4 cursor-pointer transition-colors",
                    labConfig.showGrid ? "bg-lab-element/50 text-white" : "bg-lab-element/20 text-gray-500 hover:bg-lab-element/30"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Grid className="w-5 h-5" />
                    <span className="font-serif tracking-wide">Reference Grid</span>
                  </div>
                  <div className={cn("w-2 h-2 rounded-full", labConfig.showGrid ? "bg-valo-gold" : "bg-gray-600")} />
                </div>
              </div>

              <SectionHeader title="SCALE" subtitle="DOLL SIZE" />
              <div className="grid grid-cols-3 gap-3">
                {["1/3", "1/4", "1/6"].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => updateLabParams({ scale: scale as LabConfig["scale"] })}
                    className={cn(
                      "py-3 text-xs font-mono tracking-widest transition-all border-b border-transparent",
                      labConfig.scale === scale 
                        ? "border-valo-gold text-valo-gold" 
                        : "text-gray-500 hover:border-white/30 hover:text-gray-300"
                    )}
                  >
                    {scale}
                  </button>
                ))}
              </div>

              <SectionHeader title="ASPECT RATIO" subtitle="FRAME SIZE" />
              <div className="grid grid-cols-3 gap-3">
                {["16:9", "4:3", "1:1"].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => updateLabParams({ aspectRatio: ratio as LabConfig["aspectRatio"] })}
                    className={cn(
                      "py-3 text-xs font-mono tracking-widest transition-all border-b border-transparent",
                      labConfig.aspectRatio === ratio 
                        ? "border-valo-gold text-valo-gold" 
                        : "text-gray-500 hover:border-white/30 hover:text-gray-300"
                    )}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              <section className="mt-10">
                <SectionHeader title="LAYOUT GUIDANCE" subtitle="COMPOSITION" />
                <div className="mt-4 bg-lab-element/30 p-4">
                  <div className="text-xs font-mono tracking-widest text-gray-500">FRAME</div>
                  <div className="font-serif text-lg text-white mt-2">{layoutGuidance.framing} / {layoutGuidance.scale}</div>
                  <GuidanceRows rows={layoutGuidanceRows} />
                </div>
              </section>

              <div className="p-4 bg-lab-element/40 rounded text-center mt-8">
                 <Monitor className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                 <p className="text-gray-500 text-xs font-sans leading-relaxed">
                   <InfoHover term="Aspect Ratio" definition="The proportional relationship between width and height of the viewport." variant="dark" /> affects the final render output dimensions.
                 </p>
              </div>

            </motion.div>
          ) : activeTab === "light" ? (
            <>
              <section>
                <SectionHeader title="GLOBAL ILLUMINATION" subtitle="SELECT SOURCE" />
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <LightCard 
                    active={labConfig.activeSource === "daylight"} 
                    onClick={() => updateLabParams({ activeSource: "daylight" })}
                    icon={Circle} 
                    label="Daylight"
                    subLabel="5600K"
                  />
                  <LightCard 
                    active={labConfig.activeSource === "studio"} 
                    onClick={() => updateLabParams({ activeSource: "studio" })}
                    icon={Square} 
                    label="Studio"
                    subLabel="FLASH"
                  />
                  <LightCard 
                    active={labConfig.activeSource === "moonlight"} 
                    onClick={() => updateLabParams({ activeSource: "moonlight" })}
                    icon={Hexagon} 
                    label="Moonlight" 
                    subLabel="4200K"
                  />
                  <LightCard 
                    active={labConfig.activeSource === "ember"} 
                    onClick={() => updateLabParams({ activeSource: "ember" })}
                    icon={Triangle} 
                    label="Ember" 
                    subLabel="1800K"
                  />
                </div>
              </section>

              {lightSliders.map((slider) => (
                <RangeBlock
                  key={slider.key}
                  title={slider.title}
                  hoverKey={slider.key}
                  valueDisplay={slider.valueDisplay}
                  valueActive={slider.valueActive}
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  value={slider.value}
                  onChange={slider.onChange}
                  fillPercent={slider.fillPercent}
                  linePercent={slider.linePercent}
                  thumbPercent={slider.thumbPercent}
                  showTicks={slider.showTicks}
                  useMotionThumb={slider.useMotionThumb}
                  bottomLabels={slider.bottomLabels}
                  onHover={setHoveredValue}
                />
              ))}

              <section className="mt-10">
                <SectionHeader title="SHOT GUIDANCE" subtitle="INTERPRETATION" />
                <div className="mt-4 bg-lab-element/30 p-4">
                  <div className="text-xs font-mono tracking-widest text-gray-500">MOOD</div>
                  <div className="font-serif text-lg text-white mt-2">{guidance.mood} / {guidance.intensity}</div>
                  <GuidanceRows rows={shotGuidanceRows} />
                </div>
              </section>
            </>
          ) : activeTab === "material" ? (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8 h-full overflow-y-auto pr-2 custom-scrollbar"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-serif text-white tracking-tight">Material Atelier</h2>
                <p className="text-gray-500 text-xs font-mono">RESIN SIMULATION</p>
              </div>

              <section>
                 <SectionHeader title="RESIN TYPE" subtitle="MATERIAL BASE" />
                 <div className="grid grid-cols-2 gap-2 mt-4">
                   {["standard", "french", "environmental", "vintage"].map((type) => (
                     <button
                       key={type}
                       onClick={() => updateLabParams({ resinType: type as LabConfig["resinType"] })}
                       className={cn(
                         "py-3 text-xs font-mono tracking-widest uppercase transition-all border-b border-transparent",
                         labConfig.resinType === type 
                           ? "border-valo-gold text-valo-gold" 
                           : "text-gray-500 hover:border-white/30 hover:text-gray-300"
                       )}
                     >
                       {type === "environmental" ? "ECO-RESIN" : type}
                     </button>
                   ))}
                 </div>
              </section>

              {materialRanges.map((range) => (
                <MaterialRangeBlock
                  key={range.key}
                  title={range.title}
                  valueDisplay={range.valueDisplay}
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  value={range.value}
                  onChange={range.onChange}
                  leftLabel={range.leftLabel}
                  rightLabel={range.rightLabel}
                />
              ))}

              <div className="h-px bg-linear-to-r from-white/20 to-transparent" />

              <section>
                 <SectionHeader title="SKIN TONE" />
                 <div className="grid grid-cols-4 gap-2 mt-4">
                   {["#f5e6d3", "#fff0e6", "#e8d0b5", "#d6b69c", "#8d5e3f", "#3e2723", "#e0e0e0", "#2a2a2a"].map((color) => (
                     <button
                       key={color}
                       onClick={() => updateLabParams({ skinTone: color })}
                       className={cn(
                         "w-full aspect-square border transition-colors",
                         labConfig.skinTone === color ? "border-valo-gold" : "border-white/10 hover:border-white/30"
                       )}
                       style={{ backgroundColor: color }}
                     />
                   ))}
                 </div>
                <div className="mt-4 flex items-center gap-2 bg-lab-element/20 p-2 rounded-sm">
                   <div className="w-6 h-6 border border-white/10" style={{ backgroundColor: labConfig.skinTone }} />
                    <input 
                      type="text" 
                      value={labConfig.skinTone}
                      onChange={(e) => updateLabParams({ skinTone: e.target.value })}
                      className="bg-transparent text-xs font-mono text-gray-400 w-full outline-none"
                    />
                 </div>
              </section>

              {finishRanges.map((range) => (
                <MaterialRangeBlock
                  key={range.key}
                  title={range.title}
                  valueDisplay={range.valueDisplay}
                  min={range.min}
                  max={range.max}
                  step={range.step}
                  value={range.value}
                  onChange={range.onChange}
                  leftLabel={range.leftLabel}
                  rightLabel={range.rightLabel}
                />
              ))}

              <section className="mt-10">
                <SectionHeader title="MATERIAL GUIDANCE" subtitle="SURFACE LANGUAGE" />
                <div className="mt-4 bg-lab-element/30 p-4">
                  <div className="text-xs font-mono tracking-widest text-gray-500">RESIN PROFILE</div>
                  <div className="font-serif text-lg text-white mt-2">{materialGuidance.base} / {materialGuidance.finish}</div>
                  <GuidanceRows rows={materialGuidanceRows} />
                </div>
              </section>
            </motion.div>
          ) : activeTab === "presets" ? (
            <section>
              <SectionHeader title="WORKFLOW" subtitle="SAVED PRESETS" />
              
              <div className="mt-8 space-y-4">
                {allPresets.map(preset => {
                  const presetGuidance = buildGuidance(preset.config);

                  return (
                    <div 
                      key={preset.id}
                      onClick={() => updateLabParams(preset.config)}
                      className="group relative flex items-center gap-4 p-4 bg-lab-input-bg/30 rounded-sm cursor-pointer hover:bg-lab-element/40 transition-all duration-300"
                    >
                      <div className="w-10 h-10 bg-black/50 rounded flex items-center justify-center text-gray-500 group-hover:text-valo-gold transition-colors">
                        <Command className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-serif text-white text-lg">{preset.name}</div>
                        <div className="font-mono text-xs text-gray-500 tracking-widest uppercase">
                          {preset.config.activeSource} • {preset.config.temperature}K
                        </div>
                        <div className="font-mono text-xs text-gray-600 tracking-widest uppercase mt-1">
                          {presetGuidance.mood} • {presetGuidance.dof} • {presetGuidance.framing}
                        </div>
                      </div>
                      
                      {preset.id.startsWith("custom_") && (
                        <button 
                          onClick={(e) => handleDeletePreset(preset.id, e)}
                          className="absolute right-4 w-8 h-8 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center border-b border-transparent hover:border-red-400/60"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      {labConfig.activeSource === preset.config.activeSource && 
                      labConfig.temperature === preset.config.temperature &&
                      labConfig.intensity === preset.config.intensity && 
                      !preset.id.startsWith("custom_") && (
                        <div className="absolute right-4 w-2 h-2 bg-valo-gold rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-12 p-6 bg-lab-element/20 rounded-sm text-center">
                 <p className="font-sans text-gray-500 text-sm mb-4">Customize your look and save it for later.</p>
                 <div className="flex gap-2 justify-center">
                   <button 
                     onClick={handleSavePreset}
                    className="px-4 py-2 text-white font-mono text-xs tracking-widest transition-colors border-b border-transparent hover:border-valo-gold/60 hover:text-valo-gold"
                   >
                     SAVE STATE
                   </button>
                   <button 
                     onClick={handleExportJSON}
                    className="px-4 py-2 text-white font-mono text-xs tracking-widest transition-colors border-b border-transparent hover:border-valo-gold/60 hover:text-valo-gold flex items-center gap-2"
                   >
                     <Download className="w-3 h-3" />
                     JSON
                   </button>
                   <button 
                    onClick={resetScene}
                   className="px-4 py-2 text-red-400 font-mono text-xs tracking-widest transition-colors border-b border-transparent hover:border-red-400/70 hover:text-red-300 flex items-center gap-2"
                   >
                     <Trash2 className="w-3 h-3" />
                     RESET
                   </button>
                 </div>
              </div>

              <div className="mt-auto pt-12">
                 <div className="flex items-center gap-2 mb-2">
                   <span className="font-mono text-xs text-gray-500 bg-white/10 px-1.5 py-0.5 rounded">SPACE</span>
                   <span className="font-sans text-xs text-gray-400">Toggle Auto-Rotate</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="font-mono text-xs text-gray-500 bg-white/10 px-1.5 py-0.5 rounded">R</span>
                   <span className="font-sans text-xs text-gray-400">Start Render</span>
                 </div>
              </div>
            </section>
          ) : activeTab === "lens" ? (
            <>
              <section>
                <SectionHeader title="CAMERA OPTICS" subtitle="PHYSICAL LENS" />
                
                {lensSliders.map((slider, index) => (
                  <CompactRange
                    key={slider.key}
                    label={slider.label}
                    valueDisplay={slider.valueDisplay}
                    value={slider.value}
                    min={slider.min}
                    max={slider.max}
                    step={slider.step}
                    onChange={slider.onChange}
                    onHover={setHoveredValue}
                    hoverKey={slider.key}
                    className={index === 0 ? "mt-8 mb-8" : "mb-8"}
                  />
                ))}

                <div className="flex items-center justify-between p-4 bg-lab-element/30 rounded-sm cursor-pointer hover:bg-lab-element/50 transition-colors"
                     onClick={() => updateLabParams({ grain: !labConfig.grain })}>
                  <div className="flex items-center gap-3">
                    <Aperture className="w-5 h-5 text-gray-400" />
                    <span className="font-serif text-gray-300">Film Grain</span>
                  </div>
                  <div className={cn("w-4 h-4 rounded-full border border-gray-500", labConfig.grain && "bg-valo-gold border-valo-gold")}></div>
                </div>

                <div className="mt-10">
                  <SectionHeader title="LENS GUIDANCE" subtitle="FRAMING" />
                  <div className="mt-4 bg-lab-element/30 p-4">
                    <div className="text-xs font-mono tracking-widest text-gray-500">OPTICS</div>
                    <div className="font-serif text-lg text-white mt-2">{guidance.framing} / {guidance.perspective}</div>
                    <GuidanceRows rows={lensGuidanceRows} />
                  </div>
                </div>

              </section>
            </>
          ) : null}

        </div>

        <div className="p-12 pt-0 bg-lab-panel">
          <button 
             onClick={handleRender}
             disabled={labConfig.isRendering}
            className="w-full h-16 border-b border-white/20 text-gray-300 font-serif text-lg tracking-widest hover:text-white hover:border-valo-gold/50 transition-all duration-500 flex items-center justify-center gap-4"
           >
             {labConfig.isRendering ? (
              <span className="animate-pulse text-valo-gold">PROCESSING...</span>
             ) : (
              <span>RENDER FRAME</span>
             )}
           </button>
        </div>

      </aside>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-serif text-sm tracking-widest text-gray-400">{title}</h2>
      {subtitle && <span className="font-mono text-xs text-gray-600 tracking-widest uppercase">{subtitle}</span>}
    </div>
  );
}

type GuidanceRow = {
  label: string;
  value: string;
};

function GuidanceRows({ rows }: { rows: GuidanceRow[] }) {
  return (
    <div className="mt-4 space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between text-xs font-mono tracking-widest text-gray-500">
          <span>{row.label}</span>
          <span className="text-gray-300">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

type RangeBlockProps = {
  title: string;
  hoverKey: string;
  valueDisplay: string;
  valueActive: boolean;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  fillPercent?: number;
  linePercent?: number;
  thumbPercent: number;
  showTicks?: boolean;
  useMotionThumb?: boolean;
  bottomLabels?: [string, string];
  onHover: (value: string | null) => void;
};

function RangeBlock({
  title,
  hoverKey,
  valueDisplay,
  valueActive,
  min,
  max,
  step,
  value,
  onChange,
  fillPercent,
  linePercent,
  thumbPercent,
  showTicks,
  useMotionThumb,
  bottomLabels,
  onHover
}: RangeBlockProps) {
  return (
    <section onMouseEnter={() => onHover(hoverKey)} onMouseLeave={() => onHover(null)}>
      <div className="flex justify-between items-baseline mb-6">
        <SectionHeader title={title} />
        <motion.div 
          initial={{ opacity: 0.5 }}
          animate={{ opacity: valueActive ? 1 : 0.6 }}
          className="font-mono text-xl text-valo-gold bg-black/30 px-3 py-1 rounded backdrop-blur-sm"
        >
          {valueDisplay}
        </motion.div>
      </div>
      
      <div className="relative w-full h-16 bg-lab-input-bg/50 rounded-sm flex items-center px-4 overflow-hidden group cursor-ew-resize">
        {showTicks && (
          <div className="absolute inset-0 flex justify-between px-2 opacity-30 pointer-events-none">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className={cn("w-px bg-gray-500", i % 5 === 0 ? "h-6 mt-5" : "h-3 mt-6.5")}></div>
            ))}
          </div>
        )}

        <input 
          type="range" 
          min={min} 
          max={max} 
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-ew-resize"
        />
        {typeof fillPercent === "number" && (
          <div 
            className="absolute h-full bg-valo-gold/20 top-0 left-0 pointer-events-none"
            style={{ width: `${fillPercent}%` }}
          ></div>
        )}
        {typeof linePercent === "number" && (
          <div 
            className="absolute h-px bg-valo-gold/20 top-1/2 left-0 pointer-events-none"
            style={{ width: `${linePercent}%` }}
          ></div>
        )}
        {useMotionThumb ? (
          <motion.div 
            className="absolute h-10 w-1.5 bg-valo-gold rounded-full pointer-events-none z-10"
            style={{ left: `${thumbPercent}%` }}
            layoutId="thumb"
          ></motion.div>
        ) : (
          <div 
            className="absolute h-10 w-1.5 bg-valo-gold rounded-full pointer-events-none z-10"
            style={{ left: `${thumbPercent}%` }}
          ></div>
        )}
      </div>
      
      {bottomLabels && (
        <div className="flex justify-between mt-3 font-mono text-xs text-gray-600 tracking-widest">
          <span>{bottomLabels[0]}</span>
          <span>{bottomLabels[1]}</span>
        </div>
      )}
    </section>
  );
}

type MaterialRangeProps = {
  title: string;
  valueDisplay: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
};

function MaterialRangeBlock({
  title,
  valueDisplay,
  min,
  max,
  step,
  value,
  onChange,
  leftLabel,
  rightLabel
}: MaterialRangeProps) {
  return (
    <section>
      <div className="flex justify-between items-baseline mb-4">
        <SectionHeader title={title} />
        <span className="font-mono text-xs text-valo-gold">{valueDisplay}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer hover:bg-white/20 transition-colors"
      />
      <div className="flex justify-between text-xs text-gray-600 font-mono mt-2">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </section>
  );
}

type CompactRangeProps = {
  label: string;
  valueDisplay: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  onHover: (value: string | null) => void;
  hoverKey: string;
  className?: string;
};

function CompactRange({
  label,
  valueDisplay,
  min,
  max,
  step,
  value,
  onChange,
  onHover,
  hoverKey,
  className
}: CompactRangeProps) {
  return (
    <div className={className} onMouseEnter={() => onHover(hoverKey)} onMouseLeave={() => onHover(null)}>
      <div className="flex justify-between items-baseline mb-4">
         <span className="font-serif text-gray-400">{label}</span>
         <span className="font-mono text-valo-gold">{valueDisplay}</span>
      </div>
      <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <input 
          type="range" min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        />
        <div className="absolute h-full bg-valo-gold" style={{ width: `${value * 100}%` }}></div>
      </div>
    </div>
  );
}

function LightCard({ active, onClick, icon: Icon, label, subLabel }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string, subLabel: string }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "aspect-square flex flex-col justify-between p-4 transition-all duration-300 cursor-pointer group relative overflow-hidden",
        active ? "bg-lab-element/60" : "bg-transparent hover:bg-lab-element/30"
      )}
    >
      <div className="flex justify-between items-start">
        <Icon className={cn("w-5 h-5 transition-colors", active ? "text-valo-gold" : "text-gray-600 group-hover:text-gray-400")} strokeWidth={1} />
        {active && <div className="w-1.5 h-1.5 rounded-full bg-valo-gold"></div>}
      </div>
      
      <div>
        <div className={cn("font-serif text-lg tracking-wide transition-colors", active ? "text-white" : "text-gray-500 group-hover:text-gray-300")}>{label}</div>
        <div className="font-mono text-xs text-gray-600 tracking-widest mt-1">{subLabel}</div>
      </div>
    </div>
  );
}

function ControlButton({ icon: Icon, label, active, onClick }: { icon: LucideIcon, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2 transition-all duration-300 border-b border-transparent hover:border-white/30",
        active ? "text-valo-gold border-valo-gold/60" : "text-gray-400"
      )}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}
