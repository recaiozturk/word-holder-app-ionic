import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonContent, ReactiveFormsModule, RouterLink, AppButtonComponent, AppInputComponent],
  template: `
    <ion-content [fullscreen]="true">
      <div class="auth wh-page">
        <div class="auth__hero">
          <p class="wh-title auth__brand">word-holder</p>
          <p class="wh-subtitle">Hesabına giriş yap ve listelerine devam et.</p>
        </div>

        <form class="auth__form wh-card" [formGroup]="form" (ngSubmit)="submit()">
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
            autocomplete="current-password"
            formControlName="password"
            [error]="passwordError"
          />

          @if (formError) {
            <p class="wh-error">{{ formError }}</p>
          }

          <app-button type="submit" variant="primary" [fullWidth]="true" [loading]="loading">
            Giriş yap
          </app-button>

          <p class="auth__hint">
            Demo: demo&#64;wordholder.app / Demo123!
          </p>
          <p class="auth__switch">
            Hesabın yok mu?
            <a routerLink="/auth/register">Kayıt ol</a>
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
      font-size: 2.4rem;
    }
    .auth__form {
      display: grid;
      gap: 14px;
      padding: 20px;
    }
    .auth__hint,
    .auth__switch {
      margin: 0;
      text-align: center;
      color: var(--wh-muted);
      font-size: 0.9rem;
    }
    .auth__switch a {
      color: var(--wh-teal-deep);
      font-weight: 700;
      text-decoration: none;
    }
  `,
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  loading = false;
  formError = '';

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

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

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    this.formError = '';
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    try {
      await this.auth.login(this.form.getRawValue());
      await this.toast.success('Giriş başarılı');
      await this.router.navigateByUrl('/app/home', { replaceUrl: true });
    } catch (error) {
      this.formError = error instanceof Error ? error.message : 'Giriş başarısız.';
    } finally {
      this.loading = false;
    }
  }
}
