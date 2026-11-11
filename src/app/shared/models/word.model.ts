export interface Word {
  id: string;
  wordListId: string;
  sourceText: string;
  targetText: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWordRequest {
  sourceText: string;
  targetText: string;
}

export interface UpdateWordRequest {
  sourceText: string;
  targetText: string;
}
