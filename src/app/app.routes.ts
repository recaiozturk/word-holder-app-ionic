import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'splash',
  },
  {
    path: 'splash',
    loadComponent: () => import('./features/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.page').then((m) => m.LoginPage),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register.page').then((m) => m.RegisterPage),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },
    ],
  },
  {
    path: 'app',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./layouts/main-layout/main-layout.page').then((m) => m.MainLayoutPage),
        children: [
          {
            path: 'home',
            loadComponent: () => import('./features/home/home.page').then((m) => m.HomePage),
          },
          {
            path: 'lists',
            loadComponent: () =>
              import('./features/word-lists/lists-overview.page').then((m) => m.ListsOverviewPage),
          },
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'home',
          },
        ],
      },
      {
        path: 'lists/create',
        loadComponent: () =>
          import('./features/word-lists/list-create/list-create.page').then((m) => m.ListCreatePage),
      },
      {
        path: 'lists/:id/edit',
        loadComponent: () =>
          import('./features/word-lists/list-edit/list-edit.page').then((m) => m.ListEditPage),
      },
      {
        path: 'lists/:id/words/create',
        loadComponent: () =>
          import('./features/words/word-create/word-create.page').then((m) => m.WordCreatePage),
      },
      {
        path: 'lists/:id/words/:wordId/edit',
        loadComponent: () =>
          import('./features/words/word-edit/word-edit.page').then((m) => m.WordEditPage),
      },
      {
        path: 'lists/:id/study',
        loadComponent: () =>
          import('./features/flashcards/study/study.page').then((m) => m.StudyPage),
      },
      {
        path: 'lists/:id',
        loadComponent: () =>
          import('./features/word-lists/list-detail/list-detail.page').then((m) => m.ListDetailPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'splash',
  },
];
