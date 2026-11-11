import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';

function matchPasswords(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [IonContent, ReactiveFormsModule, RouterLink, AppButtonComponent, AppInputComponent],
  template: `
    <ion-content [fullscreen]="true">
      <div class="auth wh-page">
        <div>
          <p class="wh-title auth__brand">Kayıt ol</p>
          <p class="wh-subtitle">word-holder hesabını oluştur.</p>
        </div>

        <form class="auth__form wh-card" [formGroup]="form" (ngSubmit)="submit()">
          <app-input label="Ad Soyad" formControlName="fullName" [error]="fullNameError" />
          <app-input
            label="E-posta"
            type="email"
            autocomplete="email"
            formControlName="email"
            [error]="emailError"
          />
          <app-input
            label="Şifre"
            type="password"
            autocomplete="new-password"
            formControlName="password"
            [error]="passwordError"
          />
          <app-input
            label="Şifre tekrar"
            type="password"
            autocomplete="new-password"
            formControlName="confirmPassword"
            [error]="confirmError"
          />

          @if (formError) {
            <p class="wh-error">{{ formError }}</p>
          }

          <app-button type="submit" variant="primary" [fullWidth]="true" [loading]="loading">
            Hesap oluştur
          </app-button>

          <p class="auth__switch">
            Zaten hesabın var mı?
            <a routerLink="/auth/login">Giriş yap</a>
          </p>
        </form>
      </div>
    </ion-content>
  `,
  styles: `
    .auth {
      display: grid;
      gap: 24px;
      align-content: center;
      min-height: 100%;
    }
    .auth__brand {
      margin: 0;
      font-size: 2.1rem;
    }
    .auth__form {
      display: grid;
      gap: 14px;
      padding: 20px;
    }
    .auth__switch {
      margin: 0;
      text-align: center;
      color: var(--wh-muted);
    }
    .auth__switch a {
      color: var(--wh-teal-deep);
      font-weight: 700;
      text-decoration: none;
    }
  `,
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  loading = false;
  formError = '';

  readonly form = this.fb.nonNullable.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: matchPasswords }
  );

  get fullNameError(): string {
    const control = this.form.controls.fullName;
    if (!(control.touched || control.dirty)) return '';
    if (control.hasError('required')) return 'Ad soyad gerekli.';
    if (control.hasError('minlength')) return 'En az 2 karakter gir.';
    return '';
  }

  get emailError(): string {
    const control = this.form.controls.email;
    if (!(control.touched || control.dirty)) return '';
    if (control.hasError('required')) return 'E-posta gerekli.';
    if (control.hasError('email')) return 'Geçerli bir e-posta gir.';
    return '';
  }

  get passwordError(): string {
    const control = this.form.controls.password;
    if (!(control.touched || control.dirty)) return '';
    if (control.hasError('required')) return 'Şifre gerekli.';
    if (control.hasError('minlength')) return 'Şifre en az 6 karakter olmalı.';
    return '';
  }

  get confirmError(): string {
    const control = this.form.controls.confirmPassword;
    if (!(control.touched || control.dirty)) return '';
    if (control.hasError('required')) return 'Şifre tekrarı gerekli.';
    if (this.form.hasError('passwordMismatch')) return 'Şifreler eşleşmiyor.';
    return '';
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    this.formError = '';
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    try {
      await this.auth.register(this.form.getRawValue());
      await this.toast.success('Kayıt tamamlandı');
      await this.router.navigateByUrl('/app/home', { replaceUrl: true });
    } catch (error) {
      this.formError = error instanceof Error ? error.message : 'Kayıt başarısız.';
    } finally {
      this.loading = false;
    }
  }
}
