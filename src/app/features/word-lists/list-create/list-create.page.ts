import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { WordListService } from '../../../core/services/word-list.service';
import { ToastService } from '../../../core/services/toast.service';
import { SUPPORTED_LANGUAGES } from '../../../shared/models/language.model';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppSelectComponent } from '../../../shared/components/app-select/app-select.component';

@Component({
  selector: 'app-list-create',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    ReactiveFormsModule,
    AppButtonComponent,
    AppInputComponent,
    AppSelectComponent,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/app/lists"></ion-back-button>
        </ion-buttons>
        <ion-title>Yeni liste</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <form class="wh-page form wh-card" [formGroup]="form" (ngSubmit)="submit()">
        <app-input label="Liste adı" formControlName="name" [error]="nameError" />
        <app-select
          label="Kaynak dil"
          [options]="languages"
          formControlName="sourceLanguageCode"
        />
        <app-select
          label="Hedef dil"
          [options]="languages"
          formControlName="targetLanguageCode"
        />

        @if (formError) {
          <p class="wh-error">{{ formError }}</p>
        }

        <app-button type="submit" variant="primary" [fullWidth]="true" [loading]="loading">
          Kaydet
        </app-button>
      </form>
    </ion-content>
  `,
  styles: `
    .form {
      display: grid;
      gap: 14px;
      padding: 18px;
      margin-top: 8px;
    }
  `,
})
export class ListCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly wordListService = inject(WordListService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly languages = SUPPORTED_LANGUAGES;
  loading = false;
  formError = '';

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    sourceLanguageCode: ['en', Validators.required],
    targetLanguageCode: ['tr', Validators.required],
  });

  get nameError(): string {
    const control = this.form.controls.name;
    if (!(control.touched || control.dirty)) return '';
    if (control.hasError('required')) return 'Liste adı gerekli.';
    if (control.hasError('minlength')) return 'En az 2 karakter gir.';
    return '';
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    this.formError = '';
    if (this.form.invalid || this.loading) return;

    this.loading = true;
    try {
      const created = await this.wordListService.createList(this.form.getRawValue());
      await this.toast.success('Liste oluşturuldu');
      await this.router.navigate(['/app/lists', created.id], { replaceUrl: true });
    } catch (error) {
      this.formError = error instanceof Error ? error.message : 'Liste oluşturulamadı.';
    } finally {
      this.loading = false;
    }
  }
}
