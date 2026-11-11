import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [IonContent, LoadingSpinnerComponent],
  template: `
    <ion-content [fullscreen]="true">
      <div class="splash">
        <p class="splash__brand">word-holder</p>
        <p class="splash__tag">Kelimelerini topla, kartlarla öğren.</p>
        <app-loading-spinner label="Oturum kontrol ediliyor..." />
      </div>
    </ion-content>
  `,
  styles: `
    .splash {
      min-height: 100%;
      display: grid;
      place-content: center;
      justify-items: center;
      gap: 10px;
      padding: 24px;
      text-align: center;
      background:
        radial-gradient(circle at 20% 20%, rgba(15, 143, 134, 0.18), transparent 40%),
        radial-gradient(circle at 80% 10%, rgba(18, 32, 40, 0.08), transparent 35%),
        var(--wh-sand);
    }
    .splash__brand {
      margin: 0;
      font-family: var(--wh-font-display);
      font-size: clamp(2rem, 8vw, 3rem);
      font-weight: 700;
      letter-spacing: -0.03em;
      color: var(--wh-ink);
    }
    .splash__tag {
      margin: 0 0 18px;
      color: var(--wh-muted);
    }
  `,
})
export class SplashPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    await this.auth.initSession();
    const target = this.auth.isAuthenticated() ? '/app/home' : '/auth/login';
    await this.router.navigateByUrl(target, { replaceUrl: true });
  }
}
