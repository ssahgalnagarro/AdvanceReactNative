import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNewsFeed } from '../hooks/useNewsFeed';
import type { Article } from '../types/news';
import ArticleCard from '../components/ArticleCard';

const PAGE_SIZE: number = 10;

const NewsListScreen: React.FC = () => {
  const {
    articles,
    isInitialLoading,
    isRefreshing,
    isLoadingMore,
    error,
    hasNextPage,
    refresh,
    loadMore,
    retry,
  } = useNewsFeed({ pageSize: PAGE_SIZE, language: 'en' });

  const renderItem: ListRenderItem<Article> = useCallback(
    ({ item }) => <ArticleCard article={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Article) => item.uuid, []);

  const ListEmptyComponent = useCallback(() => {
    if (isInitialLoading) return null; // handled by full-screen loader
    if (error)
      return (
        <View style={styles.center}>
          <Text style={styles.msg}>Failed to load news.</Text>
          <TouchableOpacity onPress={retry} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
          <Text style={styles.detail}>{error}</Text>
        </View>
      );
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>No articles found.</Text>
      </View>
    );
  }, [error, isInitialLoading, retry]);

  const ListFooterComponent = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator />
      </View>
    );
  }, [isLoadingMore]);

  if (isInitialLoading) {
    return (
      <SafeAreaView style={styles.full}>
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Loading news…</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.full}>
      <FlatList
        data={articles}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={articles.length === 0 ? styles.full : undefined}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} />
        }
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          // Guarded in hook (checks hasNextPage + in-flight)
          if (hasNextPage) {
            void loadMore();
          }
        }}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        // Performance hints:
        initialNumToRender={8}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  full: { flex: 1 },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: '#eee' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  msg: { marginTop: 8, fontSize: 16, fontWeight: '500' },
  detail: { marginTop: 6, fontSize: 12, opacity: 0.6, textAlign: 'center' },
  footer: { paddingVertical: 16 },
  loadingText: { marginTop: 8, fontSize: 14 },
  retryBtn: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#111',
  },
  retryText: { color: '#fff', fontWeight: '600' },
});

export default NewsListScreen;
