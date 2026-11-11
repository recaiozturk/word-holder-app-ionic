import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { WordListService } from '../../core/services/word-list.service';
import { WordList } from '../../shared/models/word-list.model';
import { SUPPORTED_LANGUAGES } from '../../shared/models/language.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-lists-overview',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonContent,
    RouterLink,
    EmptyStateComponent,
    LoadingSpinnerComponent,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>My Lists</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/app/lists/create" aria-label="Yeni liste">
            <ion-icon name="add-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="wh-page">
        @if (loading) {
          <app-loading-spinner />
        } @else if (error) {
          <p class="wh-error">{{ error }}</p>
        } @else if (lists.length === 0) {
          <app-empty-state
            title="Liste bulunamadı"
            description="Yeni bir kelime listesi oluşturarak başla."
          >
            <a class="link" routerLink="/app/lists/create">Liste oluştur</a>
          </app-empty-state>
        } @else {
          <div class="stack">
            @for (list of lists; track list.id) {
              <a class="item wh-card" [routerLink]="['/app/lists', list.id]">
                <strong>{{ list.name }}</strong>
                <p>{{ languageLabel(list.sourceLanguageCode) }} → {{ languageLabel(list.targetLanguageCode) }}</p>
                <span>{{ list.wordCount }} kelime</span>
              </a>
            }
          </div>
        }
      </div>
    </ion-content>
  `,
  styles: `
    .stack {
      display: grid;
      gap: 12px;
    }
    .item {
      display: grid;
      gap: 4px;
      padding: 16px;
      text-decoration: none;
      color: inherit;
    }
    .item p,
    .item span {
      margin: 0;
      color: var(--wh-muted);
    }
    .item span {
      color: var(--wh-teal-deep);
      font-weight: 700;
    }
    .link {
      display: inline-block;
      margin-top: 14px;
      color: var(--wh-teal-deep);
      font-weight: 700;
    }
  `,
})
export class ListsOverviewPage implements ViewWillEnter {
  private readonly wordListService = inject(WordListService);

  lists: WordList[] = [];
  loading = true;
  error = '';

  constructor() {
    addIcons({ addOutline });
  }

  ionViewWillEnter(): void {
    void this.load();
  }

  async load(): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      this.lists = await this.wordListService.getLists();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Listeler yüklenemedi.';
    } finally {
      this.loading = false;
    }
  }

  languageLabel(code: string): string {
    return SUPPORTED_LANGUAGES.find((item) => item.code === code)?.name ?? code;
  }
}
