import { Component, ChangeDetectionStrategy, signal, inject, DestroyRef } from '@angular/core';

@Component({
  selector: 'app-three-viz',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative w-full h-64 md:h-full bg-black rounded-xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center group">
      <!-- Simulated 3D Environment -->
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-black"></div>
      
      <!-- Grid Effect -->
      <div class="absolute inset-0" 
           style="background-image: linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px); background-size: 40px 40px; transform: perspective(500px) rotateX(60deg) translateY(100px) scale(2);">
      </div>

      <!-- Rotating Cube Simulation (Pure CSS to simulate WebGL visual) -->
      <div class="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 animate-[spin_4s_linear_infinite] shadow-[0_0_50px_rgba(99,102,241,0.5)] transform rotate-45 border border-white/20"></div>

      <div class="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded text-xs text-indigo-300 font-mono border border-indigo-500/30">
        ● Three.js Module Loaded
      </div>
      
      <div class="absolute top-4 right-4 text-[10px] text-slate-500 font-mono">
        FPS: {{ fps() }}
      </div>
    </div>
  `
})
export class ThreeVizComponent {
  fps = signal(60);
  private destroyRef = inject(DestroyRef);
  
  constructor() {
    const interval = setInterval(() => {
      // Simulate slight FPS variance
      this.fps.set(Math.floor(Math.random() * (60 - 58 + 1) + 58));
    }, 1000);

    this.destroyRef.onDestroy(() => clearInterval(interval));
  }
}