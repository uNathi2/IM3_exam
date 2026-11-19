import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import { WeatherAtmosphere } from '../types';
import { assetUrl } from '../utils/assetPath';
import { Maximize2, Minimize2, RotateCcw, Sliders, Volume2, VolumeX, Eye } from 'lucide-react';

interface ThreePointCloudProps {
  atmosphere: WeatherAtmosphere;
  height?: string;
  isInteractive?: boolean;
  colorScheme?: 'monochrome' | 'amber' | 'thermal' | 'reactive' | 'ply';
  density?: 'low' | 'balanced' | 'high';
  showControls?: boolean;
  modelUrls?: string[];
}

const DEFAULT_HERO_MODEL_URLS = [
  '/assets/Models/hero-pointcloud.ply',
  '/assets/models/hero-pointcloud.ply',
  '/models/hero-pointcloud.ply',
];

function createProceduralCloud(count: number) {
  const positions = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);
  const originalColors = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const t = (i / count) * Math.PI * 24;
    const branch = (i % 7) * ((Math.PI * 2) / 7);
    const radius = 10 + 14 * Math.sin(t * 0.45) * Math.cos(t * 0.18);

    const px = Math.sin(t + branch) * radius + (Math.random() - 0.5) * 6;
    const py =
      Math.sin(t * 1.5) * 12 + ((i / count) - 0.5) * 28 + (Math.random() - 0.5) * 5;
    const pz = Math.cos(t + branch) * radius * 0.75 + (Math.random() - 0.5) * 6;

    positions[i3] = px;
    positions[i3 + 1] = py;
    positions[i3 + 2] = pz;

    basePositions[i3] = px;
    basePositions[i3 + 1] = py;
    basePositions[i3 + 2] = pz;

    originalColors[i3] = 0.08;
    originalColors[i3 + 1] = 0.08;
    originalColors[i3 + 2] = 0.1;

    phases[i] = Math.random() * Math.PI * 2;
  }

  return { count, positions, basePositions, originalColors, phases, hasPlyColors: false };
}

function normalizePlyGeometry(
  rawGeo: THREE.BufferGeometry,
  maxPoints: number
) {
  const posAttr = rawGeo.getAttribute('position') as THREE.BufferAttribute | undefined;
  if (!posAttr || posAttr.count === 0) return null;

  rawGeo.computeBoundingBox();
  rawGeo.center();
  rawGeo.computeBoundingSphere();

  const radius = Math.max(0.0001, rawGeo.boundingSphere?.radius ?? 1);
  const targetRadius = 21;
  const scale = targetRadius / radius;

  const totalVerts = posAttr.count;
  const stride = totalVerts > maxPoints ? Math.ceil(totalVerts / maxPoints) : 1;
  const count = Math.ceil(totalVerts / stride);

  const positions = new Float32Array(count * 3);
  const basePositions = new Float32Array(count * 3);
  const originalColors = new Float32Array(count * 3);
  const phases = new Float32Array(count);

  const colorAttr = rawGeo.getAttribute('color') as THREE.BufferAttribute | undefined;
  const hasPlyColors = Boolean(colorAttr && colorAttr.count === totalVerts);

  let outIdx = 0;
  for (let i = 0; i < totalVerts && outIdx < count; i += stride) {
    const o3 = outIdx * 3;
    const px = posAttr.getX(i) * scale;
    const py = posAttr.getY(i) * scale;
    const pz = posAttr.getZ(i) * scale;

    positions[o3] = px;
    positions[o3 + 1] = py;
    positions[o3 + 2] = pz;

    basePositions[o3] = px;
    basePositions[o3 + 1] = py;
    basePositions[o3 + 2] = pz;

    if (hasPlyColors && colorAttr) {
      originalColors[o3] = colorAttr.getX(i);
      originalColors[o3 + 1] = colorAttr.getY(i);
      originalColors[o3 + 2] = colorAttr.getZ(i);
    } else {
      originalColors[o3] = 0.08;
      originalColors[o3 + 1] = 0.08;
      originalColors[o3 + 2] = 0.1;
    }

    phases[outIdx] = (outIdx * 0.61803398875) % (Math.PI * 2);
    outIdx++;
  }

  return { count: outIdx, positions, basePositions, originalColors, phases, hasPlyColors };
}

async function tryFetchFirstValidPly(
  urls: string[],
  signal: AbortSignal
): Promise<THREE.BufferGeometry | null> {
  const loader = new PLYLoader();

  for (const rawUrl of urls) {
    if (signal.aborted) return null;
    try {
      const res = await fetch(assetUrl(rawUrl), { signal });
      if (!res.ok) continue;

      const contentType = (res.headers.get('content-type') || '').toLowerCase();
      if (contentType.includes('text/html')) continue;

      const buffer = await res.arrayBuffer();
      if (buffer.byteLength < 12) continue;

      // Verify PLY header magic bytes ("ply") before parsing
      const header = new TextDecoder('ascii').decode(new Uint8Array(buffer, 0, 3));
      if (header !== 'ply') continue;

      return loader.parse(buffer);
    } catch {
      // Missing model or aborted — try next candidate or fall back cleanly
    }
  }
  return null;
}

export const ThreePointCloud: React.FC<ThreePointCloudProps> = ({
  atmosphere,
  height = '100%',
  isInteractive = true,
  colorScheme = 'reactive',
  density = 'balanced',
  showControls = false,
  modelUrls = DEFAULT_HERO_MODEL_URLS,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const pointsRef = useRef<THREE.Points | null>(null);
  const animFrameIdRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const rotationVelocityRef = useRef<{ x: number; y: number }>({ x: 0.001, y: 0.002 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.15, y: -0.2 });

  const [hasLoadedPly, setHasLoadedPly] = useState<boolean>(false);
  const [hasPlyVertexColors, setHasPlyVertexColors] = useState<boolean>(false);

  // Interactive controls state
  const [activePalette, setActivePalette] = useState<
    'monochrome' | 'amber' | 'thermal' | 'weather' | 'ply'
  >(colorScheme === 'reactive' ? 'weather' : colorScheme);
  const [turbulenceSpeed, setTurbulenceSpeed] = useState<number>(1.0);
  const [isAudioReactive, setIsAudioReactive] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Sync incoming colorScheme prop
  useEffect(() => {
    setActivePalette(colorScheme === 'reactive' ? 'weather' : colorScheme);
  }, [colorScheme]);

  // Live refs so WebGL loop reacts cleanly without re-creating the renderer
  const atmosphereRef = useRef<WeatherAtmosphere>(atmosphere);
  const activePaletteRef = useRef<'monochrome' | 'amber' | 'thermal' | 'weather' | 'ply'>(
    activePalette
  );
  const turbulenceSpeedRef = useRef<number>(turbulenceSpeed);
  const isAudioReactiveRef = useRef<boolean>(isAudioReactive);
  const colorsDirtyRef = useRef<boolean>(true);

  const cloudDataRef = useRef<{
    count: number;
    basePositions: Float32Array;
    originalColors: Float32Array;
    phases: Float32Array;
    hasPlyColors: boolean;
  } | null>(null);

  useEffect(() => {
    atmosphereRef.current = atmosphere;
    colorsDirtyRef.current = true;
  }, [atmosphere]);

  useEffect(() => {
    activePaletteRef.current = activePalette;
    colorsDirtyRef.current = true;
  }, [activePalette]);

  useEffect(() => {
    turbulenceSpeedRef.current = turbulenceSpeed;
  }, [turbulenceSpeed]);

  useEffect(() => {
    isAudioReactiveRef.current = isAudioReactive;
  }, [isAudioReactive]);

  const particleCount = density === 'high' ? 24000 : density === 'low' ? 8000 : 16000;
  const maxPlyPoints = density === 'high' ? 120000 : density === 'low' ? 25000 : 60000;
  const modelUrlsKey = modelUrls.join('|');

  // Initialize Three.js scene ONCE per particle density
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const heightPx = container.clientHeight || 500;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.011);

    const camera = new THREE.PerspectiveCamera(55, width / heightPx, 0.1, 1000);
    camera.position.set(0, 0, 48);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, heightPx);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    const initial = createProceduralCloud(particleCount);
    cloudDataRef.current = {
      count: initial.count,
      basePositions: initial.basePositions,
      originalColors: initial.originalColors,
      phases: initial.phases,
      hasPlyColors: false,
    };

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(initial.positions, 3));
    geometry.setAttribute(
      'color',
      new THREE.BufferAttribute(new Float32Array(initial.count * 3), 3)
    );

    // Crisp ink-stipple sprite texture for white background
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.42, 'rgba(255,255,255,0.88)');
    gradient.addColorStop(0.75, 'rgba(255,255,255,0.22)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.PointsMaterial({
      size: 1.25,
      map: texture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    pointsRef.current = points;
    scene.add(points);

    colorsDirtyRef.current = true;

    const clock = new THREE.Clock();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let simTime = 0;
    let isVisible = true;

    const applyVertexColors = () => {
      const data = cloudDataRef.current;
      const pts = pointsRef.current;
      if (!data || !pts) return;

      const activeGeo = pts.geometry;
      const colorAttr = activeGeo.getAttribute('color') as THREE.BufferAttribute | undefined;
      if (!colorAttr) return;

      const colorArray = colorAttr.array as Float32Array;
      const palette = activePaletteRef.current;
      const temp = atmosphereRef.current.temperature || 20;
      const { count, basePositions, originalColors, phases, hasPlyColors } = data;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const by = basePositions[i3 + 1];
        const phase = phases[i];

        if (palette === 'ply' && hasPlyColors) {
          colorArray[i3] = originalColors[i3];
          colorArray[i3 + 1] = originalColors[i3 + 1];
          colorArray[i3 + 2] = originalColors[i3 + 2];
        } else if (palette === 'weather') {
          if (hasPlyColors) {
            // Blend original .ply vertex colors subtly with atmospheric tint on white ground
            const tintR = temp < 15 ? 0.05 : temp < 25 ? 0.36 : 0.72;
            const tintG = temp < 15 ? 0.34 : temp < 25 ? 0.12 : 0.25;
            const tintB = temp < 15 ? 0.65 : temp < 25 ? 0.75 : 0.06;
            colorArray[i3] = originalColors[i3] * 0.72 + tintR * 0.28;
            colorArray[i3 + 1] = originalColors[i3 + 1] * 0.72 + tintG * 0.28;
            colorArray[i3 + 2] = originalColors[i3 + 2] * 0.72 + tintB * 0.28;
          } else if (temp < 15) {
            colorArray[i3] = 0.02 + Math.sin(phase) * 0.08;
            colorArray[i3 + 1] = 0.32 + Math.cos(phase) * 0.1;
            colorArray[i3 + 2] = 0.62;
          } else if (temp < 25) {
            const mix = Math.sin(phase) * 0.5 + 0.5;
            colorArray[i3] = 0.06 + mix * 0.36;
            colorArray[i3 + 1] = 0.05 + mix * 0.08;
            colorArray[i3 + 2] = 0.12 + mix * 0.68;
          } else {
            colorArray[i3] = 0.72;
            colorArray[i3 + 1] = 0.25 + Math.cos(phase) * 0.14;
            colorArray[i3 + 2] = 0.04;
          }
        } else if (palette === 'amber') {
          colorArray[i3] = 0.68 + Math.sin(phase) * 0.12;
          colorArray[i3 + 1] = 0.28 + Math.cos(phase) * 0.14;
          colorArray[i3 + 2] = 0.03;
        } else if (palette === 'thermal') {
          const lum = Math.max(0, Math.min(1, (by + 14) / 28));
          colorArray[i3] = 0.72 * lum + 0.1;
          colorArray[i3 + 1] = 0.08 + (1.0 - lum) * 0.18;
          colorArray[i3 + 2] = 0.12 + Math.sin(phase) * 0.12;
        } else {
          const ink = 0.04 + (Math.sin(phase) * 0.5 + 0.5) * 0.34;
          colorArray[i3] = ink;
          colorArray[i3 + 1] = ink;
          colorArray[i3 + 2] = ink + 0.02;
        }
      }

      colorAttr.needsUpdate = true;
      colorsDirtyRef.current = false;
    };

    const animate = () => {
      if (!isVisible || document.hidden) {
        animFrameIdRef.current = 0;
        return;
      }

      const rawDelta = clock.getDelta();
      const delta = Math.min(rawDelta, 0.05);
      const speedMult = prefersReducedMotion ? 0.15 : turbulenceSpeedRef.current;
      simTime += delta * speedMult;

      const atm = atmosphereRef.current;
      const pts = pointsRef.current;
      const data = cloudDataRef.current;

      if (pts && data) {
        if (!isDraggingRef.current) {
          const windDrift = (atm.windSpeed || 10) * 0.00015 * (prefersReducedMotion ? 0.2 : 1);
          targetRotationRef.current.y += windDrift + rotationVelocityRef.current.y * 0.05;
          targetRotationRef.current.x += rotationVelocityRef.current.x * 0.05;
          rotationVelocityRef.current.x *= 0.95;
          rotationVelocityRef.current.y *= 0.95;
        }

        pts.rotation.y = THREE.MathUtils.damp(
          pts.rotation.y,
          targetRotationRef.current.y,
          4.5,
          delta
        );
        pts.rotation.x = THREE.MathUtils.damp(
          pts.rotation.x,
          targetRotationRef.current.x,
          4.5,
          delta
        );

        if (colorsDirtyRef.current) {
          applyVertexColors();
        }

        const activeGeo = pts.geometry;
        const posAttr = activeGeo.getAttribute('position') as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        const { count, basePositions, phases } = data;

        const rainFactor = atm.rainIntensity || 0;
        const windAmp = (atm.windSpeed || 10) / 15;
        const audioFactor = isAudioReactiveRef.current ? Math.sin(simTime * 6) * 0.5 + 0.5 : 0;

        // Slightly gentler wave displacement on real .ply scans so silhouette stays crisp
        const waveScale = data.hasPlyColors ? 0.45 : 1.0;

        for (let i = 0; i < count; i += 2) {
          const i3 = i * 3;
          const bx = basePositions[i3];
          const by = basePositions[i3 + 1];
          const bz = basePositions[i3 + 2];
          const phase = phases[i];

          const waveX = Math.sin(simTime * 1.2 + by * 0.15 + phase) * 1.15 * waveScale;
          const waveY = Math.cos(simTime * 0.9 + bx * 0.15) * 1.05 * waveScale;
          const waveZ = Math.sin(simTime * 1.4 + bz * 0.15) * 1.15 * waveScale;
          const windPush = windAmp * Math.sin(simTime * 0.8 + phase) * waveScale;
          const audioDisplace = audioFactor * (Math.sin(by * 0.2 + phase) * 2.6);

          posArray[i3] = bx + waveX + windPush + audioDisplace;
          posArray[i3 + 1] =
            by + waveY - (rainFactor > 0.3 ? ((simTime * 6 + i) % 8 - 4) * waveScale : 0);
          posArray[i3 + 2] = bz + waveZ + audioDisplace * 0.5;
        }

        posAttr.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (!animFrameIdRef.current && isVisible && !document.hidden) {
        clock.getDelta();
        animFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      if (!newWidth || !newHeight) return;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true;
        if (isVisible) {
          startLoop();
        } else if (animFrameIdRef.current) {
          cancelAnimationFrame(animFrameIdRef.current);
          animFrameIdRef.current = 0;
        }
      },
      { threshold: 0.01 }
    );
    io.observe(container);

    const onVisibilityChange = () => {
      if (document.hidden) {
        if (animFrameIdRef.current) {
          cancelAnimationFrame(animFrameIdRef.current);
          animFrameIdRef.current = 0;
        }
      } else {
        startLoop();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    startLoop();

    return () => {
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      renderer.dispose();
      pointsRef.current?.geometry.dispose();
      material.dispose();
      texture.dispose();
      pointsRef.current = null;
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [particleCount]);

  // Load .ply point cloud dynamically whenever modelUrls changes, falling back cleanly
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const loadModel = async () => {
      const candidates = modelUrls.length > 0 ? modelUrls : DEFAULT_HERO_MODEL_URLS;
      const rawGeo = await tryFetchFirstValidPly(candidates, controller.signal);

      if (!active || controller.signal.aborted) {
        rawGeo?.dispose();
        return;
      }

      if (!rawGeo) {
        setHasLoadedPly(false);
        setHasPlyVertexColors(false);
        return;
      }

      const normalized = normalizePlyGeometry(rawGeo, maxPlyPoints);
      rawGeo.dispose();

      if (!normalized || !pointsRef.current) return;

      const nextGeo = new THREE.BufferGeometry();
      nextGeo.setAttribute('position', new THREE.BufferAttribute(normalized.positions, 3));
      nextGeo.setAttribute(
        'color',
        new THREE.BufferAttribute(new Float32Array(normalized.count * 3), 3)
      );

      const prevGeo = pointsRef.current.geometry;
      pointsRef.current.geometry = nextGeo;
      prevGeo.dispose();

      cloudDataRef.current = {
        count: normalized.count,
        basePositions: normalized.basePositions,
        originalColors: normalized.originalColors,
        phases: normalized.phases,
        hasPlyColors: normalized.hasPlyColors,
      };

      setHasLoadedPly(true);
      setHasPlyVertexColors(normalized.hasPlyColors);
      if (normalized.hasPlyColors) {
        setActivePalette('ply');
      }
      colorsDirtyRef.current = true;
    };

    loadModel();

    return () => {
      active = false;
      controller.abort();
    };
  }, [modelUrlsKey, maxPlyPoints]);

  // Mouse / Touch interaction handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractive) return;
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteractive || !isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    targetRotationRef.current.y += deltaX * 0.007;
    targetRotationRef.current.x += deltaY * 0.007;
    targetRotationRef.current.x = Math.max(
      -Math.PI * 0.45,
      Math.min(Math.PI * 0.45, targetRotationRef.current.x)
    );

    rotationVelocityRef.current = { x: deltaY * 0.003, y: deltaX * 0.003 };
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleResetCamera = useCallback(() => {
    targetRotationRef.current = { x: 0.15, y: -0.2 };
    rotationVelocityRef.current = { x: 0, y: 0.001 };
    if (cameraRef.current) {
      cameraRef.current.fov = 55;
      cameraRef.current.updateProjectionMatrix();
    }
  }, []);

  return (
    <div
      className={`relative w-full overflow-hidden select-none bg-white ${
        isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''
      }`}
      style={{ height: isFullscreen ? '100vh' : height }}
    >
      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`w-full h-full ${isInteractive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'}`}
      />

      {/* Subtle Drag Cue for discovery */}
      {isInteractive && (
        <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 px-3 py-1 bg-white/95 border border-zinc-300 text-[11px] font-mono-custom text-zinc-700 pointer-events-none">
          <Eye className="w-3.5 h-3.5 text-black" />
          <span>{hasLoadedPly ? 'Drag to orbit .PLY scan' : 'Drag to orbit'}</span>
        </div>
      )}

      {/* Audio Reactive Active Label */}
      {isAudioReactive && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-purple-50 border border-purple-300 text-[11px] font-mono-custom text-purple-800 pointer-events-none">
          Audio modulation active
        </div>
      )}

      {/* Unified Bottom Control Dock */}
      {showControls && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-2xl">
          <div className="flex justify-center mb-1">
            <button
              type="button"
              onClick={() => setIsDockCollapsed(!isDockCollapsed)}
              className="px-3 py-0.5 bg-white/95 border border-zinc-300 text-[11px] font-mono-custom text-zinc-700 hover:text-black transition-colors cursor-pointer"
            >
              {isDockCollapsed ? '▴ Show Controls' : '▾ Minimize Controls'}
            </button>
          </div>

          {!isDockCollapsed && (
            <div className="bg-white/95 border border-zinc-300 p-3 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-800 font-mono-custom">
              {/* Palette Switcher */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-zinc-500 text-[11px] uppercase">Palette:</span>
                {hasLoadedPly && hasPlyVertexColors && (
                  <button
                    type="button"
                    onClick={() => setActivePalette('ply')}
                    className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                      activePalette === 'ply'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-black'
                    }`}
                  >
                    Original .PLY
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActivePalette('weather')}
                  className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                    activePalette === 'weather'
                      ? 'bg-purple-700 text-white border-purple-700'
                      : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-black'
                  }`}
                >
                  Live Weather
                </button>
                <button
                  type="button"
                  onClick={() => setActivePalette('monochrome')}
                  className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                    activePalette === 'monochrome'
                      ? 'bg-black text-white border-black'
                      : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-black'
                  }`}
                >
                  Null2 Dither
                </button>
                <button
                  type="button"
                  onClick={() => setActivePalette('amber')}
                  className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                    activePalette === 'amber'
                      ? 'bg-amber-700 text-white border-amber-700'
                      : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-black'
                  }`}
                >
                  Amber Field
                </button>
                <button
                  type="button"
                  onClick={() => setActivePalette('thermal')}
                  className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                    activePalette === 'thermal'
                      ? 'bg-red-700 text-white border-red-700'
                      : 'bg-zinc-100 border-zinc-300 text-zinc-700 hover:text-black'
                  }`}
                >
                  Thermal
                </button>
              </div>

              {/* Turbulence Slider */}
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-zinc-600 text-[11px]">Turbulence:</span>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.1"
                  value={turbulenceSpeed}
                  onChange={(e) => setTurbulenceSpeed(parseFloat(e.target.value))}
                  className="w-20 accent-purple-700 h-1 bg-zinc-200 cursor-pointer"
                />
                <span className="text-zinc-700 text-[11px] w-6 tabular-nums">
                  {turbulenceSpeed.toFixed(1)}x
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAudioReactive(!isAudioReactive)}
                  title="Toggle audio reactivity pulse"
                  aria-label="Toggle audio reactivity"
                  className={`p-1.5 border transition-colors cursor-pointer ${
                    isAudioReactive
                      ? 'bg-purple-700 border-purple-700 text-white'
                      : 'border-zinc-300 hover:bg-zinc-100 text-zinc-600 hover:text-black'
                  }`}
                >
                  {isAudioReactive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={handleResetCamera}
                  title="Reset camera orientation"
                  aria-label="Reset camera orientation"
                  className="p-1.5 border border-zinc-300 hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  title="Toggle fullscreen canvas mode"
                  aria-label="Toggle fullscreen canvas mode"
                  className="p-1.5 border border-zinc-300 hover:bg-zinc-100 text-zinc-600 hover:text-black transition-colors cursor-pointer"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
