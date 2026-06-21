import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import type { RootState } from '../../store';

export const ThreeGlobeBg: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  // Track mouse coordinates for orbital drift
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  // Store theme mode in ref to allow dynamic color shifts without rebuilding WebGL context
  const themeRef = useRef(themeMode);
  useEffect(() => {
    themeRef.current = themeMode;
  }, [themeMode]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Initial Dimensions Setup
    const width = containerRef.current.clientWidth || 250;
    const height = containerRef.current.clientHeight || 250;

    // 2. Scene, Camera, Renderer setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 15, 85); // Angle down at the substation

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Set explicit styles to avoid layout feedback loops
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.pointerEvents = 'none';

    containerRef.current.appendChild(renderer.domElement);

    // 3. Lights Setup (Required for 3D Shaded Materials)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    let isDark = themeRef.current === 'dark';
    let accentColor = isDark ? 0x06b6d4 : 0x4f46e5; // Cyan vs Indigo
    let secondaryColor = isDark ? 0x8b5cf6 : 0xec4899; // Purple vs Pink

    const dirLight1 = new THREE.DirectionalLight(accentColor, 1.8);
    dirLight1.position.set(30, 50, 20);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(secondaryColor, 1.2);
    dirLight2.position.set(-30, 20, -20);
    scene.add(dirLight2);

    // Add a camera-aligned headlight for direct contrast & shading clarity
    const headLight = new THREE.DirectionalLight(0xffffff, 1.2);
    scene.add(headLight);

    // 4. Construct Substation Assembly Group (Rotates Clockwise)
    const substationGroup = new THREE.Group();
    substationGroup.scale.set(1.35, 1.35, 1.35); // Scale up to make transformer size bigger
    scene.add(substationGroup);

    // 4a. Base Foundation Concrete Slab
    const slabGeom = new THREE.BoxGeometry(40, 2, 40);
    const slabMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x374151 : 0xe2e8f0,
      roughness: 0.7,
      metalness: 0.2,
    });
    const slabMesh = new THREE.Mesh(slabGeom, slabMat);
    slabMesh.position.y = -12;
    substationGroup.add(slabMesh);

    // 4b. Main Transformer Tank Body (Brighter Silver/Steel Gray in Dark Mode)
    const tankGeom = new THREE.BoxGeometry(22, 16, 16);
    const tankMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0xd1d5db : 0x94a3b8,
      roughness: 0.4,
      metalness: 0.35,
    });
    const tankMesh = new THREE.Mesh(tankGeom, tankMat);
    tankMesh.position.y = -3;
    substationGroup.add(tankMesh);

    // 4c. Radiator Cooling Fins on left and right sides
    const finGeom = new THREE.BoxGeometry(1.5, 12, 4);
    const finMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x9ca3af : 0x64748b,
      roughness: 0.4,
      metalness: 0.35,
    });
    
    // Add 4 fins on the left side, 4 on the right
    for (let i = 0; i < 4; i++) {
      const zOffset = -6 + i * 4;
      const leftFin = new THREE.Mesh(finGeom, finMat);
      leftFin.position.set(-11.8, -3, zOffset);
      substationGroup.add(leftFin);

      const rightFin = new THREE.Mesh(finGeom, finMat);
      rightFin.position.set(11.8, -3, zOffset);
      substationGroup.add(rightFin);
    }

    // 4d. Conservator cylindrical tank on top
    const consGeom = new THREE.CylinderGeometry(2.5, 2.5, 12, 16);
    const consMesh = new THREE.Mesh(consGeom, tankMat);
    consMesh.rotation.z = Math.PI / 2; // Lie horizontal
    consMesh.position.set(0, 7.5, -4);
    substationGroup.add(consMesh);

    // 4e. High-Voltage Bushings (Tapered porcelain insulator columns)
    const bushingGeom = new THREE.CylinderGeometry(0.3, 0.8, 6, 8);
    const bushingMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x4b5563 : 0x475569,
      roughness: 0.5,
      metalness: 0.25,
    });

    const inputBushings: THREE.Mesh[] = [];
    const outputBushings: THREE.Mesh[] = [];

    // Add 3 Input Bushings (Line In) on left side top
    for (let i = 0; i < 3; i++) {
      const b = new THREE.Mesh(bushingGeom, bushingMat);
      b.position.set(-6, 8, -4 + i * 4);
      b.rotation.z = -Math.PI / 8; // Angled outward left
      substationGroup.add(b);
      inputBushings.push(b);
    }

    // Add 3 Output Bushings (Line Out) on right side top
    for (let i = 0; i < 3; i++) {
      const b = new THREE.Mesh(bushingGeom, bushingMat);
      b.position.set(6, 8, -4 + i * 4);
      b.rotation.z = Math.PI / 8; // Angled outward right
      substationGroup.add(b);
      outputBushings.push(b);
    }

    // 4f. Power Lines (Line In and Line Out Bezier Curves)
    const cableMat = new THREE.LineBasicMaterial({
      color: accentColor,
      linewidth: 2,
    });

    const cableGeometries: THREE.BufferGeometry[] = [];
    const cableLines: THREE.Line[] = [];

    // Line In terminals (fixed on the platform)
    const inTerminals = [
      new THREE.Vector3(-18, -11, -8),
      new THREE.Vector3(-18, -11, 0),
      new THREE.Vector3(-18, -11, 8),
    ];

    // Line Out terminals (fixed on the platform)
    const outTerminals = [
      new THREE.Vector3(18, -11, -8),
      new THREE.Vector3(18, -11, 0),
      new THREE.Vector3(18, -11, 8),
    ];

    // We store curves to animate electrical pulses along them
    const inCurves: THREE.QuadraticBezierCurve3[] = [];
    const outCurves: THREE.QuadraticBezierCurve3[] = [];

    // Generate Input Curves (Lines In)
    for (let i = 0; i < 3; i++) {
      const start = inTerminals[i];
      const bushingPos = inputBushings[i].position.clone();
      bushingPos.y += 3;
      bushingPos.x -= 1.1;

      const control = new THREE.Vector3(-14, 4, -4 + i * 4);
      const curve = new THREE.QuadraticBezierCurve3(start, control, bushingPos);
      inCurves.push(curve);

      const points = curve.getPoints(20);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      cableGeometries.push(geom);

      const line = new THREE.Line(geom, cableMat);
      substationGroup.add(line);
      cableLines.push(line);
    }

    // Generate Output Curves (Lines Out)
    for (let i = 0; i < 3; i++) {
      const start = outputBushings[i].position.clone();
      start.y += 3;
      start.x += 1.1;
      const end = outTerminals[i];

      const control = new THREE.Vector3(14, 4, -4 + i * 4);
      const curve = new THREE.QuadraticBezierCurve3(start, control, end);
      outCurves.push(curve);

      const points = curve.getPoints(20);
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      cableGeometries.push(geom);

      const line = new THREE.Line(geom, cableMat);
      substationGroup.add(line);
      cableLines.push(line);
    }

    // 4g. Electrical Pulse Particles (flowing along lines)
    const pulseGeom = new THREE.SphereGeometry(0.4, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: secondaryColor,
    });

    const pulses: { mesh: THREE.Mesh; curve: THREE.QuadraticBezierCurve3; progress: number; speed: number }[] = [];

    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(pulseGeom, pulseMat);
      substationGroup.add(mesh);
      pulses.push({
        mesh,
        curve: inCurves[i],
        progress: Math.random(),
        speed: 0.015 + Math.random() * 0.01,
      });
    }

    for (let i = 0; i < 3; i++) {
      const mesh = new THREE.Mesh(pulseGeom, pulseMat);
      substationGroup.add(mesh);
      pulses.push({
        mesh,
        curve: outCurves[i],
        progress: Math.random(),
        speed: 0.015 + Math.random() * 0.01,
      });
    }

    // 4h. Glowing Holographic Grid Ring (GIS layout)
    const gridHelper = new THREE.GridHelper(36, 12, accentColor, 0x1d2d44);
    gridHelper.position.y = -11.9;
    substationGroup.add(gridHelper);

    // 5. Ambient space dust particles (glowing current sparks)
    const sparkCount = 40;
    const sparkGeom = new THREE.BufferGeometry();
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3] = (Math.random() - 0.5) * 60;
      sparkPos[i * 3 + 1] = -11 + Math.random() * 25;
      sparkPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    sparkGeom.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      size: 0.6,
      color: secondaryColor,
      transparent: true,
      opacity: 0.4,
    });
    const sparkCloud = new THREE.Points(sparkGeom, sparkMat);
    substationGroup.add(sparkCloud);

    // 6. Mouse Parallax Easing
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.03;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.03;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Tick Loop
    let animationFrameId: number;
    let currentTheme = themeRef.current;

    const tick = () => {
      // Check for theme changes dynamically
      if (currentTheme !== themeRef.current) {
        currentTheme = themeRef.current;
        const dark = currentTheme === 'dark';
        const newAccent = dark ? 0x06b6d4 : 0x4f46e5;
        const newSecondary = dark ? 0x8b5cf6 : 0xec4899;
        
        dirLight1.color.setHex(newAccent);
        dirLight2.color.setHex(newSecondary);
        slabMat.color.setHex(dark ? 0x374151 : 0xe2e8f0);
        tankMat.color.setHex(dark ? 0xd1d5db : 0x94a3b8);
        finMat.color.setHex(dark ? 0x9ca3af : 0x64748b);
        bushingMat.color.setHex(dark ? 0x4b5563 : 0x475569);
        cableMat.color.setHex(newAccent);
        pulseMat.color.setHex(newSecondary);
        sparkMat.color.setHex(newSecondary);
      }

      // 360-view clockwise rotation
      substationGroup.rotation.y -= 0.005;

      // Animate electrical pulses along the curves
      pulses.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
        }
        const point = p.curve.getPointAt(p.progress);
        p.mesh.position.copy(point);
      });

      // Ambient spark flutter
      sparkCloud.rotation.y += 0.001;

      // Mouse Parallax drift
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      camera.position.x = mouseRef.current.x;
      camera.position.y = 15 - mouseRef.current.y;
      camera.lookAt(new THREE.Vector3(0, -3, 0)); // Look at substation center

      // Keep headlight aligned with the camera viewpoint
      headLight.position.copy(camera.position);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // Camera aspect-ratio sizing logic (adapted for 320x320 wrapper box)
    const adjustCameraZ = (w: number, h: number) => {
      const aspect = w / h;
      camera.aspect = aspect;
      
      const targetRadius = 26; // Reduced from 30 to zoom camera in slightly (larger transformer)
      const fovRad = (camera.fov * Math.PI) / 180;
      let zDistance = targetRadius / Math.sin(fovRad / 2);
      
      if (aspect < 1) {
        zDistance = zDistance / aspect;
      }
      
      camera.position.z = Math.max(60, Math.min(zDistance, 130));
      camera.updateProjectionMatrix();
    };

    // 8. Handle Container Resizing safely
    const resizeObserver = new ResizeObserver((entries) => {
      if (!containerRef.current) return;
      for (let entry of entries) {
        const w = entry.contentRect.width || containerRef.current.clientWidth || 250;
        const h = entry.contentRect.height || containerRef.current.clientHeight || 250;
        if (w > 0 && h > 0) {
          adjustCameraZ(w, h);
          // Pass false as the third parameter to resize the drawing buffer but NOT the CSS width/height styles,
          // which prevents layout feedback loops and stops the 360-view from freezing.
          renderer.setSize(w, h, false);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    // 9. Component Unmount cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      if (containerRef.current) {
        try {
          containerRef.current.removeChild(renderer.domElement);
        } catch (_) {}
      }
      // Dispose WebGL assets
      slabGeom.dispose();
      slabMat.dispose();
      tankGeom.dispose();
      tankMat.dispose();
      finGeom.dispose();
      finMat.dispose();
      consGeom.dispose();
      bushingGeom.dispose();
      bushingMat.dispose();
      cableGeometries.forEach((g) => g.dispose());
      cableMat.dispose();
      pulseGeom.dispose();
      pulseMat.dispose();
      gridHelper.dispose();
      sparkGeom.dispose();
      sparkMat.dispose();
    };
  }, []); // Run EXACTLY once on mount

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  );
};

export default ThreeGlobeBg;
