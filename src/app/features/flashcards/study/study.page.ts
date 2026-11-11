import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { WordListService } from '../../../core/services/word-list.service';
import { WordService } from '../../../core/services/word.service';
import { Word } from '../../../shared/models/word.model';
import { WordList } from '../../../shared/models/word-list.model';
import { SUPPORTED_LANGUAGES } from '../../../shared/models/language.model';
import { FlashcardComponent } from '../../../shared/components/flashcard/flashcard.component';
import { AppButtonComponent } from '../../../shared/components/app-button/app-button.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-study',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    RouterLink,
    FlashcardComponent,
    AppButtonComponent,
    EmptyStateComponent,
    LoadingSpinnerComponent,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button [defaultHref]="backHref"></ion-back-button>
        </ion-buttons>
        <ion-title>Çalışma</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="wh-page study">
        @if (loading) {
          <app-loading-spinner />
        } @else if (!list || words.length === 0) {
          <app-empty-state
            title="Çalışılacak kelime yok"
            description="Önce listeye birkaç kelime ekle."
          >
            <a class="link" [routerLink]="backHref">Listeye dön</a>
          </app-empty-state>
        } @else {
          <p class="progress">{{ index + 1 }} / {{ words.length }}</p>
          <app-flashcard
            size="large"
            [front]="current.sourceText"
            [back]="current.targetText"
            [sourceLabel]="languageLabel(list.sourceLanguageCode)"
            [targetLabel]="languageLabel(list.targetLanguageCode)"
            [flipped]="flipped"
            (flippedChange)="flipped = $event"
          />

          <div class="nav">
            <app-button variant="ghost" [disabled]="index === 0" (click)="prev()">Önceki</app-button>
            <app-button variant="primary" (click)="next()">
              {{ index === words.length - 1 ? 'Başa dön' : 'Sonraki' }}
            </app-button>
          </div>
        }
      </div>
    </ion-content>
  `,
  styles: `
    .study {
      display: grid;
      gap: 18px;
      align-content: start;
    }
    .progress {
      margin: 0;
      text-align: center;
      font-weight: 700;
      color: var(--wh-muted);
    }
    .nav {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    .link {
      display: inline-block;
      margin-top: 12px;
      color: var(--wh-teal-deep);
      font-weight: 700;
    }
  `,
})
export class StudyPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly wordListService = inject(WordListService);
  private readonly wordService = inject(WordService);

  listId = '';
  backHref = '/app/lists';
  list: WordList | null = null;
  words: Word[] = [];
  index = 0;
  flipped = false;
  loading = true;

  get current(): Word {
    return this.words[this.index];
  }

  async ngOnInit(): Promise<void> {
    this.listId = this.route.snapshot.paramMap.get('id') ?? '';
    this.backHref = `/app/lists/${this.listId}`;
    try {
      const [list, words] = await Promise.all([
        this.wordListService.getListById(this.listId),
        this.wordService.getWordsByListId(this.listId),
      ]);
      this.list = list;
      this.words = words;
    } finally {
      this.loading = false;
    }
  }

  languageLabel(code: string): string {
    return SUPPORTED_LANGUAGES.find((item) => item.code === code)?.name ?? code;
  }

  prev(): void {
    if (this.index === 0) return;
    this.index -= 1;
    this.flipped = false;
  }

  next(): void {
    if (this.index >= this.words.length - 1) {
      this.index = 0;
    } else {
      this.index += 1;
    }
    this.flipped = false;
  }
}
