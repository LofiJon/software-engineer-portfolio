import { Component, inject, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { TranslationService } from './components/services/translation.service';
import { CaseCardComponent } from './components/case-card/case-card.component';
import { ThreeVizComponent } from './components/three-viz/three-viz.component';
import { ScrollRevealDirective } from './app/directives/scroll-reveal.directive';
import { ENV } from './env';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CaseCardComponent, ThreeVizComponent, ScrollRevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
})
export class AppComponent {
  public lang = inject(TranslationService);
  public readonly env = ENV;
  public readonly menuOpen = signal(false);
  private meta = inject(Meta);
  private title = inject(Title);

  // Static SEO/social tags live in index.html; only the language-dependent ones change here
  private syncMetaTags = effect(() => {
    const { title, description } = this.lang.t().meta;
    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
  });
}
