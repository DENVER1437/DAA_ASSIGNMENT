import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// 1. Procedural Glowing Radial Particle Texture (Embers & Data Packets)
function createParticleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.2, 'rgba(255, 95, 105, 0.95)');
  gradient.addColorStop(0.5, 'rgba(198, 40, 50, 0.45)');
  gradient.addColorStop(0.8, 'rgba(132, 60, 67, 0.15)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 2. Procedural Glowing Halo Texture for Central Algorithm Core
function createHaloTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, 'rgba(255, 70, 85, 0.85)');
  gradient.addColorStop(0.3, 'rgba(198, 40, 50, 0.45)');
  gradient.addColorStop(0.65, 'rgba(100, 25, 35, 0.15)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// 3. Procedural Reflective Cyber Grid Arena Floor Texture
function createCyberGridTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Deep obsidian base
  ctx.fillStyle = '#060709';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle inner tile gradient
  const tileGrad = ctx.createRadialGradient(256, 256, 10, 256, 256, 250);
  tileGrad.addColorStop(0, 'rgba(25, 27, 34, 0.4)');
  tileGrad.addColorStop(1, 'rgba(6, 7, 9, 0)');
  ctx.fillStyle = tileGrad;
  ctx.fillRect(0, 0, 512, 512);

  // Precision cyber grid lines
  ctx.strokeStyle = 'rgba(198, 40, 50, 0.22)';
  ctx.lineWidth = 1.5;
  const step = 64;
  for (let x = 0; x <= 512; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  // Crosshair intersection node points
  ctx.fillStyle = 'rgba(255, 90, 100, 0.65)';
  for (let x = 0; x <= 512; x += step) {
    for (let y = 0; y <= 512; y += step) {
      ctx.fillRect(x - 2, y - 2, 4, 4);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
  texture.needsUpdate = true;
  return texture;
}

export const ThreeBackground = () => {
  const mountRef = useRef(null);
  const [webglSupported] = useState(() => {
    try {
      if (typeof document === 'undefined') return true;
      const canvasTest = document.createElement('canvas');
      return !!(canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container || !webglSupported) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // 1. Scene & Cinematic Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x060709, 0.024);

    // 2. Camera Setup (Cinematic 40° FOV for dramatic scale and depth)
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 48 : 40,
      window.innerWidth / window.innerHeight,
      0.1,
      120
    );
    camera.position.set(0, 1.4, 11);

    // 3. WebGL Renderer with Tone Mapping
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isMobile,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
      container.appendChild(renderer.domElement);
    } catch (err) {
      console.warn('WebGL init error:', err);
      return;
    }

    // 4. Lighting Rig
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0x12141a, 1.2);
    scene.add(ambientLight);

    // Overhead directional light for specular sheen
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(4, 10, 6);
    scene.add(dirLight);

    // Orbiting Vermilion Key Light
    const vermilionKeyLight = new THREE.PointLight(0xff2a3b, 5.0, 36, 1.3);
    vermilionKeyLight.position.set(0, 3.5, 4);
    scene.add(vermilionKeyLight);

    // Deep Carmine Fill Light
    const carmineFillLight = new THREE.PointLight(0x843c43, 3.5, 28, 1.4);
    carmineFillLight.position.set(-6, -1, 3);
    scene.add(carmineFillLight);

    // Interactive Mouse Pointer Light (moves in real-time in 3D space!)
    const mousePointerLight = new THREE.PointLight(0xff5a64, 4.0, 18, 1.5);
    mousePointerLight.position.set(0, 1, 6);
    scene.add(mousePointerLight);

    // 5. Reflective Cyber Grid Floor
    const floorTexture = createCyberGridTexture();
    const floorGeometry = new THREE.PlaneGeometry(70, 70);
    const floorMaterial = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.25,
      metalness: 0.8,
      transparent: true,
      opacity: 0.92,
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -2.6;
    scene.add(floorMesh);

    // 6. Central Algorithm Core (Luminous Celestial/Cyber Sphere + Rotating Orbital Rings)
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 2.2, -15);

    // Inner glowing core sphere
    const coreSphereGeom = new THREE.SphereGeometry(2.0, 32, 32);
    const coreSphereMat = new THREE.MeshStandardMaterial({
      color: 0xff1e2e,
      emissive: 0xff1e2e,
      emissiveIntensity: 1.4,
      roughness: 0.2,
      metalness: 0.9,
    });
    const coreSphere = new THREE.Mesh(coreSphereGeom, coreSphereMat);
    coreGroup.add(coreSphere);

    // Core point light emanating from center
    const corePointLight = new THREE.PointLight(0xff2a3b, 8.0, 40, 1.3);
    coreGroup.add(corePointLight);

    // Core outer corona glow sprite
    const haloTexture = createHaloTexture();
    const haloMaterial = new THREE.SpriteMaterial({
      map: haloTexture,
      color: 0xff3b47,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const haloSprite = new THREE.Sprite(haloMaterial);
    haloSprite.scale.set(12, 12, 1);
    coreGroup.add(haloSprite);

    // Concentric Cyber Rings around Core
    const ring1Geom = new THREE.TorusGeometry(3.4, 0.04, 16, 80);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xff5a64,
      emissive: 0xff5a64,
      emissiveIntensity: 0.8,
      roughness: 0.3,
      metalness: 0.9,
    });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(4.2, 0.03, 16, 80);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x843c43,
      emissive: 0x843c43,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.9,
    });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    scene.add(coreGroup);

    // 7. Towering 3D Sorting Data Monoliths (Cyber Amphitheater)
    const monolithsGroup = new THREE.Group();
    const pillarCount = isMobile ? 22 : 36;
    const pillars = [];
    const pillarGeometries = [];
    const pillarMaterials = [];

    const baseBoxGeom = new THREE.BoxGeometry(0.42, 1, 0.42);
    const capGeom = new THREE.BoxGeometry(0.44, 0.08, 0.44);
    pillarGeometries.push(baseBoxGeom, capGeom);

    for (let i = 0; i < pillarCount; i++) {
      const isCrimsonAccent = i % 4 === 0;
      const isWineAccent = i % 4 === 2;

      // Shaft Material: Dark polished obsidian alloy
      const shaftMat = new THREE.MeshStandardMaterial({
        color: isCrimsonAccent ? 0x221316 : isWineAccent ? 0x1b1316 : 0x111318,
        metalness: 0.85,
        roughness: 0.22,
        emissive: isCrimsonAccent ? 0x4a0e14 : isWineAccent ? 0x280d12 : 0x000000,
        emissiveIntensity: isCrimsonAccent ? 0.4 : 0.2,
      });

      // Cap Material: Glowing neon algorithm status beacon
      const capMat = new THREE.MeshStandardMaterial({
        color: isCrimsonAccent ? 0xff2a3b : isWineAccent ? 0x843c43 : 0xffffff,
        emissive: isCrimsonAccent ? 0xff2a3b : isWineAccent ? 0x843c43 : 0x667788,
        emissiveIntensity: isCrimsonAccent ? 1.0 : isWineAccent ? 0.7 : 0.3,
        roughness: 0.1,
        metalness: 0.9,
      });

      pillarMaterials.push(shaftMat, capMat);

      const shaftMesh = new THREE.Mesh(baseBoxGeom, shaftMat);
      const capMesh = new THREE.Mesh(capGeom, capMat);

      const pillarUnit = new THREE.Group();
      pillarUnit.add(shaftMesh);
      pillarUnit.add(capMesh);

      // Distribute in a dramatic double-arc amphitheater
      const tier = i % 2 === 0 ? 1 : 1.35;
      const angle = (i / pillarCount) * Math.PI * 1.55 - Math.PI * 0.775;
      const radius = (isMobile ? 6.8 : 8.8) * tier;
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius + 1.5;
      const baseHeight = 1.4 + Math.sin(i * 0.5) * 1.8 + Math.random() * 0.8;

      pillarUnit.position.set(x, -2.6, z);
      pillarUnit.rotation.y = -angle;

      monolithsGroup.add(pillarUnit);
      pillars.push({
        unit: pillarUnit,
        shaft: shaftMesh,
        cap: capMesh,
        baseHeight,
        speed: 1.1 + (i % 5) * 0.28,
        phase: i * 0.38,
      });
    }
    scene.add(monolithsGroup);

    // 8. Floating Geometric Algorithm Crystals (Octahedrons & Icosahedrons)
    const crystalsGroup = new THREE.Group();
    const crystalList = [];
    const crystalCount = isMobile ? 6 : 14;

    const octaGeom = new THREE.OctahedronGeometry(0.42, 0);
    const icosaGeom = new THREE.IcosahedronGeometry(0.35, 0);
    pillarGeometries.push(octaGeom, icosaGeom);

    for (let i = 0; i < crystalCount; i++) {
      const isOcta = i % 2 === 0;
      const geom = isOcta ? octaGeom : icosaGeom;

      const mat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? 0xff2a3b : i % 3 === 1 ? 0x843c43 : 0x2a3140,
        emissive: i % 3 === 0 ? 0xff2a3b : i % 3 === 1 ? 0x581c20 : 0x111622,
        emissiveIntensity: 0.6,
        roughness: 0.15,
        metalness: 0.9,
        wireframe: i % 4 === 0,
      });
      pillarMaterials.push(mat);

      const mesh = new THREE.Mesh(geom, mat);
      const angle = (i / crystalCount) * Math.PI * 2;
      const r = 4.5 + Math.random() * 6.0;
      mesh.position.set(
        Math.cos(angle) * r,
        -0.5 + Math.random() * 5.0,
        Math.sin(angle) * r - 4
      );

      crystalsGroup.add(mesh);
      crystalList.push({
        mesh,
        rotSpeedX: 0.4 + Math.random() * 0.6,
        rotSpeedY: 0.5 + Math.random() * 0.7,
        floatSpeed: 0.8 + Math.random() * 0.6,
        floatPhase: Math.random() * Math.PI * 2,
        baseY: mesh.position.y,
      });
    }
    scene.add(crystalsGroup);

    // 9. 500+ Glowing Cyber Embers & Data Packets (Radial Additive Texture)
    const particleCount = isMobile ? 240 : 540;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);

    const cVermilion = new THREE.Color(0xff2a3b);
    const cBright = new THREE.Color(0xff6e7a);
    const cWine = new THREE.Color(0x843c43);
    const cWhite = new THREE.Color(0xf5f5f7);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = -2.6 + Math.random() * 16;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 26 - 3;

      // Unique velocity drift: rising upward like cyber heat
      particleVelocities[i * 3] = (Math.random() - 0.5) * 0.18;
      particleVelocities[i * 3 + 1] = 0.25 + Math.random() * 0.45;
      particleVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.18;

      const pick = Math.random();
      const color = pick < 0.4 ? cVermilion : pick < 0.7 ? cBright : pick < 0.88 ? cWine : cWhite;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleTexture = createParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      size: isMobile ? 0.36 : 0.32,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 10. Dynamic Constellation Laser Lines
    const maxLineSegments = isMobile ? 25 : 55;
    const linePositions = new Float32Array(maxLineSegments * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xff2a3b,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const constellationLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(constellationLines);

    for (let i = 0; i < maxLineSegments; i++) {
      const pIdx1 = Math.floor(Math.random() * particleCount);
      const pIdx2 = (pIdx1 + Math.floor(Math.random() * 6) + 1) % particleCount;
      const lIdx = i * 6;
      linePositions[lIdx] = positions[pIdx1 * 3];
      linePositions[lIdx + 1] = positions[pIdx1 * 3 + 1];
      linePositions[lIdx + 2] = positions[pIdx1 * 3 + 2];
      linePositions[lIdx + 3] = positions[pIdx2 * 3];
      linePositions[lIdx + 4] = positions[pIdx2 * 3 + 1];
      linePositions[lIdx + 5] = positions[pIdx2 * 3 + 2];
    }
    lineGeometry.attributes.position.needsUpdate = true;

    // 11. Mouse & Scroll Interaction Listeners
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let scrollProgress = 0;
    let targetScrollProgress = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
      targetScrollProgress = Math.min(Math.max(currentScroll / maxScroll, 0), 1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 12. Visibility Handling (Pause when tab is hidden)
    let animationFrameId;
    const clock = new THREE.Clock();
    let isDocumentVisible = true;

    const handleVisibilityChange = () => {
      isDocumentVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 13. Main Animation Loop with Damped Physics & Cinematic Camera Spline
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDocumentVisible) return;

      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      // Fluid second-order damping for mouse & scroll
      mouseX += (targetMouseX - mouseX) * 0.055;
      mouseY += (targetMouseY - mouseY) * 0.055;
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.045;

      // Update 3D Mouse Pointer Light
      mousePointerLight.position.x = mouseX * 7.5;
      mousePointerLight.position.y = 1.0 - mouseY * 4.5;
      mousePointerLight.position.z = 4.5 - scrollProgress * 2.0;

      if (!prefersReducedMotion) {
        // Continuous Rhythmic Sorting Wave on Monoliths (simulating active compare & swap)
        pillars.forEach((p, idx) => {
          const wave = Math.sin(elapsedTime * p.speed + p.phase) * 1.5;
          const harmonic = Math.cos(elapsedTime * 0.9 + idx * 0.28) * 0.8;
          const currentH = Math.max(0.5, p.baseHeight + wave + harmonic);

          p.shaft.scale.y = currentH;
          p.shaft.position.y = currentH / 2;
          p.cap.position.y = currentH + 0.04;
        });

        // Rotate & Pulse Core Orbital Rings
        ring1.rotation.z = elapsedTime * 0.35;
        ring1.rotation.x = Math.PI / 3 + Math.sin(elapsedTime * 0.5) * 0.15;
        ring2.rotation.y = elapsedTime * 0.45;
        ring2.rotation.z = Math.cos(elapsedTime * 0.6) * 0.2;

        coreSphere.rotation.y = elapsedTime * 0.2;
        corePointLight.intensity = 7.0 + Math.sin(elapsedTime * 2.4) * 1.8;
        haloSprite.scale.set(12 + Math.sin(elapsedTime * 2.0) * 1.2, 12 + Math.sin(elapsedTime * 2.0) * 1.2, 1);

        // Animate Floating Geometric Crystals
        crystalList.forEach((c) => {
          c.mesh.rotation.x += delta * c.rotSpeedX;
          c.mesh.rotation.y += delta * c.rotSpeedY;
          c.mesh.position.y = c.baseY + Math.sin(elapsedTime * c.floatSpeed + c.floatPhase) * 0.5;
        });

        // Continuous Upward Floating & Orbiting Particle Movement
        const posAttr = particleGeometry.attributes.position;
        const posArray = posAttr.array;

        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          // Float upward continuously
          posArray[idx + 1] += particleVelocities[idx + 1] * delta;

          // Gentle horizontal harmonic drift (like heat rising)
          posArray[idx] += Math.sin(elapsedTime * 0.6 + i) * 0.014;

          // Recycle particle if it floats past ceiling
          if (posArray[idx + 1] > 13) {
            posArray[idx + 1] = -2.6;
            posArray[idx] = (Math.random() - 0.5) * 34;
            posArray[idx + 2] = (Math.random() - 0.5) * 26 - 3;
          }
        }
        posAttr.needsUpdate = true;

        // Subtle Group Movements
        monolithsGroup.rotation.y = Math.sin(elapsedTime * 0.12) * 0.06;
        particleSystem.rotation.y = elapsedTime * 0.018;

        // Orbiting Vermilion Key Light
        vermilionKeyLight.position.x = Math.sin(elapsedTime * 0.55) * 6;
        vermilionKeyLight.position.z = Math.cos(elapsedTime * 0.55) * 5 + 1;
        vermilionKeyLight.position.y = 2.5 + Math.sin(elapsedTime * 0.7) * 1.5;

        // Carmine Fill Light
        carmineFillLight.position.x = -Math.cos(elapsedTime * 0.45) * 7;
        carmineFillLight.position.z = -Math.sin(elapsedTime * 0.45) * 4 + 2;
      }

      // 14. Cinematic Camera Choreography linked to Mouse & Page Scroll
      // Camera descends and navigates the 3D canyon as user scrolls through sections
      const camX = mouseX * 1.4 + Math.sin(scrollProgress * Math.PI) * 1.8;
      const camY = 1.4 - mouseY * 0.9 - scrollProgress * 2.2;
      const camZ = 11 - scrollProgress * 4.5;
      const lookY = 0.2 - mouseY * 0.4 - scrollProgress * 1.8;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, lookY, -scrollProgress * 2.0);

      renderer.render(scene, camera);
    };

    animate();

    // 15. Clean up all resources properly on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      particleGeometry.dispose();
      particleMaterial.dispose();
      particleTexture.dispose();
      haloTexture.dispose();
      haloMaterial.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      floorTexture.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      coreSphereGeom.dispose();
      coreSphereMat.dispose();
      ring1Geom.dispose();
      ring1Mat.dispose();
      ring2Geom.dispose();
      ring2Mat.dispose();

      pillarGeometries.forEach((g) => g.dispose());
      pillarMaterials.forEach((m) => m.dispose());

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [webglSupported]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* Atmospheric Gradients & Fallback if WebGL unavailable */}
      {!webglSupported && (
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at 40% 30%, rgba(255, 42, 59, 0.3) 0%, transparent 65%), radial-gradient(ellipse at 75% 75%, rgba(132, 60, 67, 0.25) 0%, transparent 65%)',
          }}
        />
      )}

      {/* Depth Vignette Frame (smooth edge transition, transparent center to display 3D arena) */}
      <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#060709]/80 pointer-events-none" />
    </div>
  );
};

export default ThreeBackground;
