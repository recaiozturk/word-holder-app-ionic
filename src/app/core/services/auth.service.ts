import { Injectable, computed, inject, signal } from '@angular/core';
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  UserDto,
} from '../../shared/models/auth.model';
import { MockStoreService } from '../data/mock-store.service';
import { StorageService } from './storage.service';

const ACCESS_TOKEN_KEY = 'wh.accessToken';
const REFRESH_TOKEN_KEY = 'wh.refreshToken';
const USER_KEY = 'wh.user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly mockStore = inject(MockStoreService);

  private readonly userSignal = signal<UserDto | null>(null);
  private readonly readySignal = signal(false);
  private accessToken: string | null = null;

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());
  readonly isReady = this.readySignal.asReadonly();

  async initSession(): Promise<void> {
    try {
      const [token, userRaw] = await Promise.all([
        this.storage.get(ACCESS_TOKEN_KEY),
        this.storage.get(USER_KEY),
      ]);
      if (token && userRaw) {
        this.accessToken = token;
        this.userSignal.set(JSON.parse(userRaw) as UserDto);
      }
    } finally {
      this.readySignal.set(true);
    }
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  async login(request: LoginRequest): Promise<UserDto> {
    const user = this.mockStore.findUserByEmail(request.email.trim());
    await this.mockStore.delay(null);

    if (!user || user.password !== request.password) {
      throw new Error('E-posta veya şifre hatalı.');
    }

    const profile: UserDto = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      userName: user.userName,
      isActive: user.isActive,
      preferredLanguage: user.preferredLanguage,
      roles: user.roles,
      lastLoginAt: new Date().toISOString(),
    };

    await this.persistSession(profile, this.createTokens(profile.id));
    return profile;
  }

  async register(request: RegisterRequest): Promise<UserDto> {
    await this.mockStore.delay(null);

    if (this.mockStore.findUserByEmail(request.email.trim())) {
      throw new Error('Bu e-posta adresi zaten kayıtlı.');
    }

    if (request.password !== request.confirmPassword) {
      throw new Error('Şifreler eşleşmiyor.');
    }

    const profile: UserDto = {
      id: crypto.randomUUID(),
      email: request.email.trim().toLowerCase(),
      fullName: request.fullName.trim(),
      userName: null,
      isActive: true,
      preferredLanguage: 'tr',
      roles: ['User'],
      lastLoginAt: new Date().toISOString(),
    };

    this.mockStore.addUser({ ...profile, password: request.password });
    await this.persistSession(profile, this.createTokens(profile.id));
    return profile;
  }

  async logout(): Promise<void> {
    this.accessToken = null;
    this.userSignal.set(null);
    await Promise.all([
      this.storage.remove(ACCESS_TOKEN_KEY),
      this.storage.remove(REFRESH_TOKEN_KEY),
      this.storage.remove(USER_KEY),
    ]);
  }

  private async persistSession(user: UserDto, tokens: TokenResponse): Promise<void> {
    this.accessToken = tokens.accessToken;
    this.userSignal.set(user);
    await Promise.all([
      this.storage.set(ACCESS_TOKEN_KEY, tokens.accessToken),
      this.storage.set(REFRESH_TOKEN_KEY, tokens.refreshToken),
      this.storage.set(USER_KEY, JSON.stringify(user)),
    ]);
  }

  private createTokens(userId: string): TokenResponse {
    const now = Date.now();
    return {
      accessToken: `mock-access-${userId}-${now}`,
      refreshToken: `mock-refresh-${userId}-${now}`,
      accessTokenExpiresAt: new Date(now + 60 * 60 * 1000).toISOString(),
      refreshTokenExpiresAt: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
  }
}
