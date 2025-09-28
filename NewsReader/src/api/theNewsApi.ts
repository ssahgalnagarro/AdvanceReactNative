import axios, { AxiosInstance } from 'axios';
import { Secrets } from '../config/config';
import type { NewsResponse } from '../types/news';

const BASE_URL: string = 'https://api.thenewsapi.com/v1';

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  params: {
    api_token: Secrets.THE_NEWS_API_TOKEN,
  },
});

export interface FetchNewsParams {
  page: number;
  limit: number;
  language?: string;
  search?: string;
  locale?: string;
  categories?: string;
}

export async function fetchAllNews(
  params: FetchNewsParams,
): Promise<NewsResponse> {
  const { page, limit, language, search, locale, categories } = params;

  const response = await client.get<NewsResponse>('/news/all', {
    params: {
      page,
      limit,
      language,
      search,
      locale,
      categories,
    },
  });

  return response.data;
}
