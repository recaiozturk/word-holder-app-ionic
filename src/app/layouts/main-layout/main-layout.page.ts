import { Component } from '@angular/core';
import {
  IonIcon,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { homeOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom" class="wh-tabbar">
        <ion-tab-button tab="home" href="/app/home">
          <ion-icon name="home-outline"></ion-icon>
          <ion-label>Home</ion-label>
        </ion-tab-button>
        <ion-tab-button tab="lists" href="/app/lists">
          <ion-icon name="list-outline"></ion-icon>
          <ion-label>My Lists</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: `
    .wh-tabbar {
      --border: 1px solid var(--wh-line);
      --background: rgba(255, 255, 255, 0.94);
      backdrop-filter: blur(10px);
      padding-bottom: env(safe-area-inset-bottom);
    }
    ion-tab-button {
      --color-selected: var(--wh-teal-deep);
      font-weight: 600;
    }
  `,
})
export class MainLayoutPage {
  constructor() {
    addIcons({ homeOutline, listOutline });
  }
}
