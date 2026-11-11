import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isReady()) {
    await auth.initSession();
  }

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login']);
};

export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isReady()) {
    await auth.initSession();
  }

  if (!auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/app/home']);
};
