import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, ChangeDetectionStrategy, signal } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-viz',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full h-64 md:h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group cursor-crosshair">
      
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#050505] to-black pointer-events-none"></div>
      
      <div class="absolute inset-0 opacity-40" style="background-image: radial-gradient(white 1px, transparent 1px); background-size: 50px 50px;"></div>

      <canvas #canvas class="relative z-10 w-full h-full outline-none"></canvas>

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
  private ships: THREE.Group[] = [];
  private lasers: THREE.Line[] = [];
  
  private animationFrameId: number = 0;
  private lastTime = 0;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initThree();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.renderer?.dispose();
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.02);

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    this.camera.position.z = 4.5;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    this.scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2);
    sunLight.position.set(5, 3, 5);
    this.scene.add(sunLight);

    const rimLight = new THREE.SpotLight(0x4ade80, 5);
    rimLight.position.set(-5, 0, 2);
    this.scene.add(rimLight);

    this.createDeathStar();

    this.createFleet(8); 

    new ResizeObserver(() => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      this.renderer.setSize(w, h);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
    }).observe(canvas.parentElement!);

    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private createDeathStar() {
    this.deathStar = new THREE.Group();

    const geo = new THREE.IcosahedronGeometry(1.5, 2); 
    const mat = new THREE.MeshStandardMaterial({
      color: 0x334155, 
      flatShading: true,
      roughness: 0.4,
      metalness: 0.6
    });
    const sphere = new THREE.Mesh(geo, mat);
    this.deathStar.add(sphere);

    const trenchGeo = new THREE.TorusGeometry(1.48, 0.05, 16, 100);
    const trenchMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const trench = new THREE.Mesh(trenchGeo, trenchMat);
    trench.rotation.x = Math.PI / 2;
    this.deathStar.add(trench);

    const dishGeo = new THREE.CircleGeometry(0.4, 32);
    const dishMat = new THREE.MeshStandardMaterial({ 
      color: 0x1e293b, 
      roughness: 0.8 
    });
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.set(0.8, 0.8, 1.1); 
    dish.lookAt(2, 2, 4);
    this.deathStar.add(dish);

    const wireGeo = new THREE.IcosahedronGeometry(1.52, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x64748b,
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    this.deathStar.add(wire);

    this.scene.add(this.deathStar);
  }

  private createFleet(count: number) {
    for (let i = 0; i < count; i++) {
      const shipGroup = new THREE.Group();
      
      const geo = new THREE.ConeGeometry(0.08, 0.2, 3);
      const mat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0xfca5a5 : 0x86efac }); // Vermelho ou Verde
      const ship = new THREE.Mesh(geo, mat);
      
      ship.rotation.x = Math.PI / 2;
      shipGroup.add(ship);

      const userData: any = {
        speed: 0.01 + Math.random() * 0.02,
        radius: 2.2 + Math.random() * 1.5,
        angle: Math.random() * Math.PI * 2,
        yOffset: (Math.random() - 0.5) * 2,
        axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize()
      };
      shipGroup.userData = userData;

      this.ships.push(shipGroup);
      this.scene.add(shipGroup);
    }
  }

  private shootLaser(source: THREE.Vector3, target: THREE.Vector3, color: number) {
    const points = [source, target];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: color, 
      linewidth: 2,
      opacity: 0.8,
      transparent: true 
    });
    
    const laser = new THREE.Line(geometry, material);
    this.scene.add(laser);

    setTimeout(() => {
      this.scene.remove(laser);
      geometry.dispose();
    }, 100);
  }

  private animate(time?: number) {
    this.animationFrameId = requestAnimationFrame((t) => this.animate(t));

    if (this.deathStar) {
      this.deathStar.rotation.y += 0.001;
      this.deathStar.rotation.z += 0.0005;
    }

    this.ships.forEach((ship) => {
      const data = ship.userData;
      
      data.angle += data.speed;
      
      const x = Math.cos(data.angle) * data.radius;
      const z = Math.sin(data.angle) * data.radius;
      
      ship.position.set(x, data.yOffset + Math.sin(time! * 0.001) * 0.5, z);
      
      ship.lookAt(0, 0, 0);

      if (Math.random() > 0.98) { 
        const isRebel = Math.random() > 0.5;
        const laserColor = isRebel ? 0xff0000 : 0x00ff00; 
        
        const impactPoint = new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1.5
        );
        
        this.shootLaser(ship.position, impactPoint, laserColor);
      }
    });

    this.renderer.render(this.scene, this.camera);

    if (time) {
      const delta = time - this.lastTime;
      if (delta >= 1000) {
        this.lastTime = time;
        this.ngZone.run(() => this.fps.set(Math.round(1000 / (delta / 60))));
      }
    }
  }
}