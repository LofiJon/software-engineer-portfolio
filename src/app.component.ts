import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser'; // <--- Importar Meta e Title
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
export class AppComponent implements OnInit {
  public lang = inject(TranslationService);
  private meta = inject(Meta);             
  private title = inject(Title);           

  ngOnInit(): void {
    this.setMetaTags();
  }

  private setMetaTags() {
    this.title.setTitle('Jonathan Malagueta | Fullstack Engineer');

    this.meta.addTags([
      { name: 'description', content: 'Senior Fullstack Engineer especializado em Sistemas Distribuídos, IoT, MDM e Angular. Transformando requisitos críticos em código sólido.' },
      { name: 'author', content: 'Jonathan Malagueta' },
      { name: 'keywords', content: 'Angular, NestJS, .NET, IoT, AOSP, MDM, Software Engineer, Fullstack, Manaus, Developer' },
      { name: 'robots', content: 'index, follow' },
      { name: 'theme-color', content: '#020617' } 
    ]);

    this.meta.addTags([
      { property: 'og:title', content: 'Jonathan Malagueta | Senior Fullstack Engineer' },
      { property: 'og:description', content: 'Especialista em IoT, AOSP e Arquitetura Distribuída. Conheça meus projetos de engenharia complexa.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://jonathanmalagueta.dev' },
      { property: 'og:image', content: 'https://jonathanmalagueta.dev/assets/images/og-social-card.jpg' },
      { property: 'og:locale', content: 'pt_BR' },
      { property: 'og:site_name', content: 'Jonathan Malagueta Portfolio' }
    ]);

    // 4. Twitter Card
    this.meta.addTags([
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Jonathan Malagueta | Senior Engineer' },
      { name: 'twitter:description', content: 'Engenharia de Software de Ponta a Ponta: Do 3D à Nuvem (IoT & MDM).' },
      { name: 'twitter:image', content: 'https://jonathanmalagueta.dev/assets/images/og-social-card.jpg' }
    ]);
  }
}