import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Code2, Gauge, Laptop, RefreshCw, ShoppingBag } from 'lucide-react';

type ScreenViewMode = 'code' | 'storefront' | 'metrics';

export const Laptop3DShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [screenMode, setScreenMode] = useState<ScreenViewMode>('code');
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // References for animation trigger and Three.js state
  const dropTriggerRef = useRef<() => void>(() => {});
  const setScreenModeRef = useRef<(mode: ScreenViewMode) => void>(() => {});

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 540;
    const height = container.clientHeight || 420;

    // 1. Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.2, 5.8);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0x3b82f6, 2.2);
    keyLight.position.set(4, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 1.4);
    fillLight.position.set(-5, 4, 3);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x60a5fa, 2.0);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    const bottomGlow = new THREE.PointLight(0x2563eb, 1.6, 6);
    bottomGlow.position.set(0, -0.2, 0.5);
    scene.add(bottomGlow);

    // 3. Dynamic Screen Texture (Offscreen Canvas)
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 1024;
    screenCanvas.height = 640;
    const ctx = screenCanvas.getContext('2d')!;

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.minFilter = THREE.LinearFilter;
    screenTexture.magFilter = THREE.LinearFilter;
    screenTexture.colorSpace = THREE.SRGBColorSpace;

    let currentMode: ScreenViewMode = screenMode;
    let animFrameCount = 0;

    const renderScreenContent = (time: number) => {
      ctx.clearRect(0, 0, screenCanvas.width, screenCanvas.height);

      // Dark editor / window background
      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, screenCanvas.width, screenCanvas.height);

      // Top title bar
      ctx.fillStyle = '#141724';
      ctx.fillRect(0, 0, screenCanvas.width, 42);

      // Window control dots (Mac-style)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(24, 21, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(44, 21, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(64, 21, 6, 0, Math.PI * 2);
      ctx.fill();

      // Tab title
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      const titleText =
        currentMode === 'code'
          ? 'goodsify-core/src/storefront.ts'
          : currentMode === 'storefront'
          ? 'goodsify-store.preview.live'
          : 'performance-audit.goodsify.dev';
      ctx.fillText(titleText, screenCanvas.width / 2, 26);
      ctx.textAlign = 'left';

      if (currentMode === 'code') {
        // Screen Mode 1: Live Code Editor + Streaming Terminal
        const codeLines = [
          { text: 'import { createStorefront } from "@goodsify/engine";', color: '#c084fc' },
          { text: 'import { googleSheetsSync } from "./integrations";', color: '#c084fc' },
          { text: '', color: '#fff' },
          { text: '// Client Project: E-Commerce Architecture ($250 CAD Tier)', color: '#64748b' },
          { text: 'export const storefront = createStorefront({', color: '#38bdf8' },
          { text: '  business: "Northstar Roasters Inc.",', color: '#86efac' },
          { text: '  catalog: { items: 18, currency: "CAD", checkout: "Instant" },', color: '#fdba74' },
          { text: '  performance: { mobileFirst: true, targetP99: "< 250ms" },', color: '#93c5fd' },
          { text: '  backend: googleSheetsSync({ spreadsheetId: "GDS_LIVE_SYNC" }),', color: '#f472b6' },
          { text: '});', color: '#38bdf8' }
        ];

        ctx.font = '20px "JetBrains Mono", monospace';
        codeLines.forEach((line, idx) => {
          // Line numbers
          ctx.fillStyle = '#475569';
          ctx.fillText(String(idx + 1).padStart(2, '0'), 30, 85 + idx * 28);

          // Line code
          ctx.fillStyle = line.color;
          ctx.fillText(line.text, 70, 85 + idx * 28);
        });

        // Terminal bottom panel
        ctx.fillStyle = '#0f111a';
        ctx.fillRect(20, 390, screenCanvas.width - 40, 220);
        ctx.strokeStyle = '#1e2336';
        ctx.strokeRect(20, 390, screenCanvas.width - 40, 220);

        ctx.fillStyle = '#1e293b';
        ctx.fillRect(20, 390, screenCanvas.width - 40, 32);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '13px "JetBrains Mono", monospace';
        ctx.fillText('TERMINAL — goodsify build --production', 35, 411);

        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillStyle = '#10b981';
        ctx.fillText('✔ TypeScript build verified (0 errors)', 35, 448);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('✔ Google Apps Script Web App: Connected (HTTP 200 OK)', 35, 478);
        ctx.fillStyle = '#a78bfa';
        ctx.fillText('✔ Edge CDN Assets optimized · Cache hit ratio 99.4%', 35, 508);
        ctx.fillStyle = '#e2e8f0';

        // Blinking cursor
        const blink = Math.floor(time * 2) % 2 === 0;
        ctx.fillText(
          `$ ready for live orders ${blink ? '█' : ' '}`,
          35,
          542
        );
      } else if (currentMode === 'storefront') {
        // Screen Mode 2: Live Storefront
        ctx.fillStyle = '#11131c';
        ctx.fillRect(30, 60, screenCanvas.width - 60, 540);

        // Store header
        ctx.fillStyle = '#1b1e2e';
        ctx.fillRect(30, 60, screenCanvas.width - 60, 60);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px "Syne", sans-serif';
        ctx.fillText('NORTHSTAR COFFEE ROASTERS', 55, 98);

        ctx.fillStyle = '#2563eb';
        ctx.fillRect(screenCanvas.width - 240, 74, 150, 34);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        ctx.fillText('CART (3) · $68 CAD', screenCanvas.width - 225, 96);

        // Hero banner inside store
        const grad = ctx.createLinearGradient(55, 140, screenCanvas.width - 110, 240);
        grad.addColorStop(0, '#1e293b');
        grad.addColorStop(1, '#0f172a');
        ctx.fillStyle = grad;
        ctx.fillRect(55, 140, screenCanvas.width - 110, 110);

        ctx.fillStyle = '#38bdf8';
        ctx.font = '12px "JetBrains Mono", monospace';
        ctx.fillText('NEW HARVEST RELEASE · SINGLE ORIGIN', 75, 175);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Syne", sans-serif';
        ctx.fillText('Direct-To-Consumer Subscription Store', 75, 210);

        // Product Cards
        const products = [
          { name: 'Ethiopia Yirgacheffe (Whole Bean)', price: '$22.00 CAD', tag: 'Best Seller' },
          { name: 'Colombia Geisha Reserve', price: '$26.50 CAD', tag: 'Limited Batch' },
          { name: 'Espresso Blend No. 4', price: '$19.50 CAD', tag: 'In Stock' }
        ];

        products.forEach((prod, i) => {
          const cardX = 55 + i * 305;
          const cardY = 275;
          ctx.fillStyle = '#161926';
          ctx.fillRect(cardX, cardY, 285, 290);
          ctx.strokeStyle = '#22283d';
          ctx.strokeRect(cardX, cardY, 285, 290);

          // Thumbnail placeholder
          ctx.fillStyle = '#1f2438';
          ctx.fillRect(cardX + 15, cardY + 15, 255, 140);
          ctx.fillStyle = '#64748b';
          ctx.font = '12px "JetBrains Mono", monospace';
          ctx.fillText('[8K Product Photography]', cardX + 50, cardY + 90);

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
          ctx.fillRect(cardX + 165, cardY + 225, 105, 32);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.fillText('Add to Cart', cardX + 185, cardY + 246);
        });
      } else {
        // Screen Mode 3: Lighthouse 100 & Production Metrics
        ctx.fillStyle = '#11131f';
        ctx.fillRect(30, 60, screenCanvas.width - 60, 540);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px "Syne", sans-serif';
        ctx.fillText('Google Lighthouse 100/100 Core Web Vitals', 60, 110);
        ctx.fillStyle = '#94a3b8';
        ctx.font = '14px "JetBrains Mono", monospace';
        ctx.fillText('Audit result for GOODSiFY client builds on mobile & desktop', 60, 140);

        const metrics = [
          { label: 'Performance', score: 100 },
          { label: 'Accessibility', score: 100 },
          { label: 'Best Practices', score: 100 },
          { label: 'SEO Engine', score: 100 }
        ];

        metrics.forEach((m, idx) => {
          const centerX = 160 + idx * 230;
          const centerY = 270;
          const radius = 65;

          // Background ring
          ctx.lineWidth = 10;
          ctx.strokeStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();

          // Green 100 ring
          ctx.strokeStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, -Math.PI / 2, Math.PI * 1.5);
          ctx.stroke();

          // Score
          ctx.fillStyle = '#10b981';
          ctx.font = 'bold 36px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(String(m.score), centerX, centerY + 12);

          // Label
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px sans-serif';
          ctx.fillText(m.label, centerX, centerY + 115);
          ctx.textAlign = 'left';
        });

        // Detail stats
        ctx.fillStyle = '#181b2b';
        ctx.fillRect(60, 440, screenCanvas.width - 120, 130);
        ctx.strokeStyle = '#272d45';
        ctx.strokeRect(60, 440, screenCanvas.width - 120, 130);

        const subMetrics = [
          { k: 'First Contentful Paint (FCP)', v: '0.4s (Good)' },
          { k: 'Largest Contentful Paint (LCP)', v: '0.8s (Good)' },
          { k: 'Cumulative Layout Shift (CLS)', v: '0.000 (Zero Shift)' },
          { k: 'Interaction to Next Paint (INP)', v: '18ms (Instant)' }
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

      screenTexture.needsUpdate = true;
    };

    setScreenModeRef.current = (mode: ScreenViewMode) => {
      currentMode = mode;
      renderScreenContent(0);
    };

    // Initial screen render
    renderScreenContent(0);

    // 4. Build 3D Laptop Procedural Geometry
    const laptopGroup = new THREE.Group();
    scene.add(laptopGroup);

    // Materials
    const chassisMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2330,
      metalness: 0.85,
      roughness: 0.22,
      envMapIntensity: 1.2
    });

    const darkAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f1118,
      metalness: 0.9,
      roughness: 0.35
    });

    const screenBezelMaterial = new THREE.MeshStandardMaterial({
      color: 0x0b0d14,
      metalness: 0.6,
      roughness: 0.5
    });

    const screenMaterial = new THREE.MeshBasicMaterial({
      map: screenTexture
    });

    const keycapsMaterial = new THREE.MeshStandardMaterial({
      color: 0x12141c,
      metalness: 0.5,
      roughness: 0.4
    });

    // A. Base Chassis (Bottom body)
    const baseWidth = 3.2;
    const baseDepth = 2.15;
    const baseThickness = 0.1;
    const baseGeo = new THREE.BoxGeometry(baseWidth, baseThickness, baseDepth);
    const baseMesh = new THREE.Mesh(baseGeo, chassisMaterial);
    baseMesh.position.y = baseThickness / 2;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    laptopGroup.add(baseMesh);

    // B. Keyboard Recessed Area
    const keyWellGeo = new THREE.BoxGeometry(2.7, 0.015, 1.15);
    const keyWellMesh = new THREE.Mesh(keyWellGeo, darkAccentMaterial);
    keyWellMesh.position.set(0, baseThickness + 0.005, -0.32);
    laptopGroup.add(keyWellMesh);

    // Keyboard keys rows simulation
    for (let r = 0; r < 5; r++) {
      const keysInRow = r === 4 ? 7 : 13;
      const keyW = (2.55 - (keysInRow - 1) * 0.035) / keysInRow;
      const keyH = 0.17;
      for (let c = 0; c < keysInRow; c++) {
        const keyGeo = new THREE.BoxGeometry(keyW, 0.015, keyH);
        const keyMesh = new THREE.Mesh(keyGeo, keycapsMaterial);
        const xPos = -1.25 + keyW / 2 + c * (keyW + 0.035);
        const zPos = -0.75 + r * 0.22;
        keyMesh.position.set(xPos, baseThickness + 0.012, zPos);
        laptopGroup.add(keyMesh);
      }
    }

    // C. Glass Trackpad
    const trackpadGeo = new THREE.BoxGeometry(1.05, 0.008, 0.65);
    const trackpadMesh = new THREE.Mesh(trackpadGeo, darkAccentMaterial);
    trackpadMesh.position.set(0, baseThickness + 0.005, 0.62);
    laptopGroup.add(trackpadMesh);

    // D. Display Lid (Hinged at the back of base)
    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, baseThickness, -baseDepth / 2 + 0.05);
    laptopGroup.add(lidGroup);

    // Hinge cylinder
    const hingeGeo = new THREE.CylinderGeometry(0.045, 0.045, 2.4, 16);
    hingeGeo.rotateZ(Math.PI / 2);
    const hingeMesh = new THREE.Mesh(hingeGeo, darkAccentMaterial);
    hingeMesh.position.set(0, 0, 0);
    lidGroup.add(hingeMesh);

    // Display Shell / Lid back
    const lidHeight = 2.05;
    const lidThickness = 0.06;
    const lidShellGeo = new THREE.BoxGeometry(baseWidth, lidHeight, lidThickness);
    const lidShellMesh = new THREE.Mesh(lidShellGeo, chassisMaterial);
    lidShellMesh.position.set(0, lidHeight / 2, -lidThickness / 2);
    lidShellMesh.castShadow = true;
    lidGroup.add(lidShellMesh);

    // Display Bezel front
    const bezelGeo = new THREE.BoxGeometry(baseWidth - 0.08, lidHeight - 0.08, 0.005);
    const bezelMesh = new THREE.Mesh(bezelGeo, screenBezelMaterial);
    bezelMesh.position.set(0, lidHeight / 2, 0.005);
    lidGroup.add(bezelMesh);

    // Actual Screen Display
    const screenGeo = new THREE.PlaneGeometry(baseWidth - 0.24, lidHeight - 0.26);
    const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
    screenMesh.position.set(0, lidHeight / 2 + 0.03, 0.01);
    lidGroup.add(screenMesh);

    // E. Realistic Floor Shadow Disc
    const shadowGeo = new THREE.PlaneGeometry(5.2, 4.0);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const shadowGrad = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = shadowGrad;
    shadowCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.01;
    scene.add(shadowMesh);

    // 5. Physics & Drop Animation State
    const targetLidAngle = THREE.MathUtils.degToRad(108); // Fully opened lid
    let isDropping = true;
    let dropProgress = 0; // 0 to 1
    const dropDuration = 1.35; // seconds
    let dropStartTime = performance.now();

    const triggerDropAnimation = () => {
      isDropping = true;
      dropProgress = 0;
      dropStartTime = performance.now();
      laptopGroup.position.set(0, 4.8, 0);
      laptopGroup.rotation.set(-0.35, 0.3, -0.15);
      lidGroup.rotation.x = 0; // Lid initially closed during fall
      shadowMesh.scale.set(0.3, 0.3, 0.3);
      shadowMat.opacity = 0.2;
    };

    dropTriggerRef.current = triggerDropAnimation;
    triggerDropAnimation();

    // Mouse interactive orbit / tilt
    let mouseX = 0;
    let mouseY = 0;
    let targetRotY = 0.25;
    let targetRotX = 0.12;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      mouseX = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((clientY - rect.top) / rect.height) * 2 - 1);

      if (isInteracting) {
        targetRotY += mouseX * 0.05;
        targetRotX += mouseY * 0.05;
      }
    };

    let isMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isMouseDown = true;
      setIsInteracting(true);
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMoveWindow = (e: MouseEvent) => {
      if (!isMouseDown) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotY += deltaX * 0.012;
      targetRotX = Math.max(-0.25, Math.min(0.5, targetRotX + deltaY * 0.012));
    };

    const onMouseUpWindow = () => {
      isMouseDown = false;
      setIsInteracting(false);
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMoveWindow);
    window.addEventListener('mouseup', onMouseUpWindow);

    // 6. Main Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update screen texture content for blinking terminal or animations
      animFrameCount++;
      if (animFrameCount % 12 === 0) {
        renderScreenContent(elapsedTime);
      }

      if (isDropping) {
        const timeSinceDrop = (performance.now() - dropStartTime) / 1000;
        const t = Math.min(timeSinceDrop / dropDuration, 1);

        // Bouncy damped physics drop curve
        // Accelerates with gravity, bounces on ground at t ~ 0.45
        if (t < 0.45) {
          // Free fall down
          const fallT = t / 0.45;
          const easeFall = fallT * fallT;
          laptopGroup.position.y = 4.8 * (1 - easeFall);
          laptopGroup.rotation.x = -0.35 * (1 - easeFall * 0.8);
          laptopGroup.rotation.z = -0.15 * (1 - easeFall);
          shadowMesh.scale.set(0.3 + 0.7 * easeFall, 0.3 + 0.7 * easeFall, 1);
          shadowMat.opacity = 0.2 + 0.6 * easeFall;
        } else {
          // Damped bouncy oscillation
          const bounceT = (t - 0.45) / 0.55;
          const bounceAmp = 0.6 * Math.exp(-bounceT * 5.2);
          const bounceOffset = Math.abs(Math.sin(bounceT * Math.PI * 3.5)) * bounceAmp;

          laptopGroup.position.y = bounceOffset;
          laptopGroup.rotation.x = Math.sin(bounceT * Math.PI * 2) * 0.08 * Math.exp(-bounceT * 4);
          laptopGroup.rotation.z = 0;

          // Open the lid smoothly as it bounces
          const lidOpenProgress = Math.min(1, (t - 0.35) / 0.65);
          const easeLid = 1 - Math.pow(1 - lidOpenProgress, 3);
          lidGroup.rotation.x = targetLidAngle * easeLid;

          shadowMesh.scale.set(1 - bounceOffset * 0.15, 1 - bounceOffset * 0.15, 1);
          shadowMat.opacity = 0.8 - bounceOffset * 0.2;
        }

        if (t >= 1) {
          isDropping = false;
          laptopGroup.position.y = 0;
          lidGroup.rotation.x = targetLidAngle;
        }
      } else {
        // Settled: subtle floating idle hover
        const hoverOffset = Math.sin(elapsedTime * 1.8) * 0.04;
        laptopGroup.position.y = hoverOffset;

        // Smooth mouse rotation with damping
        const targetX = targetRotX + mouseY * 0.15;
        const targetY = targetRotY + mouseX * 0.25;

        laptopGroup.rotation.x = THREE.MathUtils.lerp(laptopGroup.rotation.x, targetX, 0.08);
        laptopGroup.rotation.y = THREE.MathUtils.lerp(laptopGroup.rotation.y, targetY, 0.08);

        shadowMesh.scale.set(1 - hoverOffset * 0.2, 1 - hoverOffset * 0.2, 1);
        shadowMat.opacity = 0.78 - hoverOffset * 0.15;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 540;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMoveWindow);
      window.removeEventListener('mouseup', onMouseUpWindow);
      renderer.dispose();
    };
  }, []);

  const handleModeSwitch = (mode: ScreenViewMode) => {
    setScreenMode(mode);
    setScreenModeRef.current(mode);
  };

  const handleReplayDrop = () => {
    dropTriggerRef.current();
  };

  return (
    <div
      className="relative flex flex-col items-center w-full select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Badge: 3D interactive cue */}
      <div className="flex items-center justify-between w-full px-2 mb-2">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Interactive 3D Engine · Production Build</span>
        </div>

        <button
          type="button"
          onClick={handleReplayDrop}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 rounded transition-colors"
          title="Trigger 3D laptop falling animation again"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Replay 3D Drop</span>
        </button>
      </div>

      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[4/3] sm:aspect-[16/11] max-w-[560px] cursor-grab active:cursor-grabbing rounded-xl overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Glow backdrop behind laptop */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-blue-600/10 via-sky-500/5 to-transparent blur-2xl pointer-events-none" />
      </div>

      {/* Interactive Screen View Switcher Toolbar */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 w-full">
        <button
          type="button"
          onClick={() => handleModeSwitch('code')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded transition-all ${
            screenMode === 'code'
              ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/50'
              : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>01. Architecture & Code</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeSwitch('storefront')}
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
          onClick={() => handleModeSwitch('metrics')}
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
        Drag mouse to orbit 3D model · Switch views above to inspect screen deliverables
      </p>
    </div>
  );
};
