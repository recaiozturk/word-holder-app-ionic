import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-flashcard',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      type="button"
      class="flashcard"
      [ngClass]="{
        'flashcard--flipped': flipped,
        'flashcard--large': size === 'large',
        'flashcard--busy': animating
      }"
      (click)="toggle()"
      [attr.aria-pressed]="flipped"
    >
      <div class="flashcard__inner">
        <div class="flashcard__face flashcard__face--front">
          <span class="flashcard__hint">{{ sourceLabel }}</span>
          <strong>{{ front }}</strong>
        </div>
        <div class="flashcard__face flashcard__face--back">
          <span class="flashcard__hint">{{ targetLabel }}</span>
          <strong>{{ back }}</strong>
        </div>
      </div>
    </button>
  `,
  styles: `
    .flashcard {
      width: 100%;
      aspect-ratio: 1 / 1.05;
      border: 0;
      padding: 0;
      background: transparent;
      perspective: 1200px;
      cursor: pointer;
    }
    .flashcard--large {
      aspect-ratio: 0.72 / 1;
      max-width: 360px;
      margin: 0 auto;
    }
    .flashcard__inner {
      position: relative;
      width: 100%;
      height: 100%;
      transform-style: preserve-3d;
      transition: transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }
    .flashcard--flipped .flashcard__inner {
      transform: rotateY(180deg);
    }
    .flashcard__face {
      position: absolute;
      inset: 0;
      display: grid;
      align-content: center;
      justify-items: center;
      gap: 10px;
      padding: 18px;
      border-radius: 18px;
      border: 1px solid var(--wh-line);
      box-shadow: var(--wh-shadow);
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      overflow: hidden;
      word-break: break-word;
      text-align: center;
    }
    .flashcard__face strong {
      font-family: var(--wh-font-display);
      font-size: clamp(1rem, 3.8vw, 1.45rem);
      line-height: 1.3;
      color: var(--wh-ink);
    }
    .flashcard__face--front {
      background: linear-gradient(160deg, #ffffff, #eef7f5);
    }
    .flashcard__face--back {
      background: linear-gradient(160deg, #0f8f86, #0b6f68);
      transform: rotateY(180deg);
    }
    .flashcard__face--back strong,
    .flashcard__face--back .flashcard__hint {
      color: #fff;
    }
    .flashcard__hint {
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--wh-muted);
    }
    @media (prefers-reduced-motion: reduce) {
      .flashcard__inner {
        transition: none;
      }
    }
  `,
})
export class FlashcardComponent {
  @Input() front = '';
  @Input() back = '';
  @Input() sourceLabel = 'Source';
  @Input() targetLabel = 'Target';
  @Input() size: 'grid' | 'large' = 'grid';
  @Input() flipped = false;
  @Output() flippedChange = new EventEmitter<boolean>();

  animating = false;
  private flipLockUntil = 0;

  @HostListener('animationend')
  onAnimationEnd(): void {
    this.animating = false;
  }

  toggle(): void {
    const now = Date.now();
    if (now < this.flipLockUntil) {
      return;
    }
    this.flipLockUntil = now + 520;
    this.animating = true;
    this.flipped = !this.flipped;
    this.flippedChange.emit(this.flipped);
  }
}
