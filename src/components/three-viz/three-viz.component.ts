import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, ChangeDetectionStrategy, signal } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-viz',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full h-64 md:h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center group">
      
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-black pointer-events-none"></div>
      
      <div class="absolute inset-0 opacity-20" 
           style="background-image: linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px); background-size: 30px 30px; transform: perspective(500px) rotateX(60deg) scale(1.5);">
      </div>

      <canvas #canvas class="relative z-10 w-full h-full outline-none"></canvas>

      <div class="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs text-indigo-300 font-mono border border-indigo-500/30 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        WebGL Active
      </div>
      
      <div class="absolute top-4 right-4 text-[10px] text-slate-500 font-mono bg-black/40 px-2 py-1 rounded">
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
  private mesh!: THREE.Group;
  private animationFrameId: number = 0;
  private lastTime = 0;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.initThree();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.renderer.dispose();
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.camera.position.z = 3;

    this.renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.mesh = new THREE.Group();

    const geometry = new THREE.IcosahedronGeometry(1.2, 0);
    
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x6366f1, 
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    const fillMaterial = new THREE.MeshBasicMaterial({
      color: 0x4338ca, // Indigo-700
      transparent: true,
      opacity: 0.1
    });

    const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
    const fillMesh = new THREE.Mesh(geometry, fillMaterial);

    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 50;
    const posArray = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 5; 
    }
    
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xa5b4fc, 
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);

    this.mesh.add(wireframeMesh);
    this.mesh.add(fillMesh);
    this.mesh.add(particlesMesh);

    this.scene.add(this.mesh);

    const resizeObserver = new ResizeObserver(() => {
      const newWidth = canvas.clientWidth;
      const newHeight = canvas.clientHeight;
      this.renderer.setSize(newWidth, newHeight);
      this.camera.aspect = newWidth / newHeight;
      this.camera.updateProjectionMatrix();
    });
    resizeObserver.observe(canvas.parentElement!);

    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private animate(time?: number) {
    this.animationFrameId = requestAnimationFrame((t) => this.animate(t));

    if (this.mesh) {
      this.mesh.rotation.x += 0.002;
      this.mesh.rotation.y += 0.005;
      
      const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
      this.mesh.scale.set(scale, scale, scale);
    }

    this.renderer.render(this.scene, this.camera);

    if (time) {
      const delta = time - this.lastTime;
      if (delta >= 1000) {
        this.lastTime = time;
        this.ngZone.run(() => {
           this.fps.set(Math.round(1000 / (delta / 60)));
        });
      }
    }
  }
}