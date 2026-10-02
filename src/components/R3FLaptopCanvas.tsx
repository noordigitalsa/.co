import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Code2, Gauge, RefreshCw, ShoppingBag, Sparkles } from 'lucide-react';

type ScreenViewMode = 'code' | 'storefront' | 'metrics';

interface LaptopModelProps {
  screenMode: ScreenViewMode;
  dropKey: number;
}

// 3D Orbiting Ambient Geometric Tech Nodes
const FloatingTechNode = ({
  position,
  scale = 0.28,
  color = '#38bdf8',
  speed = 1.6
}: {
  position: [number, number, number];
  scale?: number;
  color?: string;
  speed?: number;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime() * speed;
    meshRef.current.rotation.x = t * 0.6;
    meshRef.current.rotation.y = t * 0.8;
  });

  return (
    <Float speed={speed * 1.4} rotationIntensity={1.2} floatIntensity={1.4}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.65}
          roughness={0.25}
          metalness={0.85}
          wireframe
        />
      </mesh>
    </Float>
  );
};

// 3D Ambient Dust Field with depth
const ParticleField = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const particlesCount = 85;

  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 6 - 0.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.025;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#60a5fa"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
};

// 3D Procedural High-Fidelity Laptop Model
const LaptopModel: React.FC<LaptopModelProps> = ({ screenMode, dropKey }) => {
  const groupRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);

  // Dynamic Browser & Screen Canvas Texture
  const { texture, canvas } = useMemo(() => {
    const cvs = document.createElement('canvas');
    cvs.width = 1024;
    cvs.height = 640;
    const tex = new THREE.CanvasTexture(cvs);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.colorSpace = THREE.SRGBColorSpace;
    return { texture: tex, canvas: cvs };
  }, []);

  // Render Realistic Browser Chrome with "goodsify.co" & live coding
  const renderScreen = (time: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Browser Window Frame & Canvas Background
    ctx.fillStyle = '#080a10';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Browser Tab Bar
    ctx.fillStyle = '#111420';
    ctx.fillRect(0, 0, canvas.width, 38);

    // macOS Window controls
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(22, 19, 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(40, 19, 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(58, 19, 5.5, 0, Math.PI * 2);
    ctx.fill();

    // Browser Tab showing goodsify.co
    ctx.fillStyle = '#1a1f30';
    ctx.fillRect(80, 6, 260, 32);
    ctx.strokeStyle = '#28314a';
    ctx.strokeRect(80, 6, 260, 32);

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 12px "JetBrains Mono", monospace';
    ctx.fillText('⚡ goodsify.co', 96, 26);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px sans-serif';
    ctx.fillText('— Web & Digital Studio', 190, 26);

    // 3. Browser Address / URL Bar
    ctx.fillStyle = '#131726';
    ctx.fillRect(0, 38, canvas.width, 42);
    ctx.strokeStyle = '#1e243b';
    ctx.strokeRect(0, 38, canvas.width, 42);

    // URL Capsule Box
    ctx.fillStyle = '#0c0e17';
    ctx.fillRect(70, 44, canvas.width - 140, 30);
    ctx.strokeStyle = '#28334e';
    ctx.strokeRect(70, 44, canvas.width - 140, 30);

    // Lock icon & URL text
    ctx.fillStyle = '#10b981';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText('🔒 https://', 85, 64);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillText('goodsify.co', 165, 64);

    ctx.fillStyle = '#64748b';
    ctx.font = '12px "JetBrains Mono", monospace';
    const subRoute =
      screenMode === 'code'
        ? '/workspace/src/storefront.ts'
        : screenMode === 'storefront'
        ? '/client/preview/store'
        : '/performance/lighthouse-audit';
    ctx.fillText(subRoute, 255, 64);

    // Live Badge in URL bar
    ctx.fillStyle = '#10b981';
    ctx.fillRect(canvas.width - 170, 50, 80, 18);
    ctx.fillStyle = '#062817';
    ctx.font = 'bold 10px "JetBrains Mono", monospace';
    ctx.fillText('● 200 OK', canvas.width - 156, 63);

    // 4. Content Area Based on Mode
    if (screenMode === 'code') {
      // CODE VIEW with goodsifyco repository
      const codeLines = [
        { text: '// @goodsifyco — Architecture Engine v2.4', color: '#64748b' },
        { text: 'import { deployDigitalProduct } from "@goodsifyco/core";', color: '#c084fc' },
        { text: 'import { sheetsSync } from "./integrations/googleSheets";', color: '#c084fc' },
        { text: '', color: '#fff' },
        { text: 'export const clientProject = deployDigitalProduct({', color: '#38bdf8' },
        { text: '  domain: "goodsify.co",', color: '#86efac' },
        { text: '  repository: "github.com/goodsifyco/production",', color: '#fdba74' },
        { text: '  pricingTier: "Business ($100 CAD) · Pro ($250 CAD)",', color: '#f472b6' },
        { text: '  engine: "React Three Fiber 3D + TypeScript",', color: '#93c5fd' },
        { text: '  database: sheetsSync({ status: "NEW", priority: "NORMAL" }),', color: '#e879f9' },
        { text: '});', color: '#38bdf8' }
      ];

      ctx.font = '18px "JetBrains Mono", monospace';
      codeLines.forEach((line, idx) => {
        ctx.fillStyle = '#475569';
        ctx.fillText(String(idx + 1).padStart(2, '0'), 35, 125 + idx * 26);
        ctx.fillStyle = line.color;
        ctx.fillText(line.text, 75, 125 + idx * 26);
      });

      // Terminal Panel at Bottom
      ctx.fillStyle = '#0d101a';
      ctx.fillRect(25, 415, canvas.width - 50, 200);
      ctx.strokeStyle = '#1e243b';
      ctx.strokeRect(25, 415, canvas.width - 50, 200);

      ctx.fillStyle = '#161c2d';
      ctx.fillRect(25, 415, canvas.width - 50, 30);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText('TERMINAL — goodsifyco/build (Active Node Process)', 40, 435);

      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText('✔ [goodsify.co] TypeScript compile: 0 errors (124ms)', 40, 470);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('✔ [Google Sheets Webhook] Connected to Production /exec', 40, 498);
      ctx.fillStyle = '#a78bfa';
      ctx.fillText('✔ [3D Viewport] WebGL2 Pipeline loaded · 60fps stable', 40, 526);

      const blink = Math.floor(time * 2) % 2 === 0;
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`$ goodsifyco deployment ready ${blink ? '█' : ' '}`, 40, 558);
    } else if (screenMode === 'storefront') {
      // LIVE STOREFRONT VIEW
      ctx.fillStyle = '#111422';
      ctx.fillRect(35, 95, canvas.width - 70, 510);

      // Storefront top header
      ctx.fillStyle = '#181e32';
      ctx.fillRect(35, 95, canvas.width - 70, 54);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px "Syne", sans-serif';
      ctx.fillText('GOODSIFY DIGITAL STOREFRONT', 60, 128);

      ctx.fillStyle = '#2563eb';
      ctx.fillRect(canvas.width - 230, 107, 140, 30);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.fillText('CART (3) · $250 CAD', canvas.width - 218, 126);

      // Store Hero banner
      const grad = ctx.createLinearGradient(60, 165, canvas.width - 120, 265);
      grad.addColorStop(0, '#1e293b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(60, 165, canvas.width - 120, 100);

      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText('PROTOTYPE STOREFRONT · POWERED BY GOODSIFY.CO', 80, 200);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Syne", sans-serif';
      ctx.fillText('Bespoke E-Commerce & Web Architecture', 80, 235);

      // Product cards
      const products = [
        { name: 'Starter Package Build', price: '$70.00 CAD', tag: 'Fast Delivery' },
        { name: 'Business Multi-Section', price: '$100.00 CAD', tag: 'Most Popular' },
        { name: 'Professional E-Commerce', price: '$250.00 CAD', tag: 'Full Store' }
      ];

      products.forEach((prod, i) => {
        const cardX = 60 + i * 300;
        const cardY = 285;
        ctx.fillStyle = '#151a2b';
        ctx.fillRect(cardX, cardY, 280, 290);
        ctx.strokeStyle = '#222c48';
        ctx.strokeRect(cardX, cardY, 280, 290);

        ctx.fillStyle = '#1c243c';
        ctx.fillRect(cardX + 15, cardY + 15, 250, 140);
        ctx.fillStyle = '#60a5fa';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText('[goodsify.co 3D Asset]', cardX + 45, cardY + 90);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillText(prod.tag, cardX + 15, cardY + 185);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(prod.name, cardX + 15, cardY + 210);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 16px "JetBrains Mono", monospace';
        ctx.fillText(prod.price, cardX + 15, cardY + 245);

        ctx.fillStyle = '#2563eb';
        ctx.fillRect(cardX + 160, cardY + 225, 105, 30);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Order Plan', cardX + 180, cardY + 245);
      });
    } else {
      // 100/100 METRICS VIEW
      ctx.fillStyle = '#111422';
      ctx.fillRect(35, 95, canvas.width - 70, 510);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px "Syne", sans-serif';
      ctx.fillText('Google Lighthouse 100/100 Core Web Vitals', 60, 140);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillText('Audit certified for goodsify.co client deployments', 60, 168);

      const metrics = [
        { label: 'Performance', score: 100 },
        { label: 'Accessibility', score: 100 },
        { label: 'Best Practices', score: 100 },
        { label: 'SEO Engine', score: 100 }
      ];

      metrics.forEach((m, idx) => {
        const centerX = 160 + idx * 230;
        const centerY = 280;
        const radius = 62;

        ctx.lineWidth = 10;
        ctx.strokeStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, -Math.PI / 2, Math.PI * 1.5);
        ctx.stroke();

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 36px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(String(m.score), centerX, centerY + 12);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText(m.label, centerX, centerY + 110);
        ctx.textAlign = 'left';
      });

      // Bottom sub-metrics
      ctx.fillStyle = '#181e32';
      ctx.fillRect(60, 440, canvas.width - 120, 130);
      ctx.strokeStyle = '#273252';
      ctx.strokeRect(60, 440, canvas.width - 120, 130);

      const subMetrics = [
        { k: 'First Contentful Paint (FCP)', v: '0.35s (Fast)' },
        { k: 'Largest Contentful Paint (LCP)', v: '0.72s (Fast)' },
        { k: 'Cumulative Layout Shift (CLS)', v: '0.000 (Zero Shift)' },
        { k: 'Interaction to Next Paint (INP)', v: '14ms (Instant)' }
      ];

      subMetrics.forEach((sm, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 90 + col * 460;
        const y = 480 + row * 45;

        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillText(sm.k, x, y);

        ctx.fillStyle = '#10b981';
        ctx.font = 'bold 14px "JetBrains Mono", monospace';
        ctx.fillText(sm.v, x + 310, y);
      });
    }

    texture.needsUpdate = true;
  };

  // Falling Animation Physics state
  const dropStartTimeRef = useRef(performance.now());
  const dropDuration = 1.35; // seconds
  const targetLidAngle = THREE.MathUtils.degToRad(108);

  useEffect(() => {
    dropStartTimeRef.current = performance.now();
    if (groupRef.current) {
      groupRef.current.position.set(0, 5.0, 0);
      groupRef.current.rotation.set(-0.35, 0.28, -0.15);
    }
    if (lidRef.current) {
      lidRef.current.rotation.x = 0;
    }
    renderScreen(0);
  }, [dropKey, screenMode]);

  // Frame Loop for Damped Physics Drop + Silky Smooth Mouse Tracking
  useFrame((state) => {
    const group = groupRef.current;
    const lid = lidRef.current;
    if (!group || !lid) return;

    const timeSinceDrop = (performance.now() - dropStartTimeRef.current) / 1000;
    const t = Math.min(timeSinceDrop / dropDuration, 1);
    const elapsedTime = state.clock.getElapsedTime();

    // Re-render screen at ~10fps for terminal cursor blink
    if (Math.floor(elapsedTime * 10) % 2 === 0) {
      renderScreen(elapsedTime);
    }

    if (t < 1) {
      if (t < 0.45) {
        // Free fall
        const fallT = t / 0.45;
        const easeFall = fallT * fallT;
        group.position.y = 5.0 * (1 - easeFall);
        group.rotation.x = -0.35 * (1 - easeFall * 0.8);
        group.rotation.z = -0.15 * (1 - easeFall);
      } else {
        // Bouncy spring damping
        const bounceT = (t - 0.45) / 0.55;
        const bounceAmp = 0.55 * Math.exp(-bounceT * 5.2);
        const bounceOffset = Math.abs(Math.sin(bounceT * Math.PI * 3.5)) * bounceAmp;

        group.position.y = bounceOffset;
        group.rotation.x = Math.sin(bounceT * Math.PI * 2) * 0.08 * Math.exp(-bounceT * 4);
        group.rotation.z = 0;

        // Smooth lid opening with cubic ease
        const lidOpenProgress = Math.min(1, (t - 0.35) / 0.65);
        const easeLid = 1 - Math.pow(1 - lidOpenProgress, 3);
        lid.rotation.x = targetLidAngle * easeLid;
      }
    } else {
      // Settled: subtle floating idle
      const hoverOffset = Math.sin(elapsedTime * 1.6) * 0.04;
      group.position.y = hoverOffset;
      lid.rotation.x = targetLidAngle;

      // Ultra-smooth mouse tracking tilt with soft lerping
      const targetRotX = 0.12 - state.pointer.y * 0.18;
      const targetRotY = 0.24 + state.pointer.x * 0.32;

      group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, 0.05);
      group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, 0.05);
    }
  });

  const baseWidth = 3.2;
  const baseDepth = 2.15;
  const baseThickness = 0.1;
  const lidHeight = 2.05;
  const lidThickness = 0.06;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Base Chassis Body */}
      <mesh position={[0, baseThickness / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[baseWidth, baseThickness, baseDepth]} />
        <meshStandardMaterial color="#1e2230" metalness={0.88} roughness={0.22} />
      </mesh>

      {/* Keyboard Recess */}
      <mesh position={[0, baseThickness + 0.005, -0.32]}>
        <boxGeometry args={[2.7, 0.015, 1.15]} />
        <meshStandardMaterial color="#0f1118" metalness={0.9} roughness={0.35} />
      </mesh>

      {/* Trackpad */}
      <mesh position={[0, baseThickness + 0.005, 0.62]}>
        <boxGeometry args={[1.05, 0.008, 0.65]} />
        <meshStandardMaterial color="#121520" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Display Lid Group */}
      <group ref={lidRef} position={[0, baseThickness, -baseDepth / 2 + 0.05]}>
        {/* Hinge */}
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.045, 0.045, 2.4, 16]} />
          <meshStandardMaterial color="#0f1118" metalness={0.9} roughness={0.3} />
        </mesh>

        {/* Lid Shell */}
        <mesh position={[0, lidHeight / 2, -lidThickness / 2]} castShadow>
          <boxGeometry args={[baseWidth, lidHeight, lidThickness]} />
          <meshStandardMaterial color="#1e2230" metalness={0.88} roughness={0.22} />
        </mesh>

        {/* Screen Bezel with Webcam notch */}
        <mesh position={[0, lidHeight / 2, 0.005]}>
          <boxGeometry args={[baseWidth - 0.08, lidHeight - 0.08, 0.005]} />
          <meshStandardMaterial color="#0b0d14" metalness={0.6} roughness={0.5} />
        </mesh>

        {/* Dynamic Display Canvas */}
        <mesh position={[0, lidHeight / 2 + 0.03, 0.01]}>
          <planeGeometry args={[baseWidth - 0.24, lidHeight - 0.26]} />
          <meshBasicMaterial map={texture} />
        </mesh>
      </group>
    </group>
  );
};

export const R3FLaptopCanvas: React.FC = () => {
  const [screenMode, setScreenMode] = useState<ScreenViewMode>('code');
  const [dropKey, setDropKey] = useState(0);

  return (
    <div className="relative flex flex-col items-center w-full select-none">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between w-full px-2 mb-2">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse shadow-[0_0_8px_#60a5fa]" />
          <span>React Three Fiber 3D · Goodsify Live Engine</span>
        </div>

        <button
          type="button"
          onClick={() => setDropKey((k) => k + 1)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded transition-colors shadow-sm"
          title="Trigger 3D laptop falling animation again"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Replay 3D Drop</span>
        </button>
      </div>

      {/* R3F Canvas Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-w-[560px] rounded-2xl overflow-hidden border border-slate-800/80 bg-gradient-to-b from-[#0e111a] to-[#090b11] shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
        {/* Radial Neon Glow Behind Laptop */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-blue-600/15 via-sky-500/10 to-transparent blur-3xl pointer-events-none" />

        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center text-xs font-mono text-blue-400 gap-2">
              <Sparkles className="w-5 h-5 animate-spin" />
              <span>Loading 3D Canvas...</span>
            </div>
          }
        >
          <Canvas
            shadows
            camera={{ position: [0, 2.2, 5.8], fov: 40 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.9} />
            <directionalLight
              position={[4, 6, 5]}
              intensity={2.2}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-bias={-0.0005}
            />
            <directionalLight position={[-5, 4, 3]} intensity={1.4} color="#93c5fd" />
            <directionalLight position={[0, 5, -4]} intensity={2.0} color="#60a5fa" />
            <pointLight position={[0, -0.2, 0.5]} intensity={1.8} color="#2563eb" />

            {/* 3D Ambient Dust Particles */}
            <ParticleField />

            {/* Orbiting 3D Floating Tech Nodes */}
            <FloatingTechNode position={[-2.4, 2.2, -0.6]} color="#38bdf8" speed={1.4} scale={0.24} />
            <FloatingTechNode position={[2.5, 1.8, -0.4]} color="#818cf8" speed={1.8} scale={0.22} />
            <FloatingTechNode position={[-1.8, 0.6, 1.8]} color="#34d399" speed={1.2} scale={0.18} />

            {/* Laptop 3D Model with Physics Falling Animation */}
            <LaptopModel screenMode={screenMode} dropKey={dropKey} />

            {/* Soft Ground Contact Shadow */}
            <ContactShadows
              position={[0, -0.01, 0]}
              opacity={0.85}
              scale={5.5}
              blur={2.0}
              far={4.0}
              resolution={512}
              color="#000000"
            />
          </Canvas>
        </Suspense>
      </div>

      {/* Screen Switcher Controls */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 w-full">
        <button
          type="button"
          onClick={() => setScreenMode('code')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-all ${
            screenMode === 'code'
              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/50'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>01. goodsify.co Code</span>
        </button>

        <button
          type="button"
          onClick={() => setScreenMode('storefront')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-all ${
            screenMode === 'storefront'
              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/50'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>02. Live Storefront</span>
        </button>

        <button
          type="button"
          onClick={() => setScreenMode('metrics')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-all ${
            screenMode === 'metrics'
              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/50'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Gauge className="w-3.5 h-3.5" />
          <span>03. Lighthouse 100/100</span>
        </button>
      </div>

      <p className="mt-2 text-[11px] font-mono text-slate-500 text-center">
        Move cursor over canvas to smoothly tilt 3D model · Switch views above to inspect goodsify.co
      </p>
    </div>
  );
};
