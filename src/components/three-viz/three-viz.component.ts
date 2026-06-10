import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, ChangeDetectionStrategy, signal } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-viz',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full h-[600px] md:h-screen bg-[#020617] overflow-hidden flex items-center justify-center selection:bg-[#06b6d4] selection:text-white" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
       
       <!-- CSS Grain & Texture -->
       <div class="absolute inset-0 pointer-events-none opacity-[0.05] z-10" style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E'); mix-blend-mode: screen;"></div>
       
       <!-- Vignette -->
       <div class="absolute inset-0 pointer-events-none z-10" style="background: radial-gradient(circle at center, transparent 20%, #020617 120%);"></div>

       <canvas #canvas class="w-full h-full outline-none z-0"></canvas>
       
       <!-- Bold Brutalist UI -->
       <div class="absolute top-0 left-0 w-full h-full pointer-events-none z-20 p-6 md:p-12 flex flex-col justify-between">
          
          <div class="flex justify-between items-start w-full">
            <div class="flex flex-col">
              <h1 class="text-[#E0E0E0] text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase mix-blend-difference" style="text-shadow: 0 0 40px rgba(255,255,255,0.2);">
                Void<br/>Anomaly
              </h1>
              <div class="flex items-center gap-4 mt-6">
                 <div class="w-16 h-[2px] bg-[#06b6d4]"></div>
                 <div class="text-[#94a3b8] text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase">Sector 7G // Containment</div>
              </div>
            </div>
            
            <div class="text-right flex flex-col items-end">
              <div class="text-[#E0E0E0] text-4xl md:text-6xl font-black tracking-tighter mix-blend-difference">{{ fps() }}</div>
              <div class="text-[#06b6d4] text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Frames Per Second</div>
              
              <div class="mt-8 flex flex-col items-end gap-1 text-[9px] md:text-[10px] text-[#64748b] tracking-[0.2em] font-mono">
                 <div>SYS.MEM: OPTIMAL</div>
                 <div>TEMP: 3.4K</div>
                 <div class="text-[#06b6d4] animate-pulse mt-2">DANGER: CRITICAL MASS</div>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col md:flex-row justify-between items-end w-full gap-6 md:gap-0">
             <div class="max-w-sm">
                <p class="text-[#94a3b8] text-[10px] md:text-xs leading-relaxed font-medium tracking-wide mix-blend-difference border-l-2 border-[#1e293b] pl-4">
                   OBSERVATION PROTOCOL ALPHA.<br/>
                   THE GEOMETRIC ENTITY EXHIBITS NON-EUCLIDEAN PROPERTIES AND SPONTANEOUS ENERGY FLUCTUATIONS.
                   MAINTAIN SAFE DISTANCE.
                </p>
             </div>
             
             <div class="flex flex-col items-end gap-2 font-mono text-[9px] md:text-xs text-[#64748b] tracking-[0.1em]">
                <div class="flex gap-4">
                   <span>AXIS.X</span>
                   <span class="text-[#E0E0E0] w-12 text-right">{{ camPos().x }}</span>
                </div>
                <div class="flex gap-4">
                   <span>AXIS.Y</span>
                   <span class="text-[#E0E0E0] w-12 text-right">{{ camPos().y }}</span>
                </div>
                <div class="flex gap-4">
                   <span>AXIS.Z</span>
                   <span class="text-[#E0E0E0] w-12 text-right">{{ camPos().z }}</span>
                </div>
             </div>
          </div>
       </div>
    </div>
  `
})
export class ThreeVizComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  fps = signal(0);
  camPos = signal({ x: '0.00', y: '0.00', z: '0.00' });

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  private anomalyMat!: THREE.ShaderMaterial;
  private cages: THREE.Object3D[] = [];
  private particles!: THREE.Points;

  private animationId = 0;
  private lastFpsTime = 0;
  private frameCount = 0;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void { this.initThree(); }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.renderer?.dispose();
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x020617, 0.04);

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
    this.camera.position.set(0, 0, 12);

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.createAnomaly();
    this.createCages();
    this.createParticles();

    new ResizeObserver(() => {
      const nw = canvas.clientWidth;
      const nh = canvas.clientHeight;
      this.renderer.setSize(nw, nh);
      this.camera.aspect = nw / nh;
      this.camera.updateProjectionMatrix();
    }).observe(canvas.parentElement!);

    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private createAnomaly() {
    const geometry = new THREE.IcosahedronGeometry(2.5, 40).toNonIndexed();
    
    const noise3D = `
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v) {
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                   i.z + vec4(0.0, i1.z, i2.z, 1.0))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }
    `;

    this.anomalyMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 }
      },
      vertexShader: `
        uniform float uTime;
        varying vec3 vViewPosition;
        varying float vNoise;
        ${noise3D}
        void main() {
          // Add complex noise displacement
          float n1 = snoise(position * 1.2 + uTime * 0.4);
          float n2 = snoise(position * 2.8 - uTime * 0.6) * 0.5;
          float noise = n1 + n2;
          vNoise = noise;
          
          vec3 displaced = position + normal * (noise * 0.8);
          vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vViewPosition;
        varying float vNoise;
        
        void main() {
          // Flat shading normal computation
          vec3 fdx = dFdx(vViewPosition);
          vec3 fdy = dFdy(vViewPosition);
          vec3 normal = normalize(cross(fdx, fdy));
          
          vec3 lightDir1 = normalize(vec3(1.0, 1.0, 1.0));
          vec3 lightDir2 = normalize(vec3(-1.0, -0.5, -1.0));
          
          float diff1 = max(dot(normal, lightDir1), 0.0);
          float diff2 = max(dot(normal, lightDir2), 0.0);
          
          vec3 baseColor = vec3(0.01, 0.02, 0.09); // Deep slate void
          vec3 highlightColor = vec3(0.02, 0.71, 0.83); // #06b6d4 (Cyan)
          vec3 rimColor = vec3(0.8, 0.95, 1.0); // Ghostly cyan-white
          
          // Noise-based glow
          float glowMask = smoothstep(0.4, 1.2, vNoise);
          vec3 col = mix(baseColor, highlightColor, glowMask);
          
          // Apply lighting
          col += diff1 * vec3(0.1, 0.15, 0.2) + diff2 * vec3(0.02, 0.05, 0.1);
          
          // Fresnel rim lighting
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
          fresnel = smoothstep(0.5, 1.0, fresnel);
          col += rimColor * fresnel * 0.8 * (1.0 - glowMask);
          
          gl_FragColor = vec4(col, 1.0);
        }
      `,
      extensions: { derivatives: true } as any
    });

    const mesh = new THREE.Mesh(geometry, this.anomalyMat);
    this.scene.add(mesh);
  }

  private createCages() {
    // Outer wireframe cage
    const cageGeo1 = new THREE.IcosahedronGeometry(4.2, 1).toNonIndexed();
    const edges1 = new THREE.EdgesGeometry(cageGeo1);
    const mat1 = new THREE.LineBasicMaterial({ color: 0x1e293b, transparent: true, opacity: 0.8 });
    const cage1 = new THREE.LineSegments(edges1, mat1);
    this.scene.add(cage1);
    this.cages.push(cage1);

    // Inner glowing cage
    const cageGeo2 = new THREE.IcosahedronGeometry(3.6, 0).toNonIndexed();
    const edges2 = new THREE.EdgesGeometry(cageGeo2);
    const mat2 = new THREE.LineBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.3 });
    const cage2 = new THREE.LineSegments(edges2, mat2);
    this.scene.add(cage2);
    this.cages.push(cage2);

    // Orbital data rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x334155, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 3; i++) {
      const ringGeo = new THREE.RingGeometry(5 + i * 0.5, 5.02 + i * 0.5, 64);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
      ring.rotation.y = (Math.random() - 0.5) * 0.5;
      this.scene.add(ring);
      this.cages.push(ring);
    }
  }

  private createParticles() {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for(let i=0; i<count; i++) {
      pos[i*3] = (Math.random() - 0.5) * 25;
      pos[i*3+1] = (Math.random() - 0.5) * 25;
      pos[i*3+2] = (Math.random() - 0.5) * 25;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ color: 0x22d3ee, size: 0.03, transparent: true, opacity: 0.4 });
    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  private animate(time = 0) {
    this.animationId = requestAnimationFrame(t => this.animate(t));
    const t = time * 0.001;

    // Update anomaly shader
    if (this.anomalyMat) {
      this.anomalyMat.uniforms['uTime'].value = t;
    }

    // Rotate cages
    this.cages.forEach((cage, i) => {
      const speed = i % 2 === 0 ? 1 : -1;
      cage.rotation.x += 0.001 * speed * (i + 1);
      cage.rotation.y += 0.002 * speed;
      cage.rotation.z += 0.0005 * speed;
    });

    // Slow particle drift
    if (this.particles) {
      this.particles.rotation.y = t * 0.05;
      this.particles.rotation.z = t * 0.02;
    }

    // Smooth camera orbit
    this.camera.position.x = Math.sin(t * 0.2) * 12;
    this.camera.position.z = Math.cos(t * 0.2) * 12;
    this.camera.position.y = Math.sin(t * 0.3) * 4;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);

    // UI Updates
    this.frameCount++;
    if (time - this.lastFpsTime >= 1000) {
      this.ngZone.run(() => {
        this.fps.set(this.frameCount);
        this.camPos.set({
          x: this.camera.position.x.toFixed(2),
          y: this.camera.position.y.toFixed(2),
          z: this.camera.position.z.toFixed(2)
        });
      });
      this.frameCount = 0;
      this.lastFpsTime = time;
    }
  }
}

