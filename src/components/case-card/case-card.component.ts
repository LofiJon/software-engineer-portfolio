import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CaseStudy } from '../../data/i18n.data';

@Component({
  selector: 'app-case-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="group relative h-full bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col">
      <!-- Glow Effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <!-- Content -->
      <div class="relative z-10 flex-1 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xs font-bold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
            {{ item().category }}
          </span>
          <div class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
        </div>

        <h3 class="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">
          {{ item().title }}
        </h3>

        <p class="text-slate-400 text-sm leading-relaxed mb-6 flex-1">
          {{ item().description }}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mt-auto">
          @for (tech of item().tech; track tech) {
            <span class="text-xs font-medium text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">
              #{{ tech }}
            </span>
          }
        </div>
      </div>
    </div>
  `
})
export class CaseCardComponent {
  // New Signal Input API
  item = input.required<CaseStudy>();
}