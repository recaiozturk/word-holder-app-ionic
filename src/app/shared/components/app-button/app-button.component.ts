import { Component, Input, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [attr.type]="type"
      class="wh-btn"
      [ngClass]="['wh-btn--' + variant, fullWidth ? 'wh-btn--block' : '']"
      [disabled]="disabled || loading"
      (click)="onClick()"
    >
      @if (loading) {
        <span class="wh-btn__spinner" aria-hidden="true"></span>
      }
      <ng-content />
    </button>
  `,
  styles: `
    .wh-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-height: 48px;
      padding: 0 18px;
      border: 0;
      border-radius: 14px;
      font-family: var(--wh-font-body);
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
      transition: transform 160ms ease, opacity 160ms ease, background 160ms ease;
    }
    .wh-btn:active:not(:disabled) {
      transform: scale(0.98);
    }
    .wh-btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
    .wh-btn--block {
      width: 100%;
    }
    .wh-btn--primary {
      background: linear-gradient(135deg, var(--wh-teal), var(--wh-teal-deep));
      color: #fff;
    }
    .wh-btn--secondary {
      background: var(--wh-teal-soft);
      color: var(--wh-teal-deep);
    }
    .wh-btn--danger {
      background: var(--wh-danger);
      color: #fff;
    }
    .wh-btn--ghost {
      background: transparent;
      color: var(--wh-ink-soft);
      border: 1px solid var(--wh-line);
    }
    .wh-btn__spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class AppButtonComponent {
  private readonly router = inject(Router);

  @Input() variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() loading = false;
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() link: string | any[] | null = null;

  onClick(): void {
    if (!this.link || this.disabled || this.loading) {
      return;
    }
    void this.router.navigate(Array.isArray(this.link) ? this.link : [this.link]);
  }
}
