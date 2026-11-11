import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { WordListService } from '../../../core/services/word-list.service';
import { WordService } from '../../../core/services/word.service';
import { ToastService } from '../../../core/services/toast.service';
import { SUPPORTED_LANGUAGES } from '../../../shared/models/language.model';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { AppInputComponent } from '../../../shared/components/app-input/app-input.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-word-edit',
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
    LoadingSpinnerComponent,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="backHref"></ion-back-button>
        </ion-buttons>
        <ion-title>Kelime düzenle</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      @if (loading) {
        <app-loading-spinner />
      } @else {
        <form class="wh-page form wh-card" [formGroup]="form" (ngSubmit)="submit()">
          <app-input [label]="sourceLabel" formControlName="sourceText" [error]="sourceError" />
          <app-input [label]="targetLabel" formControlName="targetText" [error]="targetError" />

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
export class WordEditPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly wordListService = inject(WordListService);
  private readonly wordService = inject(WordService);
  private readonly toast = inject(ToastService);

  listId = '';
  wordId = '';
  backHref = '/app/lists';
  sourceLabel = 'Kaynak kelime';
  targetLabel = 'Hedef karşılık';
  loading = true;
  saving = false;
  formError = '';

  readonly form = this.fb.nonNullable.group({
    sourceText: ['', [Validators.required]],
    targetText: ['', [Validators.required]],
  });

  get sourceError(): string {
    const control = this.form.controls.sourceText;
    if (!(control.touched || control.dirty)) return '';
    return control.hasError('required') ? 'Bu alan gerekli.' : '';
  }

  get targetError(): string {
    const control = this.form.controls.targetText;
    if (!(control.touched || control.dirty)) return '';
    return control.hasError('required') ? 'Bu alan gerekli.' : '';
  }

  async ngOnInit(): Promise<void> {
    this.listId = this.route.snapshot.paramMap.get('id') ?? '';
    this.wordId = this.route.snapshot.paramMap.get('wordId') ?? '';
    this.backHref = `/app/lists/${this.listId}`;

    try {
      const [list, word] = await Promise.all([
        this.wordListService.getListById(this.listId),
        this.wordService.getWordById(this.wordId),
      ]);
      this.sourceLabel = this.languageLabel(list.sourceLanguageCode);
      this.targetLabel = this.languageLabel(list.targetLanguageCode);
      this.form.patchValue({
        sourceText: word.sourceText,
        targetText: word.targetText,
      });
    } catch (error) {
      this.formError = error instanceof Error ? error.message : 'Kelime yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  languageLabel(code: string): string {
    return SUPPORTED_LANGUAGES.find((item) => item.code === code)?.name ?? code;
  }

  async submit(): Promise<void> {
    this.form.markAllAsTouched();
    this.formError = '';
    if (this.form.invalid || this.saving) return;

    this.saving = true;
    try {
      await this.wordService.updateWord(this.wordId, this.form.getRawValue());
      await this.toast.success('Kelime güncellendi');
      await this.router.navigate(['/app/lists', this.listId], { replaceUrl: true });
    } catch (error) {
      this.formError = error instanceof Error ? error.message : 'Güncelleme başarısız.';
    } finally {
      this.saving = false;
    }
  }
}
