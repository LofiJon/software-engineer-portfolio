import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CaseStudy } from '../../data/i18n.data';

@Component({
  selector: 'app-case-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group relative h-full bg-[#0f1020] border border-slate-800 clip-chamfer hover:border-cyan-500/60 transition-all duration-300 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.25)] hover:-translate-y-1 flex flex-col overflow-hidden min-h-[320px]">
      <!-- Subtle grid overlay -->
      <div class="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.25),transparent_55%)]"></div>
      <div class="absolute inset-0 opacity-[0.08] pointer-events-none grid-bg mix-blend-soft-light"></div>

      <!-- Top accent bar -->
      <div class="absolute top-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"></div>

      <!-- Content -->
      <div class="relative z-10 flex-1 flex flex-col p-6">
        <div class="flex items-center justify-between mb-5">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-mono tracking-[0.4em] uppercase text-cyan-400/80">DOMAIN::{{ domainIndex() }}</span>
            <div class="h-px w-6 bg-cyan-400/40"></div>
            <span class="text-[10px] font-mono tracking-[0.3em] uppercase text-slate-500">{{ item().category }}</span>
          </div>
          <div class="relative flex items-center gap-1.5">
            <span class="w-1 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
            <span class="w-1 h-1 rounded-full bg-cyan-400/60"></span>
            <span class="w-1 h-1 rounded-full bg-cyan-400/30"></span>
          </div>
        </div>

        <h3 class="text-xl font-heading font-semibold text-white mb-3 tracking-tight group-hover:text-cyan-300 transition-colors">
          {{ item().title }}
        </h3>

        <p class="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
          {{ item().description }}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-800/70">
          @for (tech of item().tech; track tech) {
            <span class="text-[11px] font-mono uppercase tracking-[0.18em] text-slate-400 bg-slate-900/80 px-2.5 py-1 border border-slate-700/80 clip-chamfer-sm group-hover:border-cyan-400/40 group-hover:text-cyan-300 transition-colors">
              {{ tech }}
            </span>
          }
        </div>
      </div>

      <!-- Corner accents -->
      <div class="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div class="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div class="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div class="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-cyan-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  `
})
export class CaseCardComponent {
  item = input.required<CaseStudy>();
  domainIndex = input<string>('01');
}