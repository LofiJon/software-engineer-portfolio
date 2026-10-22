import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, OnDestroy {
  @Input() revealDelay: number = 0;
  @Input() revealOnce: boolean = true;
  @Input() revealThreshold: number = 0.12;

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;

    this.renderer.addClass(element, 'reveal');

    if (this.revealDelay > 0) {
      this.renderer.setStyle(element, 'transition-delay', `${this.revealDelay}ms`);
    }

    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(element, 'in-view');

          if (this.revealOnce) {
            this.observer.unobserve(element);
          }
        } else if (!this.revealOnce) {
          this.renderer.removeClass(element, 'in-view');
        }
      },
      {
        threshold: this.revealThreshold,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    this.observer.observe(element);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
