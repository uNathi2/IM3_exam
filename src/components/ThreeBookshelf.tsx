import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { StudyGraphic } from './StudyGraphic';
import { AetherLogo } from './AetherLogo';
import TypographicTides from './originkit/ui/typographic-tides';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowUpRight,
} from 'lucide-react';

export interface BookIssueData {
  id: string;
  issueNumber: string;
  title: string;
  subtitle: string;
  date: string;
  spineColor: string;
  accentColor: string;
  status: 'published' | 'curating' | 'upcoming';
  featuresCount: number;
  pages: {
    left: {
      type: 'cover' | 'toc' | 'article_intro' | 'interview' | 'process' | 'back';
      kicker?: string;
      title: string;
      subtitle?: string;
      body: string;
      quote?: string;
      meta?: string;
      author?: string;
      graphicType?: 'monochrome_signal' | 'composite_quad' | 'amber_field' | 'thermal_mask' | 'textile_folds' | 'where_light_stays';
    };
    right: {
      type: 'toc' | 'article_intro' | 'image' | 'specs' | 'colophon' | 'back';
      kicker?: string;
      title: string;
      subtitle?: string;
      body: string;
      quote?: string;
      meta?: string;
      author?: string;
      hasFeatureAction?: boolean;
      hasSubmitAction?: boolean;
      graphicType?: 'monochrome_signal' | 'composite_quad' | 'amber_field' | 'thermal_mask' | 'textile_folds' | 'where_light_stays';
    };
  }[];
}

export const BOOK_ISSUES: BookIssueData[] = [
  {
    id: 'issue_001',
    issueNumber: 'ISSUE 001',
    title: 'Another Side of the Signal',
    subtitle: 'TouchDesigner studies, tactile drapes, and long exposure light orbits.',
    date: 'October 2026',
    spineColor: '#181822',
    accentColor: '#c084fc',
    status: 'published',
    featuresCount: 3,
    pages: [
      {
        left: {
          type: 'cover',
          kicker: 'Inaugural Edition · October 2026',
          title: 'æther.mag',
          subtitle: 'Work, beyond the feed.',
          body: 'An independent digital magazine and showcase presenting creative work alongside its story, iterations, and unfiltered process.',
          meta: 'Volume 01 · Issue 001 · Johannesburg',
          graphicType: 'monochrome_signal',
        },
        right: {
          type: 'toc',
          kicker: 'Contents & Curation',
          title: 'Inside Issue 001',
          subtitle: 'Three different ways of seeing',
          body: '01. Signal and Noise — Nkosinathi Titus (TouchDesigner, Johannesburg)\n\n02. A Language Made of Folds — Noa Vale (Textile Sculpture, Berlin)\n\n03. Where the Light Stays — Eli Kade (Nocturnal Photography, Tokyo)\n\n04. The Hours Around It — Curatorial Colophon & Failure Log',
          quote: '"A feed shows the finished frame. We are interested in the hours around it."',
          meta: 'Published October 2026',
        },
      },
      {
        left: {
          type: 'article_intro',
          kicker: 'Project 01 · TouchDesigner Studies',
          title: 'Signal and Noise',
          subtitle: 'By Nkosinathi Titus',
          body: 'Exploring the space between algorithmic noise and organic botanical growth through recursive TOP feedback loops. By feeding pixel displacement buffers back into Simplex noise generators, the artwork generates autonomous dendritic branching that mimics lichen and frost.',
          quote: '"A feedback gain slider shifted by 0.002 turns a delicate bloom into white noise."',
          author: 'Nkosinathi Titus (Creative Coder)',
          graphicType: 'monochrome_signal',
        },
        right: {
          type: 'specs',
          kicker: 'Technical Documentation · 14 Studies',
          title: 'Operator Architecture',
          subtitle: 'Noise TOP → Feedback TOP → Displace TOP → SOP Point Cloud',
          body: 'The live interactive version of this issue binds the point cloud directly to real-time Open-Meteo weather data from central Johannesburg. Gale ridge winds increase particle velocity, and temperature shifts the spectral luminance.',
          meta: 'Parameters: Gain 0.982 · Period 2.40 · Seed 442 · 24.5k Points',
          hasFeatureAction: true,
          graphicType: 'amber_field',
        },
      },
      {
        left: {
          type: 'article_intro',
          kicker: 'Feature 02 · Material Research',
          title: 'A Language Made of Folds',
          subtitle: 'By Noa Vale (Berlin)',
          body: 'Heavy unbleached linen suspended from industrial rigging beams. Investigating the silent acoustic dampening properties of draped fibers and the memory retained within fabric creases under tension.',
          quote: '"Textiles hold gravitational memory in their fibers long after tension is released."',
          author: 'Noa Vale (Material Researcher)',
          graphicType: 'textile_folds',
        },
        right: {
          type: 'image',
          kicker: 'Installation Studies',
          title: 'Spatial Drape 04',
          subtitle: 'Natural Flax Linen & Stainless Rigging',
          body: 'Exhibited in the turbine hall of former power station Kraftwerk Berlin. The folds create micro-acoustic pockets that reduce room reverberation by 4.2 decibels.',
          meta: 'Dimensions: 6.2m × 3.8m · Natural Flax',
          graphicType: 'textile_folds',
        },
      },
      {
        left: {
          type: 'article_intro',
          kicker: 'Feature 03 · Nocturnal Exposures',
          title: 'Where the Light Stays',
          subtitle: 'By Eli Kade (Tokyo)',
          body: 'Long-exposure light orbits recorded over dark alpine lake reservoirs. Eli Kade uses custom mechanical gyros equipped with high-CRI LED arrays to trace geometric halos in open landscapes during astronomical twilight.',
          quote: '"Light moves too fast for human memory. The camera gathers what our eyes discard."',
          author: 'Eli Kade (Photographer)',
          graphicType: 'where_light_stays',
        },
        right: {
          type: 'image',
          kicker: 'Nagano Reservoir · 23:40 JST',
          title: 'Dual Ring Orbit',
          subtitle: '480 Second Single Exposure',
          body: 'Shot with medium-format digital sensor at ISO 100, f/11. The mirror surface of the high-altitude reservoir reflects the ring with zero wave distortion.',
          meta: 'Shutter: 8 minutes · Aperture: f/11 · Focal: 35mm',
          graphicType: 'where_light_stays',
        },
      },
      {
        left: {
          type: 'process',
          kicker: 'Studio Colophon',
          title: 'The Practice in Between',
          subtitle: 'Why an independent magazine?',
          body: 'This publication exists as a deliberate counterpoint to algorithm-driven feeds. Every featured creator receives a dedicated digital space where their code, materials, and questions can be experienced with dignity and craft.',
          meta: 'Curated in Johannesburg, South Africa',
        },
        right: {
          type: 'colophon',
          kicker: 'Your Work Has a Story',
          title: 'Submit for Issue 002',
          subtitle: 'Residual Matter & Tactile Echoes',
          body: 'We are currently reviewing project submissions for Issue 002 (November 2026). If you work in creative coding, material sculpture, experimental photography, or generative sound, submit your work.',
          hasSubmitAction: true,
          meta: 'Deadline: November 15, 2026',
        },
      },
    ],
  },
  {
    id: 'issue_002',
    issueNumber: 'ISSUE 002',
    title: 'Residual Matter',
    subtitle: 'Physical computing, generative ceramics, and tactile artifacts.',
    date: 'November 2026',
    spineColor: '#281c14',
    accentColor: '#f59e0b',
    status: 'curating',
    featuresCount: 4,
    pages: [
      {
        left: {
          type: 'cover',
          kicker: 'Curatorial Docket · November 2026',
          title: 'Residual Matter',
          subtitle: 'Issue 002 Preview',
          body: 'An exploration of the physical residues left by digital simulation: generative clay 3D printing, CNC toolpaths carved into reclaimed timber, and conductive woven circuitry.',
          meta: 'Issue 002 · Open for Submissions',
          graphicType: 'amber_field',
        },
        right: {
          type: 'colophon',
          kicker: 'Open Curatorial Call',
          title: 'Submit Your Project',
          subtitle: 'Curated by aetherside.mag',
          body: 'Do you have an uncompromised project exploring physical-digital interfaces? Share your process documentation, early failure states, and technical notes with our editorial desk.',
          hasSubmitAction: true,
          meta: 'Submissions evaluated weekly',
        },
      },
    ],
  },
  {
    id: 'issue_003',
    issueNumber: 'ISSUE 003',
    title: 'Tactile Latency',
    subtitle: 'The incurred acoustic and computational delay between gesture and image.',
    date: 'December 2026',
    spineColor: '#121f1c',
    accentColor: '#2dd4bf',
    status: 'upcoming',
    featuresCount: 3,
    pages: [
      {
        left: {
          type: 'cover',
          kicker: 'Upcoming Archive · December 2026',
          title: 'Tactile Latency',
          subtitle: 'Issue 003 Preview',
          body: 'Examining the imperceptible milliseconds between physical gesture, sensor polling, shader compilation, and retinal perception in contemporary live audiovisual performances.',
          meta: 'Issue 003 · Forthcoming',
          graphicType: 'composite_quad',
        },
        right: {
          type: 'colophon',
          kicker: 'Curatorial Statement',
          title: 'Latency as Medium',
          subtitle: 'Temporal friction in creative code',
          body: 'Latency is typically treated as a technical failure to eliminate. This issue treats latency as an aesthetic material—a space of suspension and breath.',
          hasSubmitAction: true,
          meta: 'Scheduled release: December 2026',
        },
      },
    ],
  },
];

const BOOK_COVER_TIDES_FONT: React.CSSProperties = {
  fontFamily: "'Syne', sans-serif",
  fontWeight: 800,
  fontSize: '24px',
  lineHeight: '1.1em',
  letterSpacing: '-0.01em',
};

interface ThreeBookshelfProps {
  onEnterFeature: () => void;
  onOpenSubmit: () => void;
}

export const ThreeBookshelf: React.FC<ThreeBookshelfProps> = ({
  onEnterFeature,
  onOpenSubmit,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const spreadRef = useRef<HTMLDivElement>(null);
  const modalBoxRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // Refs synced with state so WebGL scene never tears down on hover/select
  const hoveredBookIdRef = useRef<string | null>(null);
  const selectedBookIdRef = useRef<string | null>(null);
  const pointerParallaxRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // React UI state
  const [hoveredBookId, setHoveredBookId] = useState<string | null>(null);
  const [selectedBook, setSelectedBook] = useState<BookIssueData | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  const bookStatesRef = useRef<{
    [key: string]: {
      basePos: THREE.Vector3;
      mesh: THREE.Mesh;
      data: BookIssueData;
    };
  }>({});

  const coverTidesText = useMemo(
    () =>
      selectedBook
        ? [selectedBook.issueNumber, selectedBook.title.toUpperCase()]
        : ['ISSUE 001', 'AETHER.MAG'],
    [selectedBook]
  );

  // Draw spine graphics into a canvas
  const drawSpineCanvas = useCallback((canvas: HTMLCanvasElement, book: BookIssueData) => {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = book.spineColor;
    ctx.fillRect(0, 0, 128, 768);

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, 8, 768);
    ctx.fillRect(120, 0, 8, 768);

    ctx.fillStyle = book.accentColor;
    ctx.fillRect(16, 24, 96, 6);

    ctx.save();
    ctx.translate(64, 400);
    ctx.rotate(-Math.PI / 2);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    try {
      ctx.letterSpacing = '3px';
    } catch {
      // fallback for browsers without canvas letterSpacing
    }
    ctx.fillText('ÆTHER.MAG', 0, 8);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
    ctx.font = '14px "JetBrains Mono", monospace';
    ctx.fillText(`${book.issueNumber}  —  ${book.title.toUpperCase()}`, 0, 28);

    ctx.restore();

    ctx.fillStyle = book.accentColor;
    ctx.fillRect(48, 720, 32, 4);
  }, []);

  // Draw cover graphics into a canvas
  const drawCoverCanvas = useCallback((canvas: HTMLCanvasElement, book: BookIssueData) => {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, 512, 768);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(24, 24, 464, 720);

    ctx.fillStyle = book.accentColor;
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(`${book.issueNumber} · ${book.date.toUpperCase()}`, 40, 56);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px "Fraunces", Georgia, serif';
    const words = book.title.split(' ');
    let y = 140;
    words.forEach((w) => {
      ctx.fillText(w, 40, y);
      y += 42;
    });

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(book.subtitle.slice(0, 42) + '...', 40, y + 20);

    // Deterministic stipple field
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 320; i++) {
      const rx = ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1;
      const ry = ((Math.sin(i * 78.233) * 43758.5453) % 1 + 1) % 1;
      ctx.fillRect(40 + rx * 432, 320 + ry * 320, 1.5, 1.5);
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('AETHERSIDE.MAG · ARCHIVE EDITION', 40, 710);
  }, []);

  // Procedural paper edge texture
  const createPaperEdgeTexture = useCallback((maxAnisotropy: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#e4e4e7';
    ctx.fillRect(0, 0, 64, 256);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let y = 0; y < 256; y += 3) {
      ctx.fillRect(0, y, 64, 1);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = maxAnisotropy;
    return texture;
  }, []);

  // GSAP-powered smooth 3D book transition helpers
  const animateBookToRest = useCallback((id: string) => {
    const state = bookStatesRef.current[id];
    if (!state) return;
    gsap.killTweensOf(state.mesh.position);
    gsap.killTweensOf(state.mesh.rotation);

    gsap.to(state.mesh.position, {
      x: state.basePos.x,
      y: state.basePos.y,
      z: state.basePos.z,
      duration: 0.72,
      ease: 'power3.out',
      overwrite: true,
    });
    gsap.to(state.mesh.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 0.72,
      ease: 'power3.out',
      overwrite: true,
    });
  }, []);

  const animateBookToHover = useCallback((id: string) => {
    const state = bookStatesRef.current[id];
    if (!state) return;
    gsap.killTweensOf(state.mesh.position);
    gsap.killTweensOf(state.mesh.rotation);

    gsap.to(state.mesh.position, {
      x: state.basePos.x,
      y: state.basePos.y + 0.38,
      z: state.basePos.z + 1.45,
      duration: 0.62,
      ease: 'power3.out',
      overwrite: true,
    });
    gsap.to(state.mesh.rotation, {
      x: -0.07,
      y: 0.14,
      z: 0.015,
      duration: 0.62,
      ease: 'power3.out',
      overwrite: true,
    });
  }, []);

  const animateBookOpen3D = useCallback((id: string) => {
    const state = bookStatesRef.current[id];
    if (!state) return;
    gsap.killTweensOf(state.mesh.position);
    gsap.killTweensOf(state.mesh.rotation);

    gsap.to(state.mesh.position, {
      x: 0,
      y: 0.35,
      z: 5.2,
      duration: 0.85,
      ease: 'expo.out',
      overwrite: true,
    });
    gsap.to(state.mesh.rotation, {
      x: -0.04,
      y: Math.PI / 2 - 0.18,
      z: 0,
      duration: 0.85,
      ease: 'expo.out',
      overwrite: true,
    });
  }, []);

  // Open Book Action
  const triggerOpenBook = useCallback(
    (book: BookIssueData) => {
      if (spreadRef.current) gsap.killTweensOf(spreadRef.current);
      setIsFlipping(false);
      selectedBookIdRef.current = book.id;
      hoveredBookIdRef.current = null;
      setHoveredBookId(null);

      Object.keys(bookStatesRef.current).forEach((id) => {
        if (id === book.id) {
          animateBookOpen3D(id);
        } else {
          animateBookToRest(id);
        }
      });

      setSelectedBook(book);
      setCurrentPageIndex(0);
    },
    [animateBookOpen3D, animateBookToRest]
  );

  // Close Book Action
  const handleCloseBook = useCallback(() => {
    if (spreadRef.current) gsap.killTweensOf(spreadRef.current);
    if (modalBoxRef.current) gsap.killTweensOf(modalBoxRef.current);
    setIsFlipping(false);
    const prevId = selectedBookIdRef.current;
    selectedBookIdRef.current = null;
    if (prevId) {
      animateBookToRest(prevId);
    }
    setSelectedBook(null);
    setCurrentPageIndex(0);
  }, [animateBookToRest]);

  // Animate modal entrance smoothly with GSAP when opened & bind Escape key
  useEffect(() => {
    if (!selectedBook) return;

    if (modalBoxRef.current) {
      gsap.fromTo(
        modalBoxRef.current,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out', clearProps: 'transform' }
      );
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseBook();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedBook, handleCloseBook]);

  // Mount Three.js Bookshelf Scene ONCE
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
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xffffff, 0.012);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 1.15, 19.5);
    camera.lookAt(0, -0.1, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    const maxAnisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe4e4e7, 1.35);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfffaf0, 2.0);
    keyLight.position.set(6, 12, 10);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc084fc, 1.0);
    rimLight.position.set(-8, 6, -6);
    scene.add(rimLight);

    const shelfGeo = new THREE.BoxGeometry(22, 0.4, 10);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0xf4f4f5,
      roughness: 0.65,
      metalness: 0.04,
    });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, -4.6, 0);
    shelf.receiveShadow = !isSoftwareGl;
    scene.add(shelf);

    const shadowGeo = new THREE.PlaneGeometry(24, 12);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -4.85;
    scene.add(shadowPlane);

    const bookWidth = 1.3;
    const bookHeight = 8.6;
    const bookDepth = 6.2;
    const bookGeo = new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth);
    const paperTexture = createPaperEdgeTexture(maxAnisotropy);

    const disposableTextures: THREE.Texture[] = [paperTexture];
    const disposableMaterials: THREE.Material[] = [shelfMat, shadowMat];
    const bookCanvases: {
      book: BookIssueData;
      spineCanvas: HTMLCanvasElement;
      spineTex: THREE.CanvasTexture;
      coverCanvas: HTMLCanvasElement;
      coverTex: THREE.CanvasTexture;
    }[] = [];

    const meshes: THREE.Mesh[] = [];
    const spacing = 3.6;
    const startX = -((BOOK_ISSUES.length - 1) * spacing) / 2;

    BOOK_ISSUES.forEach((book, idx) => {
      const spineCanvas = document.createElement('canvas');
      spineCanvas.width = 128;
      spineCanvas.height = 768;
      drawSpineCanvas(spineCanvas, book);
      const spineTex = new THREE.CanvasTexture(spineCanvas);
      spineTex.colorSpace = THREE.SRGBColorSpace;
      spineTex.anisotropy = maxAnisotropy;

      const coverCanvas = document.createElement('canvas');
      coverCanvas.width = 512;
      coverCanvas.height = 768;
      drawCoverCanvas(coverCanvas, book);
      const coverTex = new THREE.CanvasTexture(coverCanvas);
      coverTex.colorSpace = THREE.SRGBColorSpace;
      coverTex.anisotropy = maxAnisotropy;

      disposableTextures.push(spineTex, coverTex);
      bookCanvases.push({ book, spineCanvas, spineTex, coverCanvas, coverTex });

      const materials = [
        new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.35 }),
        new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.35 }),
        new THREE.MeshStandardMaterial({ map: paperTexture, roughness: 0.8 }),
        new THREE.MeshStandardMaterial({ map: paperTexture, roughness: 0.8 }),
        new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.28 }),
        new THREE.MeshStandardMaterial({ map: paperTexture, roughness: 0.8 }),
      ];
      disposableMaterials.push(...materials);

      const mesh = new THREE.Mesh(bookGeo, materials);
      const posX = startX + idx * spacing;
      const posY = -0.2;
      const posZ = 0;

      mesh.position.set(posX, posY, posZ);
      mesh.castShadow = !isSoftwareGl;
      mesh.receiveShadow = !isSoftwareGl;
      mesh.userData = { id: book.id, index: idx, bookData: book };

      scene.add(mesh);
      meshes.push(mesh);

      bookStatesRef.current[book.id] = {
        basePos: new THREE.Vector3(posX, posY, posZ),
        mesh,
        data: book,
      };
    });

    // Re-bake typography onto spine/cover canvas textures once web fonts finish downloading
    let disposed = false;
    if (typeof document !== 'undefined' && document.fonts) {
      document.fonts.ready.then(
        () => {
          if (disposed) return;
          bookCanvases.forEach(({ book, spineCanvas, spineTex, coverCanvas, coverTex }) => {
            drawSpineCanvas(spineCanvas, book);
            spineTex.needsUpdate = true;
            drawCoverCanvas(coverCanvas, book);
            coverTex.needsUpdate = true;
          });
        },
        () => {}
      );
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);
    let lastRaycast = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      pointerParallaxRef.current.x = nx * 0.65;
      pointerParallaxRef.current.y = ny * 0.3;

      const now = performance.now();
      if (now - lastRaycast < 24) return;
      lastRaycast = now;

      if (selectedBookIdRef.current) return;

      mouse.set(nx, ny);
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes, false);
      const nextId = intersects.length > 0 ? (intersects[0].object.userData.id as string) : null;

      if (nextId !== hoveredBookIdRef.current) {
        const prevId = hoveredBookIdRef.current;
        hoveredBookIdRef.current = nextId;
        setHoveredBookId(nextId);

        if (prevId && prevId !== selectedBookIdRef.current) {
          animateBookToRest(prevId);
        }
        if (nextId) {
          animateBookToHover(nextId);
          container.style.cursor = 'pointer';
        } else {
          container.style.cursor = 'default';
        }
      }
    };

    const handlePointerLeave = () => {
      pointerParallaxRef.current.x = 0;
      pointerParallaxRef.current.y = 0;
      const prevId = hoveredBookIdRef.current;
      if (prevId) {
        hoveredBookIdRef.current = null;
        setHoveredBookId(null);
        if (prevId !== selectedBookIdRef.current) {
          animateBookToRest(prevId);
        }
      }
      container.style.cursor = 'default';
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const bookData = hit.userData.bookData as BookIssueData;
        triggerOpenBook(bookData);
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mouseleave', handlePointerLeave);
    container.addEventListener('click', handleClick);

    const clock = new THREE.Clock();
    let isVisible = true;

    const animate = () => {
      if (!isVisible || document.hidden || disposed) {
        animFrameIdRef.current = 0;
        return;
      }

      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      if (cameraRef.current) {
        const targetCamX = pointerParallaxRef.current.x;
        const targetCamY = 1.15 + pointerParallaxRef.current.y;
        cameraRef.current.position.x = THREE.MathUtils.damp(cameraRef.current.position.x, targetCamX, 4.5, delta);
        cameraRef.current.position.y = THREE.MathUtils.damp(cameraRef.current.position.y, targetCamY, 4.5, delta);
        cameraRef.current.lookAt(0, -0.1, 0);
      }

      if (hoveredBookIdRef.current && !selectedBookIdRef.current) {
        const active = bookStatesRef.current[hoveredBookIdRef.current];
        if (active && !gsap.isTweening(active.mesh.position)) {
          active.mesh.position.y = active.basePos.y + 0.38 + Math.sin(elapsed * 2.2) * 0.05;
        }
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    const startLoop = () => {
      if (!animFrameIdRef.current && isVisible && !document.hidden && !disposed) {
        clock.getDelta();
        animFrameIdRef.current = requestAnimationFrame(animate);
      }
    };

    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
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
      disposed = true;
      resizeObserver.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mouseleave', handlePointerLeave);
      container.removeEventListener('click', handleClick);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);

      Object.values(bookStatesRef.current).forEach((s) => {
        gsap.killTweensOf(s.mesh.position);
        gsap.killTweensOf(s.mesh.rotation);
      });

      disposableTextures.forEach((tex) => tex.dispose());
      disposableMaterials.forEach((mat) => mat.dispose());
      shelfGeo.dispose();
      bookGeo.dispose();
      shadowGeo.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    animateBookToHover,
    animateBookToRest,
    createPaperEdgeTexture,
    drawCoverCanvas,
    drawSpineCanvas,
    triggerOpenBook,
  ]);

  // Smooth Directional GSAP Page-Flip Transition
  const flipToPage = useCallback(
    (targetIndex: number, direction: 1 | -1) => {
      if (!selectedBook || isFlipping) return;
      if (targetIndex < 0 || targetIndex >= selectedBook.pages.length || targetIndex === currentPageIndex) {
        return;
      }

      const spreadEl = spreadRef.current;
      if (!spreadEl) {
        setCurrentPageIndex(targetIndex);
        return;
      }

      setIsFlipping(true);
      gsap.killTweensOf(spreadEl);
      gsap.to(spreadEl, {
        opacity: 0.15,
        x: direction * -18,
        scale: 0.985,
        duration: 0.18,
        ease: 'power2.in',
        onComplete: () => {
          setCurrentPageIndex(targetIndex);
          gsap.fromTo(
            spreadEl,
            { opacity: 0.15, x: direction * 18, scale: 0.985 },
            {
              opacity: 1,
              x: 0,
              scale: 1,
              duration: 0.32,
              ease: 'power3.out',
              clearProps: 'transform,opacity',
              onComplete: () => setIsFlipping(false),
            }
          );
        },
      });
    },
    [currentPageIndex, isFlipping, selectedBook]
  );

  const handleNextPage = () => {
    flipToPage(currentPageIndex + 1, 1);
  };

  const handlePrevPage = () => {
    flipToPage(currentPageIndex - 1, -1);
  };

  const currentSpread = selectedBook?.pages[currentPageIndex];

  return (
    <div className="relative w-full bg-white border border-zinc-200 overflow-hidden">
      {/* Three.js 3D Bookshelf Viewport */}
      <div className="relative w-full h-[420px] sm:h-[480px] select-none bg-radial from-white via-[#fafafa] to-[#f4f4f5]">
        <div ref={mountRef} className="w-full h-full" />

        {/* Hovered Spine Label or Quiet Shelf Prompt */}
        {!selectedBook && (
          <div className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 z-10 px-4 py-2 bg-white/95 border border-zinc-300 text-xs font-mono-custom text-zinc-700 whitespace-nowrap">
            {hoveredBookId ? (
              <span className="flex items-center gap-2.5">
                <span className="text-zinc-500">
                  {BOOK_ISSUES.find((b) => b.id === hoveredBookId)?.issueNumber}
                </span>
                <span aria-hidden="true" className="text-zinc-300">·</span>
                <strong className="text-black font-semibold">
                  {BOOK_ISSUES.find((b) => b.id === hoveredBookId)?.title}
                </strong>
                <span aria-hidden="true" className="text-zinc-300">·</span>
                <span className="text-purple-700">Open volume ↗</span>
              </span>
            ) : (
              <span className="text-zinc-600 text-[11px]">
                Hover any spine to preview · Click to open volume
              </span>
            )}
          </div>
        )}
      </div>

      {/* Open Flip-Book Overlay */}
      {selectedBook && (
        <div
          onClick={handleCloseBook}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50"
        >
          <div
            ref={modalBoxRef}
            className="relative w-full max-w-5xl bg-white border border-zinc-300 shadow-2xl flex flex-col max-h-[94vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Flip Book Modal Top Bar */}
            <div className="px-6 py-3.5 border-b border-zinc-200 bg-[#fafafa] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-[11px] font-mono-custom font-semibold uppercase tracking-wider shrink-0 text-purple-700">
                  {selectedBook.issueNumber}
                </span>
                <span className="text-zinc-300" aria-hidden="true">·</span>
                <h3 className="text-sm sm:text-base font-serif-editorial font-bold text-black tracking-wide truncate">
                  {selectedBook.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono-custom text-zinc-500 hidden sm:inline tabular-nums">
                  Spread {currentPageIndex + 1} of {selectedBook.pages.length}
                </span>
                <button
                  type="button"
                  onClick={handleCloseBook}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-xs font-mono-custom text-zinc-800 hover:text-black transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return to shelf</span>
                </button>
              </div>
            </div>

            {/* Two-Page Spread Layout with 3D Book Crease */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex items-center justify-center bg-[#f4f4f5]">
              <div
                ref={spreadRef}
                className="w-full max-w-4xl bg-white border border-zinc-300 shadow-xl flex flex-col md:flex-row will-change-transform"
              >
                {/* Left Page */}
                <div className="flex-1 p-6 sm:p-8 border-b md:border-b-0 md:border-r border-zinc-200 flex flex-col justify-between min-h-[380px] sm:min-h-[460px] bg-white relative">
                  <div className="hidden md:block absolute top-0 right-0 w-6 h-full bg-gradient-to-l from-black/[0.05] to-transparent pointer-events-none" />

                  <div>
                    {currentSpread?.left.kicker && (
                      <div className="text-[10px] font-mono-custom text-purple-700 uppercase tracking-widest mb-2">
                        {currentSpread.left.kicker}
                      </div>
                    )}

                    {currentSpread?.left.type === 'cover' ? (
                      <div className="mb-4">
                        <AetherLogo size="md" className="mb-2" />
                        <div className="w-full h-32 relative bg-white border border-zinc-200 overflow-hidden my-2">
                          <TypographicTides
                            text={coverTidesText}
                            subtext={selectedBook.date.toUpperCase()}
                            background="#ffffff"
                            textColor="#09090b"
                            accent="#7c3aed"
                            secondaryColor="#0284c7"
                            amplitude={16}
                            frequency={0.02}
                            speed={1.5}
                            layers={3}
                            showContourLines={true}
                            font={BOOK_COVER_TIDES_FONT}
                          />
                        </div>
                      </div>
                    ) : (
                      <h4 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-black tracking-tight mb-2">
                        {currentSpread?.left.title}
                      </h4>
                    )}

                    {currentSpread?.left.subtitle && (
                      <div className="text-xs font-mono-custom text-zinc-500 mb-4">
                        {currentSpread.left.subtitle}
                      </div>
                    )}

                    {currentSpread?.left.graphicType && (
                      <div className="aspect-16/9 w-full bg-black border border-zinc-200 overflow-hidden mb-4">
                        <StudyGraphic type={currentSpread.left.graphicType} className="w-full h-full" />
                      </div>
                    )}

                    <p className="text-xs sm:text-sm font-serif-editorial text-zinc-700 leading-relaxed font-light">
                      {currentSpread?.left.body}
                    </p>

                    {currentSpread?.left.quote && (
                      <blockquote className="my-4 py-3 border-y border-zinc-200 text-xs font-serif-editorial italic text-zinc-800">
                        {currentSpread.left.quote}
                      </blockquote>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-200 flex items-center justify-between text-[11px] font-mono-custom text-zinc-500">
                    <span>{currentSpread?.left.meta || 'aetherside.mag'}</span>
                    <span className="tabular-nums">Page {currentPageIndex * 2 + 1}</span>
                  </div>
                </div>

                {/* Right Page */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between min-h-[380px] sm:min-h-[460px] bg-[#fafafa] relative">
                  <div className="hidden md:block absolute top-0 left-0 w-6 h-full bg-gradient-to-r from-black/[0.05] to-transparent pointer-events-none" />

                  <div>
                    {currentSpread?.right.kicker && (
                      <div className="text-[10px] font-mono-custom text-amber-700 uppercase tracking-widest mb-2">
                        {currentSpread.right.kicker}
                      </div>
                    )}

                    <h4 className="text-2xl sm:text-3xl font-serif-editorial font-bold text-black tracking-tight mb-2">
                      {currentSpread?.right.title}
                    </h4>

                    {currentSpread?.right.subtitle && (
                      <div className="text-xs font-mono-custom text-zinc-500 mb-4">
                        {currentSpread.right.subtitle}
                      </div>
                    )}

                    {currentSpread?.right.graphicType && (
                      <div className="aspect-16/9 w-full bg-black border border-zinc-200 overflow-hidden mb-4">
                        <StudyGraphic type={currentSpread.right.graphicType} className="w-full h-full" />
                      </div>
                    )}

                    <p className="text-xs sm:text-sm font-serif-editorial text-zinc-700 leading-relaxed font-light whitespace-pre-line">
                      {currentSpread?.right.body}
                    </p>

                    {currentSpread?.right.hasFeatureAction && (
                      <div className="mt-4 p-4 bg-purple-50 border border-purple-200">
                        <div className="text-xs font-mono-custom text-purple-900 mb-2">
                          Interactive 3D Study Available
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleCloseBook();
                            onEnterFeature();
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-mono-custom font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          <span>Launch Full Feature 01 Lab</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {currentSpread?.right.hasSubmitAction && (
                      <div className="mt-4 p-4 bg-amber-50 border border-amber-200">
                        <div className="text-xs font-mono-custom text-amber-900 mb-2">
                          Submissions Open for This Issue
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            handleCloseBook();
                            onOpenSubmit();
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-mono-custom font-semibold hover:bg-zinc-800 transition-colors cursor-pointer"
                        >
                          <span>Submit Proposal for Issue 002</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-200 flex items-center justify-between text-[11px] font-mono-custom text-zinc-500">
                    <span className="tabular-nums">Page {currentPageIndex * 2 + 2}</span>
                    <span>{currentSpread?.right.meta || 'Issue 001'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Flipping Navigation Controls Footer */}
            <div className="px-6 py-3 bg-[#fafafa] border-t border-zinc-200 flex items-center justify-between text-xs font-mono-custom">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0 || isFlipping}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed text-zinc-800 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Spread</span>
              </button>

              <div className="flex items-center gap-1">
                {selectedBook.pages.map((_, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => flipToPage(idx, idx > currentPageIndex ? 1 : -1)}
                    className={`w-6 h-6 flex items-center justify-center text-[10px] font-mono-custom transition-colors cursor-pointer ${
                      currentPageIndex === idx
                        ? 'bg-black text-white font-bold'
                        : 'bg-zinc-100 border border-zinc-300 text-zinc-600 hover:text-black'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPageIndex === selectedBook.pages.length - 1 || isFlipping}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-300 hover:border-black disabled:opacity-30 disabled:cursor-not-allowed text-zinc-800 transition-colors cursor-pointer"
              >
                <span>Next Spread</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
