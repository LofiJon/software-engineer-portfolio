import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy, NgZone, ChangeDetectionStrategy } from '@angular/core';

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  depth: number; // 0..1, drives drift speed and scroll parallax
  tint: string;
}

interface Streak {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
  width: number;
  color: string; // "r,g,b"
  comet: boolean;
}

/**
 * Ambient galaxy backdrop: faint nebula, slowly drifting stars and the occasional
 * shooting star or comet. Purely decorative — fixed behind content, low contrast,
 * capped at ~30fps, static under prefers-reduced-motion.
 */
@Component({
  selector: 'app-galaxy-bg',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #canvas aria-hidden="true" class="fixed inset-0 z-0 w-full h-full pointer-events-none"></canvas>`
})
export class GalaxyBgComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private nebula?: HTMLCanvasElement;
  private stars: Star[] = [];
  private streaks: Streak[] = [];

  private width = 0;
  private height = 0;
  private dpr = 1;
  private animationId = 0;
  private lastFrame = 0;
  private nextStreakAt = 0;
  private reducedMotion = false;

  private static readonly FRAME_MS = 1000 / 30;

  constructor(private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) return;
    this.ctx = ctx;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.resize();
    window.addEventListener('resize', this.onResize, { passive: true });

    if (this.reducedMotion) {
      this.draw(0, 0);
      window.addEventListener('scroll', this.onStaticScroll, { passive: true });
      return;
    }

    this.nextStreakAt = performance.now() + this.randomBetween(3000, 6000);
    this.ngZone.runOutsideAngular(() => (this.animationId = requestAnimationFrame(this.loop)));
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('scroll', this.onStaticScroll);
  }

  private onResize = (): void => {
    this.resize();
    if (this.reducedMotion) this.draw(0, 0);
  };

  private onStaticScroll = (): void => this.draw(0, 0);

  private resize(): void {
    const canvas = this.canvasRef.nativeElement;
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = Math.round(this.width * this.dpr);
    canvas.height = Math.round(this.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    this.createStars();
    this.createNebula();
  }

  private createStars(): void {
    const count = Math.min(320, Math.round((this.width * this.height) / 5500));
    const tints = ['255,255,255', '255,255,255', '186,230,253', '165,243,252', '221,214,254'];
    this.stars = Array.from({ length: count }, () => {
      const depth = Math.random();
      return {
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: 0.3 + depth * 0.9,
        alpha: 0.12 + depth * 0.45,
        twinkleSpeed: this.randomBetween(0.4, 1.4),
        twinklePhase: Math.random() * Math.PI * 2,
        depth,
        tint: tints[Math.floor(Math.random() * tints.length)]
      };
    });
  }

  /** Pre-renders the nebula once per resize so each frame is a single drawImage. */
  private createNebula(): void {
    const pad = 80; // room for the slow drift
    const w = this.width + pad * 2;
    const h = this.height + pad * 2;
    const off = document.createElement('canvas');
    off.width = Math.round(w * this.dpr);
    off.height = Math.round(h * this.dpr);
    const ctx = off.getContext('2d')!;
    ctx.scale(this.dpr, this.dpr);

    const clouds: [number, number, number, string, number][] = [
      // x, y, radius (relative), rgb, alpha
      [0.18, 0.22, 0.55, '34,211,238', 0.08],
      [0.82, 0.35, 0.5, '167,139,250', 0.075],
      [0.55, 0.78, 0.6, '56,189,248', 0.065],
      [0.3, 0.6, 0.35, '139,92,246', 0.05]
    ];
    const base = Math.max(w, h);
    for (const [cx, cy, rr, rgb, a] of clouds) {
      const g = ctx.createRadialGradient(cx * w, cy * h, 0, cx * w, cy * h, rr * base);
      g.addColorStop(0, `rgba(${rgb},${a})`);
      g.addColorStop(0.5, `rgba(${rgb},${a * 0.4})`);
      g.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    // Faint diagonal "milky way" band of dust
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.42);
    const band = ctx.createLinearGradient(0, -h * 0.18, 0, h * 0.18);
    band.addColorStop(0, 'rgba(148,163,184,0)');
    band.addColorStop(0.5, 'rgba(148,163,184,0.05)');
    band.addColorStop(1, 'rgba(148,163,184,0)');
    ctx.fillStyle = band;
    ctx.fillRect(-base, -h * 0.18, base * 2, h * 0.36);
    const dust = Math.round((w * h) / 2600);
    for (let i = 0; i < dust; i++) {
      const x = (Math.random() - 0.5) * base * 2;
      const y = this.gaussian() * h * 0.07;
      ctx.fillStyle = `rgba(226,232,240,${this.randomBetween(0.04, 0.16)})`;
      ctx.fillRect(x, y, 0.8, 0.8);
    }
    ctx.restore();

    this.nebula = off;
  }

  private loop = (now: number): void => {
    this.animationId = requestAnimationFrame(this.loop);
    if (now - this.lastFrame < GalaxyBgComponent.FRAME_MS) return;
    const dt = Math.min((now - this.lastFrame) / 1000, 0.1);
    this.lastFrame = now;

    if (now >= this.nextStreakAt) {
      this.spawnStreak();
      this.nextStreakAt = now + this.randomBetween(5000, 12000);
    }

    this.draw(now / 1000, dt);
  };

  private draw(t: number, dt: number): void {
    const { ctx, width, height } = this;
    const scrollY = window.scrollY;
    ctx.clearRect(0, 0, width, height);

    // Nebula: slow elliptical drift + gentle scroll parallax
    if (this.nebula) {
      const dx = Math.sin(t * 0.02) * 40 - 80;
      const dy = Math.cos(t * 0.015) * 30 - 80 - ((scrollY * 0.02) % 40);
      ctx.drawImage(this.nebula, dx, dy, width + 160, height + 160);
    }

    // Stars: drift left, parallax on scroll, twinkle
    for (const s of this.stars) {
      s.x -= (2 + s.depth * 6) * dt;
      if (s.x < -2) s.x = width + 2;
      const y = this.wrap(s.y - scrollY * (0.03 + s.depth * 0.08), height);
      const twinkle = 0.7 + 0.3 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
      ctx.fillStyle = `rgba(${s.tint},${s.alpha * twinkle})`;
      ctx.beginPath();
      ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shooting stars & comets
    for (let i = this.streaks.length - 1; i >= 0; i--) {
      const st = this.streaks[i];
      st.life += dt;
      st.x += st.vx * dt;
      st.y += st.vy * dt;
      if (st.life >= st.maxLife) {
        this.streaks.splice(i, 1);
        continue;
      }
      this.drawStreak(st);
    }
  }

  private drawStreak(st: Streak): void {
    const { ctx } = this;
    const p = st.life / st.maxLife;
    const fade = Math.sin(p * Math.PI); // ease in and out
    const speed = Math.hypot(st.vx, st.vy);
    const tx = st.x - (st.vx / speed) * st.length;
    const ty = st.y - (st.vy / speed) * st.length;

    const peak = st.comet ? 0.45 : 0.55;
    const grad = ctx.createLinearGradient(st.x, st.y, tx, ty);
    grad.addColorStop(0, `rgba(${st.color},${peak * fade})`);
    grad.addColorStop(1, `rgba(${st.color},0)`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = st.width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(st.x, st.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    if (st.comet) {
      const glow = ctx.createRadialGradient(st.x, st.y, 0, st.x, st.y, 10);
      glow.addColorStop(0, `rgba(${st.color},${0.5 * fade})`);
      glow.addColorStop(1, `rgba(${st.color},0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(st.x, st.y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private spawnStreak(): void {
    const comet = Math.random() < 0.25;
    const fromLeft = Math.random() < 0.5;
    const angle = this.randomBetween(0.25, 0.6); // radians below horizontal
    const speed = comet ? this.randomBetween(70, 120) : this.randomBetween(550, 850);
    const dir = fromLeft ? 1 : -1;

    this.streaks.push({
      x: fromLeft ? this.randomBetween(-50, this.width * 0.5) : this.randomBetween(this.width * 0.5, this.width + 50),
      y: this.randomBetween(-20, this.height * 0.45),
      vx: Math.cos(angle) * speed * dir,
      vy: Math.sin(angle) * speed,
      length: comet ? this.randomBetween(120, 200) : this.randomBetween(80, 150),
      life: 0,
      maxLife: comet ? this.randomBetween(5, 7) : this.randomBetween(0.7, 1.1),
      width: comet ? 1.6 : 1,
      color: comet ? '103,232,249' : '226,232,240',
      comet
    });
  }

  private wrap(v: number, max: number): number {
    return ((v % max) + max) % max;
  }

  private randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  /** Box–Muller; concentrates dust in the middle of the band. */
  private gaussian(): number {
    const u = 1 - Math.random();
    const v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
}
