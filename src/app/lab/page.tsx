"use client";

import { useState, useRef, useEffect, Suspense } from "react";
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
  User,
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

// Three.js Imports
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, PresentationControls, Sphere, Float, useGLTF, Html, useProgress } from "@react-three/drei";
import { EffectComposer, DepthOfField, Bloom, Noise, Vignette } from "@react-three/postprocessing";
import { Group } from "three";

// Noise texture
const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E`;

type LightSource = "daylight" | "studio" | "moonlight" | "ember";
type ToolMode = "none" | "rotate" | "pan" | "zoom";

interface LabConfig {
  activeSource: LightSource;
  temperature: number;
  intensity: number;
  envRotation: number; // 0 - 360
  camera: {
    zoom: number;
    rotation: number;
    position: { x: number; y: number };
  };
  // Lens / Post-processing
  focalLength: number; // 0-1
  aperture: number;    // 0-1 (Bokeh scale)
  focusDistance: number; // 0-1
  grain: boolean;
  autoRotate: boolean;
  // Material
  skinTone: string;
  roughness: number; // 0-1
  resinType: "standard" | "french" | "environmental" | "vintage";
  resinAge: number; // 0-1 (Yellowing factor)
  translucency: number; // 0-1 (SSS factor)
  // Layout
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

// --- HELPER: Kelvin to RGB ---
// Approximate conversion algorithm
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

// --- COMPONENT: Light Rig ---
function LightRig({ config }: { config: LabConfig }) {
  const lightColor = kelvinToRgb(config.temperature);
  
  return (
    <>
      <ambientLight intensity={0.2 * config.intensity} color={lightColor} />
      
      {/* Dynamic Key Light based on Source */}
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

// --- COMPONENT: Loader ---
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-2 min-w-[200px]">
        <div className="text-valo-gold font-mono text-xs tracking-widest">LOADING ASSETS</div>
        <div className="w-full h-[2px] bg-white/10 overflow-hidden">
           <motion.div 
             className="h-full bg-valo-gold"
             initial={{ width: 0 }}
             animate={{ width: `${progress}%` }}
           />
        </div>
        <div className="text-gray-500 font-mono text-[10px]">{progress.toFixed(0)}%</div>
      </div>
    </Html>
  );
}

// --- COMPONENT: Screenshot Handler ---
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

// --- COMPONENT: Custom Model (GLTF) ---
function CustomModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={2} />;
}

// --- COMPONENT: Resin Sphere (Fallback) ---
function ResinSphere({ config }: { config: LabConfig }) {
  // Calculate resin properties based on config
  const ior = config.resinType === "french" ? 1.54 : config.resinType === "vintage" ? 1.52 : 1.5;
  const clearcoat = config.resinType === "french" ? 1.0 : config.resinType === "vintage" ? 0.3 : 0.5;

  return (
    <Sphere args={[1, 64, 64]}>
       <meshPhysicalMaterial 
         color={config.skinTone} 
         transmission={config.translucency} // Resin-like transparency
         opacity={1}
         metalness={0.1}
         roughness={config.roughness}
         ior={ior}
         thickness={2}
         clearcoat={clearcoat}
         clearcoatRoughness={0.1}
         attenuationColor={config.resinAge > 0 ? "#f0e68c" : "#ffffff"} // Yellowing inside the material
         attenuationDistance={1.0 - (config.resinAge * 0.5)} // More age = denser yellowing
       />
    </Sphere>
  );
}

export default function LabPage() {
  // 1. Core State Machine
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
  const simulationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [activeTool, setActiveTool] = useState<ToolMode>("none");
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);
  const [renderSuccess, setRenderSuccess] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  // Custom Presets
  const [savedPresets, setSavedPresets] = useLocalStorage<Preset[]>("valo-lab-presets", []);
  
  const allPresets = [...DEFAULT_PRESETS, ...savedPresets];

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

  // Helper to update config and trigger simulation feedback
  const updateLabParams = (updates: Partial<LabConfig>) => {
    setLabConfig(prev => ({ ...prev, ...updates }));
    
    if (!labConfig.isRendering) {
      setSimulationStatus("SIMULATING");
      
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
      }
      
      simulationTimeoutRef.current = setTimeout(() => {
        setSimulationStatus("READY");
      }, 300);
    }
  };

  // 4. Render Logic
  const handleRender = () => {
    setLabConfig(prev => ({ ...prev, isRendering: true }));
    setRenderSuccess(false);
    setDownloadUrl(null);
    
    // Simulate processing time, then capture
    setTimeout(() => {
      setCaptureTrigger(true); // Trigger internal capture
      // Note: Capture handler will reset trigger and set success
    }, 2000);
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if input is focused
      if (document.activeElement?.tagName === "INPUT") return;

      switch(e.key.toLowerCase()) {
        case "r":
          if (!labConfig.isRendering) handleRender();
          break;
        case " ":
          // Toggle Auto Rotate
          e.preventDefault();
          updateLabParams({ autoRotate: !labConfig.autoRotate });
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [labConfig]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (simulationTimeoutRef.current) clearTimeout(simulationTimeoutRef.current);
      if (customModel) URL.revokeObjectURL(customModel);
    };
  }, []);

  // Drag & Drop Handler
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

  return (
    <div 
      className="flex h-screen w-screen overflow-hidden bg-lab-bg font-sans text-gray-300 selection:bg-valo-gold/30"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Global Noise */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"
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

      {/* --- MAIN VIEWPORT --- */}
      <main className="flex-1 relative bg-lab-viewport flex flex-col items-center justify-center overflow-hidden cursor-default ml-28 md:ml-32">
        
        {/* Top Bar */}
        <div className="absolute top-10 left-10 right-10 flex justify-between items-start z-30 pointer-events-none select-none">
           <div className="flex flex-col">
             <h1 className="font-serif text-4xl text-white tracking-widest opacity-90">LIGHT LAB</h1>
             <span className="font-mono text-[10px] text-gray-600 tracking-[0.3em] mt-1">MODERN ATELIER v1.1</span>
           </div>
           
           <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 rounded-sm border border-white/5">
             <div className={cn("w-1.5 h-1.5 rounded-full transition-colors duration-500", 
               labConfig.isRendering || simulationStatus === "SIMULATING" ? "bg-amber-500 animate-pulse" : "bg-green-500/80 shadow-[0_0_8px_#22c55e]"
             )}></div>
             <span className="font-mono text-[10px] tracking-widest transition-colors duration-500" style={{ color: labConfig.isRendering || simulationStatus === "SIMULATING" ? '#f59e0b' : 'rgba(34, 197, 94, 0.8)' }}>
                {labConfig.isRendering ? "RENDERING..." : (simulationStatus === "SIMULATING" ? "SIMULATING..." : "ENGINE_READY")}
             </span>
           </div>
        </div>

        {/* 3D Scene */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none p-12">
          <div 
            className="relative transition-all duration-700 ease-out shadow-2xl bg-[#0f0f0f] border border-white/5 pointer-events-auto overflow-hidden"
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
                  {/* We use a Group to rotate the environment map */}
                  <group rotation={[0, (labConfig.envRotation * Math.PI) / 180, 0]} />
                </Environment>
              </Suspense>
              
              <EffectComposer disableNormalPass>
                <DepthOfField 
                  focusDistance={labConfig.focusDistance} 
                  focalLength={labConfig.focalLength} 
                  bokehScale={labConfig.aperture * 5} 
                  height={480} 
                />
                <Bloom luminanceThreshold={1} mipmapBlur intensity={0.5} />
                <Vignette eskil={false} offset={0.1} darkness={0.5} />
                {/* @ts-expect-error: Noise component types are missing */}
                <Noise opacity={labConfig.grain ? 0.15 : 0} />
              </EffectComposer>
            </Canvas>
          </div>
        </div>

        {/* Render Scan Effect Overlay */}
        <AnimatePresence>
          {customModel && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 bg-valo-gold/10 backdrop-blur-md px-4 py-1 rounded-full border border-valo-gold/30 z-30 pointer-events-none"
            >
              <span className="text-[10px] text-valo-gold font-mono tracking-widest flex items-center gap-2">
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
              {/* Scan Line */}
              <motion.div 
                className="absolute w-full h-[2px] bg-valo-gold shadow-[0_0_20px_#C69C6D]"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <div className="font-mono text-valo-gold text-xs tracking-[0.5em] bg-black/80 px-4 py-2 border border-valo-gold/20 backdrop-blur-md">
                PROCESSING FRAMES...
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Feedback Overlay */}
        <AnimatePresence>
          {renderSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute z-50 flex flex-col items-center gap-4 bg-[#1a1a1a] border border-green-500/30 p-8 rounded shadow-2xl"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-2">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="text-center">
                <h3 className="font-serif text-2xl text-white mb-1">Render Complete</h3>
                <p className="font-mono text-xs text-gray-500">High-Res Snapshot Generated</p>
              </div>
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold text-xs tracking-widest hover:bg-gray-200 transition-colors"
              >
                <Download className="w-3 h-3" />
                DOWNLOAD
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Analog Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30">
          <div className="flex items-center gap-2 bg-lab-panel/90 backdrop-blur-xl border border-white/5 rounded-full px-2 py-1.5 shadow-2xl">
            {/* Auto Rotate Toggle */}
            <div 
              onClick={() => updateLabParams({ autoRotate: !labConfig.autoRotate })}
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded-full cursor-pointer transition-colors",
                labConfig.autoRotate ? "text-valo-gold bg-white/5" : "text-gray-400 hover:text-white"
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
                 className="font-mono text-[9px] text-valo-gold tracking-widest uppercase"
               >
                 [ DRAG TO ADJUST {activeTool} ]
               </motion.span>
             )}
          </div>
        </div>

      </main>

      {/* --- RIGHT CONTROL PANEL --- */}
      <aside className="w-[440px] bg-lab-panel flex flex-col z-40 shrink-0 relative shadow-[inset_1px_0_0_0_rgba(255,255,255,0.03)]">
        <div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-white/10 to-transparent opacity-50"></div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-12 space-y-16">
          
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
                    "flex items-center justify-between p-4 border rounded-sm cursor-pointer transition-all",
                    labConfig.showGrid ? "bg-white/10 border-valo-gold text-white" : "bg-transparent border-white/5 text-gray-500 hover:border-white/20"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Grid className="w-5 h-5" />
                    <span className="font-serif tracking-wide">Reference Grid</span>
                  </div>
                  <div className={cn("w-3 h-3 rounded-full border", labConfig.showGrid ? "bg-valo-gold border-valo-gold" : "border-gray-600")} />
                </div>
              </div>

              <SectionHeader title="SCALE" subtitle="DOLL SIZE" />
              <div className="grid grid-cols-3 gap-3">
                {["1/3", "1/4", "1/6"].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => updateLabParams({ scale: scale as LabConfig["scale"] })}
                    className={cn(
                      "py-3 border text-xs font-mono tracking-widest transition-all",
                      labConfig.scale === scale 
                        ? "bg-white/10 border-valo-gold text-valo-gold" 
                        : "border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300"
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
                      "py-3 border text-xs font-mono tracking-widest transition-all",
                      labConfig.aspectRatio === ratio 
                        ? "bg-white/10 border-valo-gold text-valo-gold" 
                        : "border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300"
                    )}
                  >
                    {ratio}
                  </button>
                ))}
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded text-center mt-8">
                 <Monitor className="w-6 h-6 text-gray-500 mx-auto mb-2" />
                 <p className="text-gray-500 text-xs font-sans leading-relaxed">
                   <InfoHover term="Aspect Ratio" definition="The proportional relationship between width and height of the viewport." variant="dark" /> affects the final render output dimensions.
                 </p>
              </div>

            </motion.div>
          ) : activeTab === "light" ? (
            <>
              {/* Light Source */}
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

              {/* Environment Rotation */}
              <section onMouseEnter={() => setHoveredValue("rotation")} onMouseLeave={() => setHoveredValue(null)}>
                <div className="flex justify-between items-baseline mb-6">
                  <SectionHeader title="ENV ROTATION" />
                  <motion.div 
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: hoveredValue === "rotation" ? 1 : 0.6 }}
                    className="font-mono text-xl text-valo-gold bg-black/30 px-3 py-1 rounded border border-white/5 backdrop-blur-sm"
                  >
                    {labConfig.envRotation}°
                  </motion.div>
                </div>
                
                <div className="relative w-full h-16 bg-lab-input-bg/50 rounded-sm border border-white/5 flex items-center px-4 overflow-hidden group cursor-ew-resize">
                  <input 
                    type="range" 
                    min="0" 
                    max="360" 
                    step="1"
                    value={labConfig.envRotation}
                    onChange={(e) => updateLabParams({ envRotation: parseFloat(e.target.value) })}
                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-ew-resize"
                  />
                  <div 
                    className="absolute h-full bg-valo-gold/20 top-0 left-0 pointer-events-none"
                    style={{ width: `${(labConfig.envRotation / 360) * 100}%` }}
                  ></div>
                  <div 
                    className="absolute h-10 w-1.5 bg-valo-gold rounded-full shadow-[0_0_15px_rgba(198,156,109,0.5)] pointer-events-none z-10"
                    style={{ left: `${(labConfig.envRotation / 360) * 94}%` }}
                  ></div>
                </div>
              </section>

              {/* Color Temp Dial */}
              <section onMouseEnter={() => setHoveredValue("temp")} onMouseLeave={() => setHoveredValue(null)}>
                <div className="flex justify-between items-baseline mb-6">
                  <SectionHeader title="TEMPERATURE" />
                  <motion.div 
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: hoveredValue === "temp" || labConfig.isRendering ? 1 : 0.6 }}
                    className="font-mono text-xl text-valo-gold bg-black/30 px-3 py-1 rounded border border-white/5 backdrop-blur-sm"
                  >
                    {labConfig.temperature}K
                  </motion.div>
                </div>
                
                {/* Slider */}
                <div className="relative w-full h-16 bg-lab-input-bg/50 rounded-sm border border-white/5 flex items-center px-4 overflow-hidden group cursor-ew-resize">
                  {/* Ruler */}
                  <div className="absolute inset-0 flex justify-between px-2 opacity-30 pointer-events-none">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div key={i} className={cn("w-px bg-gray-500", i % 5 === 0 ? "h-6 mt-5" : "h-3 mt-6.5")}></div>
                    ))}
                  </div>

                  <input 
                    type="range" 
                    min="2000" 
                    max="9000" 
                    step="100"
                    value={labConfig.temperature}
                    onChange={(e) => updateLabParams({ temperature: parseInt(e.target.value) })}
                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-ew-resize"
                  />

                  {/* Thumb */}
                  <motion.div 
                    className="absolute h-10 w-1.5 bg-valo-gold rounded-full shadow-[0_0_15px_rgba(198,156,109,0.5)] pointer-events-none z-10"
                    style={{ left: `${((labConfig.temperature - 2000) / 7000) * 94}%` }}
                    layoutId="thumb"
                  ></motion.div>
                  
                  <div 
                    className="absolute h-px bg-valo-gold/20 top-1/2 left-0 pointer-events-none"
                    style={{ width: `${((labConfig.temperature - 2000) / 7000) * 100}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-3 font-mono text-[10px] text-gray-600 tracking-widest">
                  <span>WARM / 2000K</span>
                  <span>COOL / 9000K</span>
                </div>
              </section>

              {/* Intensity Slider */}
              <section onMouseEnter={() => setHoveredValue("intensity")} onMouseLeave={() => setHoveredValue(null)}>
                <div className="flex justify-between items-baseline mb-6">
                  <SectionHeader title="INTENSITY" />
                  <motion.div 
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: hoveredValue === "intensity" ? 1 : 0.6 }}
                    className="font-mono text-xl text-valo-gold bg-black/30 px-3 py-1 rounded border border-white/5 backdrop-blur-sm"
                  >
                    {labConfig.intensity.toFixed(1)}
                  </motion.div>
                </div>
                
                <div className="relative w-full h-16 bg-lab-input-bg/50 rounded-sm border border-white/5 flex items-center px-4 overflow-hidden group cursor-ew-resize">
                  <input 
                    type="range" 
                    min="0.5" 
                    max="2.0" 
                    step="0.1"
                    value={labConfig.intensity}
                    onChange={(e) => updateLabParams({ intensity: parseFloat(e.target.value) })}
                    className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-ew-resize"
                  />
                  <div 
                    className="absolute h-full bg-valo-gold/20 top-0 left-0 pointer-events-none"
                    style={{ width: `${((labConfig.intensity - 0.5) / 1.5) * 100}%` }}
                  ></div>
                  <div 
                    className="absolute h-10 w-1.5 bg-valo-gold rounded-full shadow-[0_0_15px_rgba(198,156,109,0.5)] pointer-events-none z-10"
                    style={{ left: `${((labConfig.intensity - 0.5) / 1.5) * 94}%` }}
                  ></div>
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

              {/* Resin Type */}
              <section>
                 <SectionHeader title="RESIN TYPE" subtitle="MATERIAL BASE" />
                 <div className="grid grid-cols-2 gap-2 mt-4">
                   {["standard", "french", "environmental", "vintage"].map((type) => (
                     <button
                       key={type}
                       onClick={() => updateLabParams({ resinType: type as LabConfig["resinType"] })}
                       className={cn(
                         "py-3 border text-xs font-mono tracking-widest uppercase transition-all",
                         labConfig.resinType === type 
                           ? "bg-white/10 border-valo-gold text-valo-gold" 
                           : "border-white/5 text-gray-500 hover:border-white/20 hover:text-gray-300"
                       )}
                     >
                       {type === "environmental" ? "ECO-RESIN" : type}
                     </button>
                   ))}
                 </div>
              </section>

              {/* Translucency (SSS) */}
              <section>
                 <div className="flex justify-between items-baseline mb-4">
                   <SectionHeader title="TRANSLUCENCY" />
                   <span className="font-mono text-xs text-valo-gold">{(labConfig.translucency * 100).toFixed(0)}%</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01"
                    value={labConfig.translucency}
                    onChange={(e) => updateLabParams({ translucency: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                 />
                 <div className="flex justify-between text-[10px] text-gray-600 font-mono mt-2">
                    <span>OPAQUE</span>
                    <span>JELLY</span>
                 </div>
              </section>

              {/* Resin Age (Yellowing) */}
              <section>
                 <div className="flex justify-between items-baseline mb-4">
                   <SectionHeader title="RESIN AGE" />
                   <span className="font-mono text-xs text-valo-gold">{(labConfig.resinAge * 100).toFixed(0)} YRS</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01"
                    value={labConfig.resinAge}
                    onChange={(e) => updateLabParams({ resinAge: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                 />
                 <div className="flex justify-between text-[10px] text-gray-600 font-mono mt-2">
                    <span>NEW</span>
                    <span>VINTAGE</span>
                 </div>
              </section>

              <div className="h-px bg-linear-to-r from-white/20 to-transparent" />

              {/* Skin Tone Selector */}
              <section>
                 <SectionHeader title="SKIN TONE" />
                 <div className="grid grid-cols-4 gap-2 mt-4">
                   {["#f5e6d3", "#fff0e6", "#e8d0b5", "#d6b69c", "#8d5e3f", "#3e2723", "#e0e0e0", "#2a2a2a"].map((color) => (
                     <button
                       key={color}
                       onClick={() => updateLabParams({ skinTone: color })}
                       className={cn(
                         "w-full aspect-square rounded-full border-2 transition-all hover:scale-110 shadow-lg",
                         labConfig.skinTone === color ? "border-valo-gold scale-110" : "border-white/10"
                       )}
                       style={{ backgroundColor: color }}
                     />
                   ))}
                 </div>
                 <div className="mt-4 flex items-center gap-2 bg-black/30 p-2 rounded border border-white/5">
                    <div className="w-6 h-6 rounded border border-white/10" style={{ backgroundColor: labConfig.skinTone }} />
                    <input 
                      type="text" 
                      value={labConfig.skinTone}
                      onChange={(e) => updateLabParams({ skinTone: e.target.value })}
                      className="bg-transparent text-xs font-mono text-gray-400 w-full outline-none"
                    />
                 </div>
              </section>

              {/* Roughness Control */}
              <section>
                 <div className="flex justify-between items-baseline mb-4">
                   <SectionHeader title="ROUGHNESS / TEXTURE" />
                   <span className="font-mono text-xs text-valo-gold">{labConfig.roughness.toFixed(2)}</span>
                 </div>
                 <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01"
                    value={labConfig.roughness}
                    onChange={(e) => updateLabParams({ roughness: parseFloat(e.target.value) })}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer hover:bg-white/20 transition-colors"
                 />
                 <div className="flex justify-between text-[10px] text-gray-600 font-mono mt-2">
                    <span>GLOSSY</span>
                    <span>MATTE</span>
                 </div>
              </section>

              <div className="p-4 bg-white/5 border border-white/5 rounded text-center">
                <p className="text-gray-500 text-xs font-sans leading-relaxed">
                  Adjusting the base resin properties. <br/>
                  Lower roughness creates a &quot;wet&quot; or polished look, while higher values simulate sanded resin.
                </p>
              </div>
            </motion.div>
          ) : activeTab === "presets" ? (
            /* PRESETS PANEL */
            <section>
              <SectionHeader title="WORKFLOW" subtitle="SAVED PRESETS" />
              
              <div className="mt-8 space-y-4">
                {allPresets.map(preset => (
                  <div 
                    key={preset.id}
                    onClick={() => updateLabParams(preset.config)}
                    className="group relative flex items-center gap-4 p-4 bg-lab-input-bg/30 border border-white/5 rounded-sm cursor-pointer hover:bg-white/5 hover:border-valo-gold/30 transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-black/50 rounded flex items-center justify-center text-gray-500 group-hover:text-valo-gold transition-colors">
                      <Command className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-serif text-white text-lg">{preset.name}</div>
                      <div className="font-mono text-[10px] text-gray-500 tracking-widest uppercase">
                        {preset.config.activeSource} • {preset.config.temperature}K
                      </div>
                    </div>
                    
                    {/* Delete Button for Custom Presets */}
                    {preset.id.startsWith("custom_") && (
                      <button 
                        onClick={(e) => handleDeletePreset(preset.id, e)}
                        className="absolute right-4 p-2 text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Active Indicator */}
                    {labConfig.activeSource === preset.config.activeSource && 
                     labConfig.temperature === preset.config.temperature &&
                     labConfig.intensity === preset.config.intensity && 
                     !preset.id.startsWith("custom_") && ( // Simple check, ideally check all params
                      <div className="absolute right-4 w-2 h-2 bg-valo-gold rounded-full shadow-[0_0_8px_#C69C6D]"></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 border border-dashed border-white/10 rounded-sm text-center">
                 <p className="font-sans text-gray-500 text-sm mb-4">Customize your look and save it for later.</p>
                 <div className="flex gap-2 justify-center">
                   <button 
                     onClick={handleSavePreset}
                     className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-mono text-xs tracking-widest border border-white/10 rounded transition-colors"
                   >
                     SAVE STATE
                   </button>
                   <button 
                    onClick={resetScene}
                    className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-xs tracking-widest border border-red-500/20 rounded transition-colors flex items-center gap-2"
                   >
                     <Trash2 className="w-3 h-3" />
                     RESET
                   </button>
                 </div>
              </div>

              {/* Keyboard Shortcuts Hint */}
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
              {/* LENS CONTROLS */}
              <section>
                <SectionHeader title="CAMERA OPTICS" subtitle="PHYSICAL LENS" />
                
                {/* Focal Length */}
                <div className="mt-8 mb-8" onMouseEnter={() => setHoveredValue("focal")} onMouseLeave={() => setHoveredValue(null)}>
                  <div className="flex justify-between items-baseline mb-4">
                     <span className="font-serif text-gray-400">Focal Length</span>
                     <span className="font-mono text-valo-gold">{(20 + labConfig.focalLength * 180).toFixed(0)}mm</span>
                  </div>
                  <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <input 
                      type="range" min="0" max="1" step="0.01"
                      value={labConfig.focalLength}
                      onChange={(e) => updateLabParams({ focalLength: parseFloat(e.target.value) })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    />
                    <div className="absolute h-full bg-valo-gold" style={{ width: `${labConfig.focalLength * 100}%` }}></div>
                  </div>
                </div>

                {/* Aperture */}
                <div className="mb-8" onMouseEnter={() => setHoveredValue("aperture")} onMouseLeave={() => setHoveredValue(null)}>
                  <div className="flex justify-between items-baseline mb-4">
                     <span className="font-serif text-gray-400">Aperture (Bokeh)</span>
                     <span className="font-mono text-valo-gold">f/{(1.4 + (1 - labConfig.aperture) * 14).toFixed(1)}</span>
                  </div>
                  <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <input 
                      type="range" min="0" max="1" step="0.01"
                      value={labConfig.aperture}
                      onChange={(e) => updateLabParams({ aperture: parseFloat(e.target.value) })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                    />
                    <div className="absolute h-full bg-valo-gold" style={{ width: `${labConfig.aperture * 100}%` }}></div>
                  </div>
                </div>

                {/* Film Grain */}
                <div className="flex items-center justify-between p-4 border border-white/5 bg-white/5 rounded-sm cursor-pointer hover:bg-white/10 transition-colors"
                     onClick={() => updateLabParams({ grain: !labConfig.grain })}>
                  <div className="flex items-center gap-3">
                    <Aperture className="w-5 h-5 text-gray-400" />
                    <span className="font-serif text-gray-300">Film Grain</span>
                  </div>
                  <div className={cn("w-4 h-4 rounded-full border border-gray-500", labConfig.grain && "bg-valo-gold border-valo-gold")}></div>
                </div>

              </section>
            </>
          ) : null}

        </div>

        {/* Footer Action */}
        <div className="p-12 pt-0 bg-lab-panel">
           <button 
             onClick={handleRender}
             disabled={labConfig.isRendering}
             className="w-full h-16 border border-lab-border text-gray-300 font-serif text-lg tracking-widest hover:bg-white/5 hover:text-white hover:border-valo-gold/50 transition-all duration-500 flex items-center justify-center gap-4 group relative overflow-hidden"
           >
             <div className="absolute inset-0 bg-valo-gold/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
             
             {labConfig.isRendering ? (
               <span className="relative z-10 animate-pulse text-valo-gold">PROCESSING...</span>
             ) : (
               <span className="relative z-10 group-hover:tracking-[0.2em] transition-all">RENDER FRAME</span>
             )}
           </button>
        </div>

      </aside>
    </div>
  );
}

// --- SUB COMPONENTS ---

function SectionHeader({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="font-serif text-sm tracking-[0.2em] text-gray-400">{title}</h2>
      {subtitle && <span className="font-mono text-[10px] text-gray-600 tracking-widest uppercase">{subtitle}</span>}
    </div>
  );
}

function LightCard({ active, onClick, icon: Icon, label, subLabel }: { active: boolean, onClick: () => void, icon: LucideIcon, label: string, subLabel: string }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "aspect-square flex flex-col justify-between p-4 border transition-all duration-300 cursor-pointer group relative overflow-hidden",
        active ? "bg-lab-element border-valo-gold shadow-[0_0_20px_rgba(198,156,109,0.15)]" : "bg-transparent border-white/5 hover:bg-white/5 hover:border-white/10"
      )}
    >
      <div className="flex justify-between items-start">
        <Icon className={cn("w-5 h-5 transition-colors", active ? "text-valo-gold" : "text-gray-600 group-hover:text-gray-400")} strokeWidth={1} />
        {active && <div className="w-1.5 h-1.5 rounded-full bg-valo-gold shadow-[0_0_8px_#C69C6D]"></div>}
      </div>
      
      <div>
        <div className={cn("font-serif text-lg tracking-wide transition-colors", active ? "text-white" : "text-gray-500 group-hover:text-gray-300")}>{label}</div>
        <div className="font-mono text-[9px] text-gray-600 tracking-widest mt-1">{subLabel}</div>
      </div>
    </div>
  );
}

function ControlButton({ icon: Icon, label, active, onClick }: { icon: LucideIcon, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "p-2 rounded-full transition-all duration-300 hover:bg-white/10",
        active ? "text-valo-gold bg-white/10" : "text-gray-400"
      )}
      title={label}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}