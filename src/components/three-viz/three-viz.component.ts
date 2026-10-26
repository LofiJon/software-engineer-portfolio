import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, ChangeDetectionStrategy } from '@angular/core';
import * as THREE from 'three';

interface ConstellationNode {
  position: THREE.Vector3;
  mesh: THREE.Mesh;
  halo: THREE.Mesh;
  baseScale: number;
}

interface ConstellationLink {
  curve: THREE.CatmullRomCurve3;
  line: THREE.Line;
  packets: CometPacket[];
}

interface CometPacket {
  mesh: THREE.Mesh;
  trail: THREE.Points;
  trailPositions: Float32Array;
  link: ConstellationLink;
  progress: number;
  speed: number;
}

@Component({
  selector: 'app-three-viz',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full h-full bg-[#02010f] overflow-hidden">
      <div class="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_25%,#02010f_100%)]"></div>
      <canvas #canvas class="w-full h-full outline-none" role="img" aria-label="Animated 3D constellation of connected nodes"></canvas>
      <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
        <div class="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.4em] text-slate-400">
          <span class="w-1.5 h-1.5 bg-cyan-300 shadow-[0_0_12px_#22d3ee]"></span>
          <span>CONSTELLATION::MESH</span>
        </div>
        <div class="hidden sm:block text-[10px] font-mono uppercase tracking-[0.4em] text-violet-300/80">DISTRIBUTED.SYS</div>
      </div>
    </div>
  `
})
export class ThreeVizComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private galaxyGroup!: THREE.Group;
  private coreGroup!: THREE.Group;

  private stars!: THREE.Points;
  private nodes: ConstellationNode[] = [];
  private links: ConstellationLink[] = [];
  private packets: CometPacket[] = [];

  private animationId = 0;
  private running = false;
  private reducedMotion = false;
  private resizeObserver?: ResizeObserver;
  private visibilityObserver?: IntersectionObserver;
  private targetRotX = 0;
  private targetRotY = 0;
  private currentRotX = 0;
  private currentRotY = 0;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initThree();
    this.initInteraction();
  }

  ngOnDestroy(): void {
    this.stop();
    this.resizeObserver?.disconnect();
    this.visibilityObserver?.disconnect();
    window.removeEventListener('mousemove', this.onMouseMove);
    this.renderer?.dispose();
  }

  private initThree(): void {
    const canvas = this.canvasRef.nativeElement;
    const parent = canvas.parentElement!;
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x02010f, 7, 16);

    this.camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 60);
    this.camera.position.set(0, 1.4, 10);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    this.renderer.setClearColor(0x000000, 0);

    this.galaxyGroup = new THREE.Group();
    this.coreGroup = new THREE.Group();
    this.scene.add(this.galaxyGroup);
    this.scene.add(this.coreGroup);

    this.createStarfield();
    this.createSingularityCore();
    this.createConstellation();
    this.createComets();

    this.resizeObserver = new ResizeObserver(() => {
      const nw = parent.clientWidth;
      const nh = parent.clientHeight;
      if (!nw || !nh) return;
      this.renderer.setSize(nw, nh);
      this.camera.aspect = nw / nh;
      this.camera.updateProjectionMatrix();
      if (!this.running) this.renderer.render(this.scene, this.camera);
    });
    this.resizeObserver.observe(parent);

    // Respect reduced-motion: render a single static frame instead of looping
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (this.reducedMotion) {
      this.renderer.render(this.scene, this.camera);
      return;
    }

    // Only animate while the canvas is on screen
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? this.start() : this.stop();
    });
    this.visibilityObserver.observe(parent);
  }

  private start(): void {
    if (this.running) return;
    this.running = true;
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private stop(): void {
    this.running = false;
    cancelAnimationFrame(this.animationId);
  }

  private createStarfield(): void {
    const count = 2400;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const radius = 9 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.7;

      positions[i * 3 + 0] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const mix = Math.random();
      if (mix < 0.65) color.setHex(0xe0f2fe);
      else if (mix < 0.88) color.setHex(0xa78bfa);
      else color.setHex(0x22d3ee);

      colors[i * 3 + 0] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.012,
      transparent: true,
      opacity: 0.85,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.stars = new THREE.Points(geometry, material);
    this.galaxyGroup.add(this.stars);
  }

  private createSingularityCore(): void {
    const coreGeo = new THREE.IcosahedronGeometry(0.26, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    this.coreGroup.add(core);

    const innerGlowGeo = new THREE.IcosahedronGeometry(0.34, 1);
    const innerGlowMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.26,
      blending: THREE.AdditiveBlending,
      wireframe: true
    });
    const innerGlow = new THREE.Mesh(innerGlowGeo, innerGlowMat);
    this.coreGroup.add(innerGlow);

    const haloGeo = new THREE.RingGeometry(0.42, 0.5, 48);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2;
    this.coreGroup.add(halo);

    const outerHaloGeo = new THREE.RingGeometry(0.58, 0.64, 64);
    const outerHaloMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.1,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    const outerHalo = new THREE.Mesh(outerHaloGeo, outerHaloMat);
    outerHalo.rotation.x = Math.PI / 2;
    outerHalo.rotation.z = Math.PI / 6;
    this.coreGroup.add(outerHalo);
  }

  private createConstellation(): void {
    const nodeGeo = new THREE.OctahedronGeometry(0.14, 0);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: 0xe0f2fe,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending
    });
    const haloGeo = new THREE.SphereGeometry(0.22, 20, 20);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending
    });
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xa78bfa,
      transparent: true,
      opacity: 0.24,
      blending: THREE.AdditiveBlending
    });

    const corePos = new THREE.Vector3(0, 0, 0);
    const layout = [
      { angle: 16, radius: 2.7, y: 0.55 },
      { angle: 84, radius: 2.5, y: -0.08 },
      { angle: 152, radius: 3.0, y: 0.28 },
      { angle: 224, radius: 2.4, y: -0.42 },
      { angle: 296, radius: 2.8, y: 0.18 },
      { angle: 344, radius: 2.2, y: -0.24 }
    ];

    layout.forEach((item) => {
      const x = Math.cos((item.angle * Math.PI) / 180) * item.radius;
      const z = Math.sin((item.angle * Math.PI) / 180) * item.radius;
      const pos = new THREE.Vector3(x, item.y, z);

      const mesh = new THREE.Mesh(nodeGeo, nodeMat.clone());
      mesh.position.copy(pos);
      this.galaxyGroup.add(mesh);

      const halo = new THREE.Mesh(haloGeo, haloMat.clone());
      halo.position.copy(pos);
      this.galaxyGroup.add(halo);

      this.nodes.push({ position: pos.clone(), mesh, halo, baseScale: 1 });

      const mid = corePos.clone().add(pos).multiplyScalar(0.5);
      mid.y += (Math.random() - 0.5) * 1.0;
      mid.x += (Math.random() - 0.5) * 0.5;
      mid.z += (Math.random() - 0.5) * 0.5;

      const curve = new THREE.CatmullRomCurve3([corePos.clone(), mid, pos.clone()]);
      const points = curve.getPoints(72);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMat.clone());
      this.galaxyGroup.add(line);

      this.links.push({ curve, line, packets: [] });
    });
  }

  private createComets(): void {
    const headGeo = new THREE.SphereGeometry(0.03, 16, 16);
    const headMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.98,
      blending: THREE.AdditiveBlending
    });

    this.links.forEach((link) => {
      const count = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < count; i++) {
        const mesh = new THREE.Mesh(headGeo, headMat.clone());
        mesh.visible = false;
        this.galaxyGroup.add(mesh);

        const trailCount = 16;
        const trailPositions = new Float32Array(trailCount * 3);
        const trailGeo = new THREE.BufferGeometry();
        trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

        const trailMat = new THREE.PointsMaterial({
          color: 0x22d3ee,
          size: 0.016,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const trail = new THREE.Points(trailGeo, trailMat);
        this.galaxyGroup.add(trail);

        this.packets.push({
          mesh,
          trail,
          trailPositions,
          link,
          progress: Math.random(),
          speed: 0.0016 + Math.random() * 0.002
        });
      }
    });
  }

  private initInteraction(): void {
    if (this.reducedMotion) return;
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
  }

  private onMouseMove = (event: MouseEvent): void => {
    const parent = this.canvasRef.nativeElement.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    this.targetRotY = x * 0.22;
    this.targetRotX = -y * 0.14;
  };

  private animate = (time = 0): void => {
    this.animationId = requestAnimationFrame(this.animate);
    const t = time * 0.001;

    this.currentRotX += (this.targetRotX - this.currentRotX) * 0.08;
    this.currentRotY += (this.targetRotY - this.currentRotY) * 0.08;

    this.galaxyGroup.rotation.y = t * 0.08 + this.currentRotY;
    this.galaxyGroup.rotation.x = Math.sin(t * 0.12) * 0.06 + this.currentRotX;
    this.galaxyGroup.rotation.z = Math.sin(t * 0.08) * 0.03;

    this.coreGroup.rotation.y = t * 0.26;
    this.coreGroup.rotation.x = Math.sin(t * 0.16) * 0.12;

    const corePulse = 1 + Math.sin(t * 1.8) * 0.16;
    this.coreGroup.scale.setScalar(corePulse);

    if (this.stars) {
      this.stars.rotation.y = t * 0.01;
      this.stars.rotation.x = Math.sin(t * 0.06) * 0.01;
    }

    this.nodes.forEach((node, idx) => {
      const pulse = 1 + Math.sin(t * 1.4 + idx * 0.8) * 0.18;
      node.mesh.scale.setScalar(pulse);
      node.halo.scale.setScalar(1 + Math.sin(t * 1.2 + idx) * 0.24);
      (node.halo.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(t * 1.2 + idx) * 0.09;
    });

    this.packets.forEach((packet) => {
      packet.progress += packet.speed;
      if (packet.progress >= 1) {
        packet.progress = 0;
      }

      const point = packet.link.curve.getPointAt(packet.progress);
      packet.mesh.position.copy(point);
      packet.mesh.visible = true;

      const headScale = 0.8 + Math.sin(packet.progress * Math.PI) * 1.2;
      packet.mesh.scale.setScalar(headScale);
      (packet.mesh.material as THREE.MeshBasicMaterial).opacity = 0.6 + Math.sin(packet.progress * Math.PI) * 0.4;

      for (let i = packet.trailPositions.length / 3 - 1; i > 0; i--) {
        packet.trailPositions[i * 3 + 0] = packet.trailPositions[(i - 1) * 3 + 0];
        packet.trailPositions[i * 3 + 1] = packet.trailPositions[(i - 1) * 3 + 1];
        packet.trailPositions[i * 3 + 2] = packet.trailPositions[(i - 1) * 3 + 2];
      }

      packet.trailPositions[0] = point.x;
      packet.trailPositions[1] = point.y;
      packet.trailPositions[2] = point.z;

      (packet.trail.geometry.attributes['position'] as THREE.BufferAttribute).needsUpdate = true;
      (packet.trail.material as THREE.PointsMaterial).opacity = 0.25 + Math.sin(packet.progress * Math.PI) * 0.28;
    });

    this.renderer.render(this.scene, this.camera);
  };
}
