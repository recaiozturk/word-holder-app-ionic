import { Component, Input, inject } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="dismiss(false)">Kapat</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>{{ message }}</p>
      <div class="actions">
        <ion-button expand="block" fill="outline" (click)="dismiss(false)">{{ cancelText }}</ion-button>
        <ion-button expand="block" color="danger" (click)="dismiss(true)">{{ confirmText }}</ion-button>
      </div>
    </ion-content>
  `,
  styles: `
    .actions {
      display: grid;
      gap: 10px;
      margin-top: 24px;
    }
  `,
})
export class ConfirmDialogComponent {
  private readonly modalController = inject(ModalController);

  @Input() title = 'Onay';
  @Input() message = 'Bu işlemi onaylıyor musun?';
  @Input() confirmText = 'Sil';
  @Input() cancelText = 'Vazgeç';

  dismiss(confirmed: boolean): void {
    void this.modalController.dismiss(confirmed);
  }
}
