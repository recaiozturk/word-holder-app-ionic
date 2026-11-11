export interface WordList {
  id: string;
  name: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWordListRequest {
  name: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
}

export interface UpdateWordListRequest {
  name: string;
  sourceLanguageCode: string;
  targetLanguageCode: string;
}
