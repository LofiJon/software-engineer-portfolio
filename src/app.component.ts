import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { TranslationService } from './components/services/translation.service';
import { CaseCardComponent } from './components/case-card/case-card.component';
import { ThreeVizComponent } from './components/three-viz/three-viz.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CaseCardComponent, ThreeVizComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html'
})
export class AppComponent {
  // Injecting the service
  public lang = inject(TranslationService);
}