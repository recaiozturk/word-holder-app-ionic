import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppInputComponent),
      multi: true,
    },
  ],
  template: `
    <label class="wh-field">
      @if (label) {
        <span class="wh-field__label">{{ label }}</span>
      }
      <div class="wh-field__control">
        <input
          class="wh-field__input"
          [type]="showPassword ? 'text' : type"
          [placeholder]="placeholder"
          [disabled]="disabled"
          [attr.autocomplete]="autocomplete"
          [value]="value"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
        @if (type === 'password') {
          <button type="button" class="wh-field__toggle" (click)="showPassword = !showPassword">
            {{ showPassword ? 'Gizle' : 'Göster' }}
          </button>
        }
      </div>
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
    .wh-field__control {
      position: relative;
      display: flex;
      align-items: center;
    }
    .wh-field__input {
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
    .wh-field__input:focus {
      border-color: var(--wh-teal);
      box-shadow: 0 0 0 3px rgba(15, 143, 134, 0.15);
    }
    .wh-field__toggle {
      position: absolute;
      right: 10px;
      border: 0;
      background: transparent;
      color: var(--wh-teal-deep);
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
    }
  `,
})
export class AppInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
  @Input() placeholder = '';
  @Input() autocomplete = 'off';
  @Input() error = '';
  @Input() disabled = false;

  value = '';
  showPassword = false;

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

  onInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value = next;
    this.onChange(next);
  }
}
