import { Injectable } from '@angular/core';
import { UserDto } from '../../shared/models/auth.model';
import { WordList } from '../../shared/models/word-list.model';
import { Word } from '../../shared/models/word.model';

interface MockUserRecord extends UserDto {
  password: string;
}

@Injectable({ providedIn: 'root' })
export class MockStoreService {
  private readonly users: MockUserRecord[] = [
    {
      id: 'user-demo',
      email: 'demo@wordholder.app',
      fullName: 'Demo User',
      userName: 'demo',
      isActive: true,
      preferredLanguage: 'tr',
      roles: ['User'],
      lastLoginAt: null,
      password: 'Demo123!',
    },
  ];

  private wordLists: WordList[] = [
    {
      id: 'list-1',
      name: 'Daily Basics',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'tr',
      wordCount: 3,
      createdAt: '2026-11-01T10:00:00.000Z',
      updatedAt: '2026-11-10T10:00:00.000Z',
    },
    {
      id: 'list-2',
      name: 'Travel Words',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'de',
      wordCount: 2,
      createdAt: '2026-11-05T10:00:00.000Z',
      updatedAt: '2026-11-09T10:00:00.000Z',
    },
  ];

  private words: Word[] = [
    {
      id: 'word-1',
      wordListId: 'list-1',
      sourceText: 'Apple',
      targetText: 'Elma',
      createdAt: '2026-11-01T10:00:00.000Z',
      updatedAt: '2026-11-01T10:00:00.000Z',
    },
    {
      id: 'word-2',
      wordListId: 'list-1',
      sourceText: 'Book',
      targetText: 'Kitap',
      createdAt: '2026-11-01T10:05:00.000Z',
      updatedAt: '2026-11-01T10:05:00.000Z',
    },
    {
      id: 'word-3',
      wordListId: 'list-1',
      sourceText: 'Water',
      targetText: 'Su',
      createdAt: '2026-11-01T10:10:00.000Z',
      updatedAt: '2026-11-01T10:10:00.000Z',
    },
    {
      id: 'word-4',
      wordListId: 'list-2',
      sourceText: 'Airport',
      targetText: 'Flughafen',
      createdAt: '2026-11-05T10:00:00.000Z',
      updatedAt: '2026-11-05T10:00:00.000Z',
    },
    {
      id: 'word-5',
      wordListId: 'list-2',
      sourceText: 'Ticket',
      targetText: 'Fahrkarte',
      createdAt: '2026-11-05T10:05:00.000Z',
      updatedAt: '2026-11-05T10:05:00.000Z',
    },
  ];

  delay<T>(value: T, ms = 450): Promise<T> {
    return new Promise((resolve) => setTimeout(() => resolve(value), ms));
  }

  findUserByEmail(email: string): MockUserRecord | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  addUser(user: MockUserRecord): void {
    this.users.push(user);
  }

  getWordLists(): WordList[] {
    return [...this.wordLists].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  getWordList(id: string): WordList | undefined {
    return this.wordLists.find((list) => list.id === id);
  }

  createWordList(list: WordList): WordList {
    this.wordLists = [list, ...this.wordLists];
    return list;
  }

  updateWordList(id: string, patch: Partial<WordList>): WordList | undefined {
    const index = this.wordLists.findIndex((list) => list.id === id);
    if (index < 0) {
      return undefined;
    }
    this.wordLists[index] = { ...this.wordLists[index], ...patch, updatedAt: new Date().toISOString() };
    return this.wordLists[index];
  }

  deleteWordList(id: string): boolean {
    const exists = this.wordLists.some((list) => list.id === id);
    this.wordLists = this.wordLists.filter((list) => list.id !== id);
    this.words = this.words.filter((word) => word.wordListId !== id);
    return exists;
  }

  getWordsByListId(listId: string): Word[] {
    return this.words
      .filter((word) => word.wordListId === listId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  getWord(id: string): Word | undefined {
    return this.words.find((word) => word.id === id);
  }

  createWord(word: Word): Word {
    this.words = [...this.words, word];
    this.recalculateWordCount(word.wordListId);
    return word;
  }

  updateWord(id: string, patch: Partial<Word>): Word | undefined {
    const index = this.words.findIndex((word) => word.id === id);
    if (index < 0) {
      return undefined;
    }
    this.words[index] = { ...this.words[index], ...patch, updatedAt: new Date().toISOString() };
    return this.words[index];
  }

  deleteWord(id: string): boolean {
    const word = this.words.find((item) => item.id === id);
    if (!word) {
      return false;
    }
    this.words = this.words.filter((item) => item.id !== id);
    this.recalculateWordCount(word.wordListId);
    return true;
  }

  private recalculateWordCount(listId: string): void {
    const count = this.words.filter((word) => word.wordListId === listId).length;
    this.updateWordList(listId, { wordCount: count });
  }
}
