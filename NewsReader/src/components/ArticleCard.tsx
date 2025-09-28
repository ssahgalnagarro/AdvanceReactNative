import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import type { Article } from '../types/news';

export interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const hasImage: boolean = Boolean(article.image_url);

  return (
    <View style={styles.card}>
      {hasImage ? (
        <Image
          source={{ uri: article.image_url as string }}
          style={styles.image}
        />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]} />
      )}
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {article.title}
        </Text>
        {article.snippet ? (
          <Text numberOfLines={3} style={styles.snippet}>
            {article.snippet}
          </Text>
        ) : null}
        <Text style={styles.meta}>
          {new Date(article.published_at).toLocaleString()} • {article.source}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: 8,
    backgroundColor: '#e6e6e6',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
  },
  snippet: {
    fontSize: 13,
    opacity: 0.8,
    marginBottom: 6,
  },
  meta: {
    fontSize: 12,
    opacity: 0.6,
  },
});

export default ArticleCard;
