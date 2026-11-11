import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({ providedIn: 'root' })
export class StorageService {
  async get(key: string): Promise<string | null> {
    const result = await Preferences.get({ key });
    return result.value;
  }

  async set(key: string, value: string): Promise<void> {
    await Preferences.set({ key, value });
  }

  async remove(key: string): Promise<void> {
    await Preferences.remove({ key });
  }
}
