import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="wh-spinner" [attr.aria-label]="label" role="status">
      <span class="wh-spinner__ring"></span>
      @if (label) {
        <p>{{ label }}</p>
      }
    </div>
  `,
  styles: `
    .wh-spinner {
      display: grid;
      justify-items: center;
      gap: 12px;
      padding: 28px 12px;
      color: var(--wh-muted);
    }
    .wh-spinner__ring {
      width: 34px;
      height: 34px;
      border: 3px solid var(--wh-mist);
      border-top-color: var(--wh-teal);
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class LoadingSpinnerComponent {
  @Input() label = 'Yükleniyor...';
}
