import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, ViewWillEnter } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addOutline, logOutOutline } from 'ionicons/icons';
import { AuthService } from '../../core/services/auth.service';
import { WordListService } from '../../core/services/word-list.service';
import { WordList } from '../../shared/models/word-list.model';
import { SUPPORTED_LANGUAGES } from '../../shared/models/language.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { AppButtonComponent } from '../../shared/components/app-button/app-button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    RouterLink,
    EmptyStateComponent,
    LoadingSpinnerComponent,
    AppButtonComponent,
  ],
  template: `
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-title>Home</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="logout()" aria-label="Çıkış yap">
            <ion-icon name="log-out-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <div class="wh-page home">
        <section class="home__welcome">
          <p class="wh-title">Merhaba, {{ displayName }}</p>
          <p class="wh-subtitle">Bugün hangi kelimeleri çalışacaksın?</p>
        </section>

        @if (loading) {
          <app-loading-spinner />
        } @else if (error) {
          <p class="wh-error">{{ error }}</p>
          <app-button variant="secondary" (click)="load()">Tekrar dene</app-button>
        } @else {
          <section class="home__stats">
            <div class="stat wh-card">
              <span>Listeler</span>
              <strong>{{ lists.length }}</strong>
            </div>
            <div class="stat wh-card">
              <span>Kelimeler</span>
              <strong>{{ totalWords }}</strong>
            </div>
          </section>

          <div class="home__actions">
            <app-button variant="primary" [fullWidth]="true" link="/app/lists/create">
              Yeni liste oluştur
            </app-button>
          </div>

          <section class="home__lists">
            <div class="section-head">
              <h2>Son listeler</h2>
              <a routerLink="/app/lists">Tümü</a>
            </div>

            @if (lists.length === 0) {
              <app-empty-state
                title="Henüz liste yok"
                description="İlk kelime listeni oluşturarak başla."
              />
            } @else {
              <div class="list-stack">
                @for (list of lists.slice(0, 5); track list.id) {
                  <a class="list-item wh-card" [routerLink]="['/app/lists', list.id]">
                    <div>
                      <strong>{{ list.name }}</strong>
                      <p>{{ languageLabel(list.sourceLanguageCode) }} → {{ languageLabel(list.targetLanguageCode) }}</p>
                    </div>
                    <span>{{ list.wordCount }} kelime</span>
                  </a>
                }
              </div>
            }
          </section>
        }
      </div>
    </ion-content>
  `,
  styles: `
    .home {
      display: grid;
      gap: 20px;
    }
    .home__welcome .wh-title {
      margin: 0;
      font-size: 1.9rem;
    }
    .home__stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .stat {
      padding: 16px;
      display: grid;
      gap: 6px;
    }
    .stat span {
      color: var(--wh-muted);
      font-size: 0.85rem;
    }
    .stat strong {
      font-family: var(--wh-font-display);
      font-size: 1.8rem;
    }
    .section-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .section-head h2 {
      margin: 0;
      font-size: 1.1rem;
    }
    .section-head a {
      color: var(--wh-teal-deep);
      font-weight: 700;
      text-decoration: none;
    }
    .list-stack {
      display: grid;
      gap: 10px;
    }
    .list-item {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      padding: 16px;
      text-decoration: none;
      color: inherit;
    }
    .list-item p {
      margin: 4px 0 0;
      color: var(--wh-muted);
      font-size: 0.9rem;
    }
    .list-item span {
      align-self: center;
      color: var(--wh-teal-deep);
      font-weight: 700;
      white-space: nowrap;
    }
  `,
})
export class HomePage implements ViewWillEnter {
  private readonly auth = inject(AuthService);
  private readonly wordListService = inject(WordListService);
  private readonly router = inject(Router);

  lists: WordList[] = [];
  loading = true;
  error = '';

  constructor() {
    addIcons({ addOutline, logOutOutline });
  }

  get displayName(): string {
    return this.auth.user()?.fullName?.split(' ')[0] || 'öğrenen';
  }

  get totalWords(): number {
    return this.lists.reduce((sum, list) => sum + list.wordCount, 0);
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

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/auth/login', { replaceUrl: true });
  }
}
