export interface Article {
  uuid: string;
  title: string;
  description: string;
  keywords: string;
  snippet: string;
  url: string;
  image_url: string | null;
  language: string;
  published_at: string;
  source: string;
  categories: string[];
  relevance_score?: number | null;
  locale?: string | null;
}

export interface NewsMeta {
  found: number;
  returned: number;
  limit: number;
  page: number;
}

export interface NewsResponse {
  meta: NewsMeta;
  data: Article[];
}
