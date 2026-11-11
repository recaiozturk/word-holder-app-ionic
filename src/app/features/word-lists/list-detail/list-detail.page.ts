import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, schoolOutline } from 'ionicons/icons';
import { WordListService } from '../../../core/services/word-list.service';
import { WordService } from '../../../core/services/word.service';
import { ToastService } from '../../../core/services/toast.service';
import { WordList } from '../../../shared/models/word-list.model';
import { Word } from '../../../shared/models/word.model';
import { SUPPORTED_LANGUAGES } from '../../../shared/models/language.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { FlashcardComponent } from '../../../shared/components/flashcard/flashcard.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-list-detail',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonContent,
    RouterLink,
    EmptyStateComponent,
    FlashcardComponent,
    LoadingSpinnerComponent,
    AppButtonComponent,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/app/lists"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ list?.name || 'Liste' }}</ion-title>
        <ion-buttons slot="end">
          <ion-button [routerLink]="['/app/lists', listId, 'edit']" aria-label="Düzenle">
            <ion-icon name="create-outline"></ion-icon>
          </ion-button>
          <ion-button (click)="confirmDeleteList()" aria-label="Sil">
            <ion-icon name="trash-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="wh-page detail">
        @if (loading) {
          <app-loading-spinner />
        } @else if (error || !list) {
          <p class="wh-error">{{ error || 'Liste bulunamadı.' }}</p>
        } @else {
          <section class="meta wh-card">
            <p class="pair">
              {{ languageLabel(list.sourceLanguageCode) }} → {{ languageLabel(list.targetLanguageCode) }}
            </p>
            <p class="count">{{ list.wordCount }} kelime</p>
            <div class="meta__actions">
              <app-button
                variant="primary"
                [link]="['/app/lists', list.id, 'words', 'create']"
              >
                Kelime ekle
              </app-button>
              <app-button
                variant="secondary"
                [disabled]="words.length === 0"
                [link]="['/app/lists', list.id, 'study']"
              >
                Çalış
              </app-button>
            </div>
          </section>

          <div class="mode-row">
            <button type="button" [class.active]="viewMode === 'grid'" (click)="viewMode = 'grid'">Grid</button>
            <button type="button" [class.active]="viewMode === 'list'" (click)="viewMode = 'list'">Liste</button>
          </div>

          @if (words.length === 0) {
            <app-empty-state
              title="Bu listede kelime yok"
              description="Öğrenmeye başlamak için ilk kelimeni ekle."
            />
          } @else if (viewMode === 'grid') {
            <div class="grid">
              @for (word of words; track word.id) {
                <app-flashcard
                  [front]="word.sourceText"
                  [back]="word.targetText"
                  [sourceLabel]="languageLabel(list.sourceLanguageCode)"
                  [targetLabel]="languageLabel(list.targetLanguageCode)"
                  [flipped]="!!flippedMap[word.id]"
                  (flippedChange)="flippedMap[word.id] = $event"
                />
              }
            </div>
          } @else {
            <div class="word-stack">
              @for (word of words; track word.id) {
                <div class="word-row wh-card">
                  <div>
                    <strong>{{ word.sourceText }}</strong>
                    <p>{{ word.targetText }}</p>
                  </div>
                  <div class="word-row__actions">
                    <a [routerLink]="['/app/lists', list.id, 'words', word.id, 'edit']">Düzenle</a>
                    <button type="button" (click)="confirmDeleteWord(word)">Sil</button>
                  </div>
                </div>
              }
            </div>
          }
        }
      </div>
    </ion-content>
  `,
  styles: `
    .detail {
      display: grid;
      gap: 16px;
    }
    .meta {
      padding: 16px;
      display: grid;
      gap: 8px;
    }
    .pair {
      margin: 0;
      color: var(--wh-muted);
    }
    .count {
      margin: 0;
      font-family: var(--wh-font-display);
      font-size: 1.4rem;
    }
    .meta__actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 8px;
    }
    .mode-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .mode-row button {
      min-height: 42px;
      border: 1px solid var(--wh-line);
      border-radius: 12px;
      background: #fff;
      font-weight: 700;
      color: var(--wh-muted);
    }
    .mode-row button.active {
      background: var(--wh-teal-soft);
      color: var(--wh-teal-deep);
      border-color: transparent;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    @media (min-width: 480px) {
      .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
    }
    .word-stack {
      display: grid;
      gap: 10px;
    }
    .word-row {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 14px;
    }
    .word-row p {
      margin: 4px 0 0;
      color: var(--wh-muted);
    }
    .word-row__actions {
      display: grid;
      gap: 8px;
      align-content: center;
    }
    .word-row__actions a,
    .word-row__actions button {
      border: 0;
      background: transparent;
      color: var(--wh-teal-deep);
      font-weight: 700;
      text-align: right;
      cursor: pointer;
      text-decoration: none;
      padding: 0;
    }
    .word-row__actions button {
      color: var(--wh-danger);
    }
  `,
})
export class ListDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly wordListService = inject(WordListService);
  private readonly wordService = inject(WordService);
  private readonly toast = inject(ToastService);
  private readonly modalController = inject(ModalController);

  listId = '';
  list: WordList | null = null;
  words: Word[] = [];
  loading = true;
  error = '';
  viewMode: 'grid' | 'list' = 'grid';
  flippedMap: Record<string, boolean> = {};

  constructor() {
    addIcons({ addOutline, createOutline, trashOutline, schoolOutline });
  }

  async ngOnInit(): Promise<void> {
    this.listId = this.route.snapshot.paramMap.get('id') ?? '';
    await this.load();
  }

  async load(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      const [list, words] = await Promise.all([
        this.wordListService.getListById(this.listId),
        this.wordService.getWordsByListId(this.listId),
      ]);
      this.list = list;
      this.words = words;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Detay yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  languageLabel(code: string): string {
    return SUPPORTED_LANGUAGES.find((item) => item.code === code)?.name ?? code;
  }

  async confirmDeleteList(): Promise<void> {
    const modal = await this.modalController.create({
      component: ConfirmDialogComponent,
      componentProps: {
        title: 'Listeyi sil',
        message: 'Bu liste ve içindeki tüm kelimeler silinecek.',
        confirmText: 'Listeyi sil',
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<boolean>();
    if (!data) return;

    try {
      await this.wordListService.deleteList(this.listId);
      await this.toast.success('Liste silindi');
      await this.router.navigateByUrl('/app/lists', { replaceUrl: true });
    } catch (error) {
      await this.toast.error(error instanceof Error ? error.message : 'Silinemedi.');
    }
  }

  async confirmDeleteWord(word: Word): Promise<void> {
    const modal = await this.modalController.create({
      component: ConfirmDialogComponent,
      componentProps: {
        title: 'Kelimeyi sil',
        message: `"${word.sourceText}" silinsin mi?`,
        confirmText: 'Kelimeyi sil',
      },
    });
    await modal.present();
    const { data } = await modal.onWillDismiss<boolean>();
    if (!data) return;

    try {
      await this.wordService.deleteWord(word.id);
      await this.toast.success('Kelime silindi');
      await this.load();
    } catch (error) {
      await this.toast.error(error instanceof Error ? error.message : 'Silinemedi.');
    }
  }
}
