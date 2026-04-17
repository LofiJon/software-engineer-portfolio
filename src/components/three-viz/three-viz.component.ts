import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, ChangeDetectionStrategy, signal } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-viz',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full h-64 md:h-full bg-black rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center cursor-crosshair">
      <canvas #canvas class="w-full h-full outline-none"></canvas>
      <div class="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-xs text-red-400 font-mono border border-red-500/30 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
        DEFENSE SYSTEM: ACTIVE
      </div>
      <div class="absolute top-4 right-4 text-[10px] text-slate-500 font-mono">
        {{ fps() }} FPS
      </div>
    </div>
  `
})
export class ThreeVizComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  fps = signal(0);

  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  private deathStar!: THREE.Group;
  private ships: { mesh: THREE.Group; data: any }[] = [];

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

    this.camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 500);
    this.camera.position.set(0, 0.8, 5.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting: strong directional sun + dim fill
    const sun = new THREE.DirectionalLight(0xffffff, 3.5);
    sun.position.set(8, 4, 6);
    this.scene.add(sun);

    const fill = new THREE.DirectionalLight(0x223344, 0.6);
    fill.position.set(-6, -3, -4);
    this.scene.add(fill);

    const ambient = new THREE.AmbientLight(0x090d14, 1);
    this.scene.add(ambient);

    this.createStarField();
    this.createDeathStar();
    this.createFleet(5, 3);

    new ResizeObserver(() => {
      const nw = canvas.clientWidth;
      const nh = canvas.clientHeight;
      this.renderer.setSize(nw, nh);
      this.camera.aspect = nw / nh;
      this.camera.updateProjectionMatrix();
    }).observe(canvas.parentElement!);

    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private createStarField() {
    const count = 2000;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 100 + Math.random() * 150;
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.18, sizeAttenuation: true })));
  }

  private createDeathStar() {
    this.deathStar = new THREE.Group();

    // Surface with procedural panel lines via shader
    const sphereGeo = new THREE.SphereGeometry(1.5, 96, 96);
    const panelMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;

        float panelLine(vec2 uv, float scale, float w) {
          vec2 g = fract(uv * scale);
          vec2 fw = fwidth(uv * scale);
          vec2 d = smoothstep(fw * w, fw * (w + 1.0), min(g, 1.0 - g));
          return 1.0 - min(d.x, d.y);
        }

        void main() {
          // Two panel scales for detail variation
          float lines = panelLine(vUv, 20.0, 0.6) * 0.5
                      + panelLine(vUv, 6.0,  0.5) * 0.35;

          // Dark crease color
          vec3 base = vec3(0.30, 0.33, 0.38);
          vec3 dark = vec3(0.10, 0.11, 0.14);
          vec3 col = mix(base, dark, lines);

          // Diffuse lighting
          vec3 lightDir = normalize(vec3(8.0, 4.0, 6.0));
          float diff = clamp(dot(vNormal, lightDir), 0.0, 1.0);
          float lighting = 0.12 + diff * 0.88;
          col *= lighting;

          // Subtle specular
          vec3 viewDir = vec3(0.0, 0.0, 1.0);
          vec3 halfV = normalize(lightDir + viewDir);
          float spec = pow(clamp(dot(vNormal, halfV), 0.0, 1.0), 40.0) * 0.15;
          col += spec;

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      extensions: { derivatives: true } as any,
    });
    this.deathStar.add(new THREE.Mesh(sphereGeo, panelMat));

    // Equatorial trench
    const trenchMat = new THREE.MeshStandardMaterial({ color: 0x050810, roughness: 1, metalness: 0 });
    const trench = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.065, 10, 200), trenchMat);
    trench.rotation.x = Math.PI / 2;
    this.deathStar.add(trench);

    // Inner trench groove
    const innerTrench = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.028, 8, 200), trenchMat);
    innerTrench.rotation.x = Math.PI / 2;
    innerTrench.scale.setScalar(0.955);
    this.deathStar.add(innerTrench);

    this.addSuperlaser();
    this.scene.add(this.deathStar);
  }

  private addSuperlaser() {
    // Position on northern hemisphere, slightly left — canonical Death Star look
    const dishDir = new THREE.Vector3(-0.55, 0.72, 1.0).normalize();
    const dishPos = dishDir.clone().multiplyScalar(1.5);

    // Outer rim ring
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.5, metalness: 0.75 });
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.045, 20, 80), rimMat);
    rim.position.copy(dishPos);
    rim.lookAt(0, 0, 0);
    this.deathStar.add(rim);

    // Concave bowl (BackSide cap of a partial sphere)
    const bowlGeo = new THREE.SphereGeometry(0.42, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.45);
    const bowlMat = new THREE.MeshStandardMaterial({
      color: 0x0d1117, roughness: 0.95, metalness: 0.05, side: THREE.BackSide
    });
    const bowl = new THREE.Mesh(bowlGeo, bowlMat);
    bowl.position.copy(dishPos);
    bowl.lookAt(0, 0, 0);
    this.deathStar.add(bowl);

    // Concentric rings inside the dish
    const ringRadii = [0.32, 0.21, 0.11];
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 0.6, metalness: 0.8 });
    for (const r of ringRadii) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.013, 10, 60), ringMat);
      ring.position.copy(dishPos);
      ring.lookAt(0, 0, 0);
      this.deathStar.add(ring);
    }

    // 8 spokes radiating from center
    const spokeMat = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.7 });
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const spokeGeo = new THREE.BoxGeometry(0.008, 0.38, 0.008);
      const spoke = new THREE.Mesh(spokeGeo, spokeMat);
      spoke.position.copy(dishPos);
      spoke.lookAt(0, 0, 0);
      // Rotate around the dish's local Z after aligning
      const offset = dishDir.clone().multiplyScalar(0.02);
      spoke.position.add(offset);
      spoke.rotateOnWorldAxis(dishDir, angle);
      this.deathStar.add(spoke);
    }

    // Central emitter core
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x00ff88 });
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), coreMat);
    core.position.copy(dishPos);
    this.deathStar.add(core);

    // Glow point light at dish
    const dishLight = new THREE.PointLight(0x00ff88, 2, 1.8);
    dishLight.position.copy(dishPos);
    this.deathStar.add(dishLight);
  }

  // --- Ships ---

  private createFleet(tieCount: number, xwingCount: number) {
    for (let i = 0; i < tieCount; i++) {
      const mesh = this.makeTIEFighter();
      const data = {
        speed: 0.007 + Math.random() * 0.010,
        radius: 2.3 + Math.random() * 1.1,
        angle: Math.random() * Math.PI * 2,
        orbitAxis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        laserColor: 0x00ee44,
        laserEvery: 30 + Math.floor(Math.random() * 50),
        frame: Math.floor(Math.random() * 120),
      };
      mesh.userData = data;
      this.ships.push({ mesh, data });
      this.scene.add(mesh);
    }

    for (let i = 0; i < xwingCount; i++) {
      const mesh = this.makeXWing();
      const data = {
        speed: 0.011 + Math.random() * 0.014,
        radius: 2.6 + Math.random() * 1.3,
        angle: Math.random() * Math.PI * 2,
        orbitAxis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        laserColor: 0xff2200,
        laserEvery: 20 + Math.floor(Math.random() * 40),
        frame: Math.floor(Math.random() * 120),
      };
      mesh.userData = data;
      this.ships.push({ mesh, data });
      this.scene.add(mesh);
    }
  }

  private makeTIEFighter(): THREE.Group {
    const g = new THREE.Group();
    const s = 0.11;

    // Central ball cockpit
    const ball = new THREE.Mesh(
      new THREE.SphereGeometry(0.5 * s, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.5, metalness: 0.6 })
    );
    g.add(ball);

    // Y-struts connecting pod to panels
    const strutMat = new THREE.MeshStandardMaterial({ color: 0x4b5563, roughness: 0.6 });
    for (const side of [-1, 1]) {
      for (const vAngle of [-0.4, 0.4]) {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.02 * s, 0.02 * s, 0.75 * s, 5), strutMat);
        strut.rotation.z = Math.PI / 2 + vAngle * side;
        strut.position.set(side * 0.45 * s, vAngle * 0.2 * s, 0);
        g.add(strut);
      }
    }

    // Hexagonal solar panels (BoxGeometry approximation)
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a2332, roughness: 0.9 });
    const gridMat = new THREE.MeshBasicMaterial({ color: 0x2d4060, wireframe: true });
    for (const side of [-1, 1]) {
      const panel = new THREE.Mesh(new THREE.BoxGeometry(0.04 * s, 1.3 * s, 1.0 * s), panelMat);
      panel.position.x = side * 0.88 * s;
      g.add(panel);

      const grid = new THREE.Mesh(new THREE.BoxGeometry(0.041 * s, 1.31 * s, 1.01 * s), gridMat);
      grid.position.x = side * 0.88 * s;
      g.add(grid);
    }

    // Ion engine glow at back
    const engineLight = new THREE.PointLight(0x4488ff, 1.2, 0.3 * s);
    engineLight.position.set(0, 0, -0.55 * s);
    g.add(engineLight);

    return g;
  }

  private makeXWing(): THREE.Group {
    const g = new THREE.Group();
    const s = 0.10;

    const metalMat  = new THREE.MeshStandardMaterial({ color: 0xb0b8c8, roughness: 0.75 });
    const darkMat   = new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.8 });
    const glassMat  = new THREE.MeshStandardMaterial({ color: 0x1e40af, roughness: 0.2, metalness: 0.1 });
    const engineMat = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.6 });

    // Fuselage
    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.09 * s, 0.13 * s, 1.6 * s, 8), metalMat);
    fuselage.rotation.z = Math.PI / 2;
    g.add(fuselage);

    // Nose cone
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.09 * s, 0.4 * s, 8), metalMat);
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 1.0 * s;
    g.add(nose);

    // Cockpit dome
    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.10 * s, 10, 10, 0, Math.PI), glassMat);
    cockpit.rotation.z = -Math.PI / 2;
    cockpit.position.x = 0.25 * s;
    cockpit.position.y = 0.10 * s;
    g.add(cockpit);

    // 4 wings in X pattern
    const wingAngles = [40, -40, 140, -140];
    for (const deg of wingAngles) {
      const rad = (deg * Math.PI) / 180;
      const sign = deg > 0 ? 1 : -1;

      // Wing
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.85 * s, 0.035 * s, 0.22 * s), metalMat);
      wing.position.set(-0.15 * s, Math.sin(rad) * 0.28 * s, Math.cos(rad) * 0.28 * s);
      wing.rotation.x = rad;
      g.add(wing);

      // Red stripe on wing
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.86 * s, 0.036 * s, 0.04 * s),
        new THREE.MeshStandardMaterial({ color: 0xcc2200, roughness: 0.8 }));
      stripe.position.copy(wing.position);
      stripe.rotation.x = rad;
      stripe.position.y += Math.sin(rad) * 0.001;
      g.add(stripe);

      // Engine nacelle at wingtip
      const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.055 * s, 0.055 * s, 0.32 * s, 8), engineMat);
      nacelle.rotation.z = Math.PI / 2;
      nacelle.position.set(-0.6 * s, Math.sin(rad) * 0.28 * s, Math.cos(rad) * 0.28 * s);
      g.add(nacelle);

      // Engine glow
      const glow = new THREE.PointLight(0xff6600, 0.8, 0.25 * s);
      glow.position.set(-0.76 * s, Math.sin(rad) * 0.28 * s, Math.cos(rad) * 0.28 * s);
      g.add(glow);
    }

    // 4 laser cannons at wing tips (thin rods)
    for (const deg of wingAngles) {
      const rad = (deg * Math.PI) / 180;
      const cannon = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012 * s, 0.012 * s, 0.5 * s, 4),
        darkMat
      );
      cannon.rotation.z = Math.PI / 2;
      cannon.position.set(0.65 * s, Math.sin(rad) * 0.28 * s, Math.cos(rad) * 0.28 * s);
      g.add(cannon);
    }

    return g;
  }

  private shootLaser(from: THREE.Vector3, to: THREE.Vector3, color: number) {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
    const line = new THREE.Line(geo, mat);
    this.scene.add(line);
    setTimeout(() => {
      this.scene.remove(line);
      geo.dispose();
      mat.dispose();
    }, 75);
  }

  private animate(time = 0) {
    this.animationId = requestAnimationFrame(t => this.animate(t));
    const t = time * 0.001;

    // Slow Death Star rotation
    if (this.deathStar) this.deathStar.rotation.y += 0.0008;

    // Ship orbits
    for (const { mesh, data } of this.ships) {
      data.angle += data.speed;

      // Elliptical orbit projected onto a tilted plane
      const local = new THREE.Vector3(
        Math.cos(data.angle) * data.radius,
        Math.sin(data.angle * 0.6) * data.radius * 0.25,
        Math.sin(data.angle) * data.radius
      );
      local.applyAxisAngle(data.orbitAxis, 1.0); // tilt the orbital plane
      mesh.position.copy(local);

      // Orient ship nose along velocity direction
      const vel = new THREE.Vector3(
        -Math.sin(data.angle),
        Math.cos(data.angle * 0.6) * 0.25 * 0.6,
        Math.cos(data.angle)
      ).normalize();
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), vel);

      // Fire lasers
      data.frame++;
      if (data.frame % data.laserEvery === 0) {
        const impact = new THREE.Vector3(
          (Math.random() - 0.5) * 2.2,
          (Math.random() - 0.5) * 2.2,
          (Math.random() - 0.5) * 2.2
        );
        this.shootLaser(mesh.position.clone(), impact, data.laserColor);
      }
    }

    this.renderer.render(this.scene, this.camera);

    // FPS
    this.frameCount++;
    if (time - this.lastFpsTime >= 1000) {
      this.ngZone.run(() => this.fps.set(this.frameCount));
      this.frameCount = 0;
      this.lastFpsTime = time;
    }
  }
}
