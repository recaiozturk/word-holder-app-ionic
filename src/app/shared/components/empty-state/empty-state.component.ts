import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="wh-empty">
      <p class="wh-empty__title">{{ title }}</p>
      @if (description) {
        <p class="wh-empty__desc">{{ description }}</p>
      }
      <ng-content />
    </div>
  `,
  styles: `
    .wh-empty {
      text-align: center;
      padding: 40px 20px;
      border: 1px dashed var(--wh-line);
      border-radius: var(--wh-radius-md);
      background: rgba(255, 255, 255, 0.7);
    }
    .wh-empty__title {
      margin: 0;
      font-family: var(--wh-font-display);
      font-size: 1.25rem;
      color: var(--wh-ink);
    }
    .wh-empty__desc {
      margin: 10px 0 0;
      color: var(--wh-muted);
    }
  `,
})
export class EmptyStateComponent {
  @Input() title = 'Henüz içerik yok';
  @Input() description = '';
}
