import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LanguageOption } from '../../models/language.model';

@Component({
  selector: 'app-select',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppSelectComponent),
      multi: true,
    },
  ],
  template: `
    <label class="wh-field">
      @if (label) {
        <span class="wh-field__label">{{ label }}</span>
      }
      <select
        class="wh-field__select"
        [disabled]="disabled"
        [value]="value"
        (change)="onChangeEvent($event)"
        (blur)="onTouched()"
      >
        @for (option of options; track option.code) {
          <option [value]="option.code">{{ option.name }} ({{ option.nativeName }})</option>
        }
      </select>
      @if (error) {
        <span class="wh-error">{{ error }}</span>
      }
    </label>
  `,
  styles: `
    .wh-field {
      display: grid;
      gap: 8px;
    }
    .wh-field__label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--wh-ink-soft);
    }
    .wh-field__select {
      width: 100%;
      min-height: 48px;
      padding: 0 14px;
      border: 1px solid var(--wh-line);
      border-radius: 14px;
      background: #fff;
      color: var(--wh-ink);
      font: inherit;
      outline: none;
    }
    .wh-field__select:focus {
      border-color: var(--wh-teal);
      box-shadow: 0 0 0 3px rgba(15, 143, 134, 0.15);
    }
  `,
})
export class AppSelectComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() options: LanguageOption[] = [];
  @Input() error = '';
  @Input() disabled = false;

  value = '';

  private onChange: (value: string) => void = () => undefined;
  onTouched: () => void = () => undefined;

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onChangeEvent(event: Event): void {
    const next = (event.target as HTMLSelectElement).value;
    this.value = next;
    this.onChange(next);
  }
}
