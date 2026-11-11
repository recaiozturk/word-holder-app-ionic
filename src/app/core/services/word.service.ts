import { Injectable, inject } from '@angular/core';
import { CreateWordRequest, UpdateWordRequest, Word } from '../../shared/models/word.model';
import { MockStoreService } from '../data/mock-store.service';

@Injectable({ providedIn: 'root' })
export class WordService {
  private readonly mockStore = inject(MockStoreService);

  async getWordsByListId(listId: string): Promise<Word[]> {
    return this.mockStore.delay(this.mockStore.getWordsByListId(listId));
  }

  async getWordById(id: string): Promise<Word> {
    const word = this.mockStore.getWord(id);
    await this.mockStore.delay(null);
    if (!word) {
      throw new Error('Kelime bulunamadı.');
    }
    return word;
  }

  async createWord(listId: string, request: CreateWordRequest): Promise<Word> {
    if (!this.mockStore.getWordList(listId)) {
      throw new Error('Liste bulunamadı.');
    }

    const now = new Date().toISOString();
    const word: Word = {
      id: crypto.randomUUID(),
      wordListId: listId,
      sourceText: request.sourceText.trim(),
      targetText: request.targetText.trim(),
      createdAt: now,
      updatedAt: now,
    };

    this.mockStore.createWord(word);
    return this.mockStore.delay(word);
  }

  async updateWord(id: string, request: UpdateWordRequest): Promise<Word> {
    const updated = this.mockStore.updateWord(id, {
      sourceText: request.sourceText.trim(),
      targetText: request.targetText.trim(),
    });
    await this.mockStore.delay(null);

    if (!updated) {
      throw new Error('Kelime bulunamadı.');
    }
    return updated;
  }

  async deleteWord(id: string): Promise<void> {
    const deleted = this.mockStore.deleteWord(id);
    await this.mockStore.delay(null);
    if (!deleted) {
      throw new Error('Kelime bulunamadı.');
    }
  }
}
