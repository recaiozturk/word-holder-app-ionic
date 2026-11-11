import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { WordListService } from '../../../core/services/word-list.service';
import { ToastService } from '../../../core/services/toast.service';
import { SUPPORTED_LANGUAGES } from '../../../shared/models/language.model';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { AppSelectComponent } from '../../../shared/components/app-select/app-select.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-list-edit',
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
    LoadingSpinnerComponent,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="backHref"></ion-back-button>
        </ion-buttons>
        <ion-title>Liste düzenle</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      @if (loadingPage) {
        <app-loading-spinner />
      } @else {
        <form class="wh-page form wh-card" [formGroup]="form" (ngSubmit)="submit()">
          <app-input label="Liste adı" formControlName="name" [error]="nameError" />
          <app-select label="Kaynak dil" [options]="languages" formControlName="sourceLanguageCode" />
          <app-select label="Hedef dil" [options]="languages" formControlName="targetLanguageCode" />

          @if (formError) {
            <p class="wh-error">{{ formError }}</p>
          }

          <app-button type="submit" variant="primary" [fullWidth]="true" [loading]="saving">
            Güncelle
          </app-button>
        </form>
      }
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
export class ListEditPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly wordListService = inject(WordListService);
  private readonly toast = inject(ToastService);

  readonly languages = SUPPORTED_LANGUAGES;
  listId = '';
  backHref = '/app/lists';
  loadingPage = true;
  saving = false;
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

  async ngOnInit(): Promise<void> {
    this.listId = this.route.snapshot.paramMap.get('id') ?? '';
    this.backHref = `/app/lists/${this.listId}`;
    try {
      const list = await this.wordListService.getListById(this.listId);
      this.form.patchValue({
        name: list.name,
        sourceLanguageCode: list.sourceLanguageCode,
        targetLanguageCode: list.targetLanguageCode,
      });
    } catch (error) {
      this.formError = error instanceof Error ? error.message : 'Liste yüklenemedi.';
    } finally {
      this.loadingPage = false;
    }
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    this.formError = '';
    if (this.form.invalid || this.saving) return;

    this.saving = true;
    try {
      await this.wordListService.updateList(this.listId, this.form.getRawValue());
      await this.toast.success('Liste güncellendi');
      await this.router.navigate(['/app/lists', this.listId], { replaceUrl: true });
    } catch (error) {
      this.formError = error instanceof Error ? error.message : 'Güncelleme başarısız.';
    } finally {
      this.saving = false;
    }
  }
}
