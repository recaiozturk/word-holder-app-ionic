import { Injectable, inject } from '@angular/core';
import {
  CreateWordListRequest,
  UpdateWordListRequest,
  WordList,
} from '../../shared/models/word-list.model';
import { MockStoreService } from '../data/mock-store.service';

@Injectable({ providedIn: 'root' })
export class WordListService {
  private readonly mockStore = inject(MockStoreService);

  async getLists(): Promise<WordList[]> {
    return this.mockStore.delay(this.mockStore.getWordLists());
  }

  async getListById(id: string): Promise<WordList> {
    const list = this.mockStore.getWordList(id);
    await this.mockStore.delay(null);
    if (!list) {
      throw new Error('Liste bulunamadı.');
    }
    return list;
  }

  async createList(request: CreateWordListRequest): Promise<WordList> {
    if (request.sourceLanguageCode === request.targetLanguageCode) {
      throw new Error('Kaynak ve hedef dil aynı olamaz.');
    }

    const now = new Date().toISOString();
    const list: WordList = {
      id: crypto.randomUUID(),
      name: request.name.trim(),
      sourceLanguageCode: request.sourceLanguageCode,
      targetLanguageCode: request.targetLanguageCode,
      wordCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    this.mockStore.createWordList(list);
    return this.mockStore.delay(list);
  }

  async updateList(id: string, request: UpdateWordListRequest): Promise<WordList> {
    if (request.sourceLanguageCode === request.targetLanguageCode) {
      throw new Error('Kaynak ve hedef dil aynı olamaz.');
    }

    const updated = this.mockStore.updateWordList(id, {
      name: request.name.trim(),
      sourceLanguageCode: request.sourceLanguageCode,
      targetLanguageCode: request.targetLanguageCode,
    });
    await this.mockStore.delay(null);

    if (!updated) {
      throw new Error('Liste bulunamadı.');
    }
    return updated;
  }

  async deleteList(id: string): Promise<void> {
    const deleted = this.mockStore.deleteWordList(id);
    await this.mockStore.delay(null);
    if (!deleted) {
      throw new Error('Liste bulunamadı.');
    }
  }
}
