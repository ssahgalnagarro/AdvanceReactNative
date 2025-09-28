import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchAllNews } from '../api/theNewsApi';
import type { Article, NewsResponse } from '../types/news';

export interface UseNewsFeedParams {
  initialPage?: number;
  pageSize?: number;
  language?: string;
  search?: string;
  locale?: string;
  categories?: string;
}

export interface UseNewsFeedState {
  articles: Article[];
  isInitialLoading: boolean;
  isRefreshing: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasNextPage: boolean;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
  retry: () => Promise<void>;
}

export function useNewsFeed(params: UseNewsFeedParams = {}): UseNewsFeedState {
  const {
    initialPage = 1,
    pageSize = 10,
    language = 'en',
    search,
    locale,
    categories,
  } = params;

  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState<number>(initialPage);
  const [isInitialLoading, setIsInitialLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Track if a request is in-flight to avoid duplicate calls
  const inFlight = useRef<boolean>(false);
  // Derived “has next” flag from the last response
  const lastMeta = useRef<NewsResponse['meta'] | null>(null);

  const hasNextPage: boolean = useMemo(() => {
    if (!lastMeta.current) return true; // optimistic before first load
    // Stop if server returned fewer than requested
    return lastMeta.current.returned >= lastMeta.current.limit;
  }, []);

  const fetchPage = useCallback(
    async (nextPage: number, mode: 'initial' | 'refresh' | 'more') => {
      if (inFlight.current) return;
      inFlight.current = true;

      try {
        if (mode === 'initial') {
          setIsInitialLoading(true);
          setError(null);
        } else if (mode === 'refresh') {
          setIsRefreshing(true);
          setError(null);
        } else if (mode === 'more') {
          setIsLoadingMore(true);
        }

        const res = await fetchAllNews({
          page: nextPage,
          limit: pageSize,
          language,
          search,
          locale,
          categories,
        });

        lastMeta.current = res.meta;

        if (
          mode === 'refresh' ||
          mode === 'initial' ||
          nextPage === initialPage
        ) {
          setArticles(res.data);
        } else {
          setArticles(prev => {
            // de-dup by uuid in case API overlaps
            const seen = new Set<string>(prev.map(a => a.uuid));
            const merged = [...prev];
            for (const item of res.data) {
              if (!seen.has(item.uuid)) {
                merged.push(item);
                seen.add(item.uuid);
              }
            }
            return merged;
          });
        }

        setPage(nextPage);
      } catch (e: unknown) {
        setError(
          e instanceof Error
            ? e.message
            : 'Something went wrong while fetching news.',
        );
      } finally {
        inFlight.current = false;
        setIsInitialLoading(false);
        setIsRefreshing(false);
        setIsLoadingMore(false);
      }
    },
    [pageSize, language, search, locale, categories, initialPage],
  );

  const refresh = useCallback(async () => {
    lastMeta.current = null; // reset paging knowledge
    await fetchPage(initialPage, 'refresh');
  }, [fetchPage, initialPage]);

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoadingMore || isRefreshing || isInitialLoading)
      return;
    await fetchPage(page + 1, 'more');
  }, [
    fetchPage,
    hasNextPage,
    isLoadingMore,
    isRefreshing,
    isInitialLoading,
    page,
  ]);

  const retry = useCallback(async () => {
    // Retry the last intent: if no data at all, do initial; else try refresh.
    if (articles.length === 0) {
      await fetchPage(initialPage, 'initial');
    } else {
      await refresh();
    }
  }, [articles.length, fetchPage, initialPage, refresh]);

  useEffect(() => {
    fetchPage(initialPage, 'initial');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    articles,
    isInitialLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasNextPage,
    refresh,
    loadMore,
    retry,
  };
}
