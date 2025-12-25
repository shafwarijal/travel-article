import { useEffect, useMemo, useState } from 'react';

import { Loader2 } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { useComments } from '@/hooks/useComments';
import { useAuthStore } from '@/store/auth';
import type { Article } from '@/types/articles';
import type { Category } from '@/types/categories';
import type { Comment } from '@/types/comments';

import '@/pages/_landing/landing.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuthStore();

  // Pagination state for preview articles
  const [previewPage, setPreviewPage] = useState(1);
  const [previousArticles, setPreviousArticles] = useState<Article[]>([]);

  // Pagination state for comments
  const [commentsPage, setCommentsPage] = useState(1);
  const [previousComments, setPreviousComments] = useState<Comment[]>([]);

  // Get selected category from URL or default to null
  const categoryFromUrl = searchParams.get('category');

  // Selected category: use URL param if authenticated, otherwise null
  const selectedCategory = useMemo(() => {
    return isAuthenticated && categoryFromUrl ? categoryFromUrl : null;
  }, [isAuthenticated, categoryFromUrl]);

  // Fetch categories using TanStack Query
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useCategories();

  // Fetch articles based on selected category with pagination
  const {
    data: articlesResponse,
    isLoading: isLoadingArticles,
    error: articlesError,
    isFetching: isFetchingArticles,
  } = useArticles({
    categoryName: selectedCategory,
    page: previewPage,
    pageSize: 3,
  });

  // Fetch latest articles for the separate section
  const { data: latestArticlesResponse, isLoading: isLoadingLatestArticles } =
    useArticles({
      pageSize: 6,
    });

  // Fetch recent comments with pagination
  const {
    data: commentsResponse,
    isLoading: isLoadingComments,
    isFetching: isFetchingComments,
  } = useComments({
    page: commentsPage,
    pageSize: 4,
    sort: 'createdAt:desc',
    populateUser: true,
  });

  const isInitialLoadingArticles =
    isLoadingArticles && previewPage === 1 && previousArticles.length === 0;
  const isLoadingMoreArticles = isFetchingArticles && previewPage > 1;

  const isInitialLoadingComments =
    isLoadingComments && commentsPage === 1 && previousComments.length === 0;
  const isLoadingMoreComments = isFetchingComments && commentsPage > 1;

  // Memoized articles with pagination logic
  const articles = useMemo(() => {
    if (!articlesResponse?.data) return previousArticles;

    const currentArticles = articlesResponse.data;

    if (previewPage === 1) {
      // Reset for new category or initial load
      return currentArticles;
    } else {
      // Append new articles for pagination
      const existingIds = new Set(previousArticles.map((a) => a.id));
      const newArticles = currentArticles.filter((a) => !existingIds.has(a.id));
      return [...previousArticles, ...newArticles];
    }
  }, [articlesResponse, previewPage, previousArticles]);

  // Update previous articles when articles change
  useEffect(() => {
    setPreviousArticles(articles);
  }, [articles]);

  // Check if there are more articles to load
  const hasMorePreviewArticles = useMemo(() => {
    if (!articlesResponse?.meta?.pagination) return false;
    const { page, pageCount } = articlesResponse.meta.pagination;
    return page < pageCount;
  }, [articlesResponse]);

  // Memoized comments with pagination logic
  const comments = useMemo(() => {
    if (!commentsResponse?.data) return previousComments;

    const currentComments = commentsResponse.data;

    if (commentsPage === 1) {
      // Reset for initial load
      return currentComments;
    } else {
      // Append new comments for pagination
      const existingIds = new Set(previousComments.map((c) => c.id));
      const newComments = currentComments.filter((c) => !existingIds.has(c.id));
      return [...previousComments, ...newComments];
    }
  }, [commentsResponse, commentsPage, previousComments]);

  // Update previous comments when comments change
  useEffect(() => {
    setPreviousComments(comments);
  }, [comments]);

  // Check if there are more comments to load
  const hasMoreComments = useMemo(() => {
    if (!commentsResponse?.meta?.pagination) return false;
    const { page, pageCount } = commentsResponse.meta.pagination;
    return page < pageCount;
  }, [commentsResponse]);

  const latestArticles = useMemo(
    () => latestArticlesResponse?.data || [],
    [latestArticlesResponse],
  );

  const hasError = useMemo(
    () => categoriesError || articlesError,
    [categoriesError, articlesError],
  );

  const handleCategoryClick = (categoryName: string | null) => {
    // Reset pagination when category changes
    setPreviewPage(1);
    setPreviousArticles([]);

    // Allow "All" category without authentication
    if (categoryName === null) {
      // Clear category from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('category');
      setSearchParams(newParams, { replace: true });
      return;
    }

    // Require authentication for specific categories
    if (!isAuthenticated) {
      // Redirect to login with category parameter
      navigate(`/login?category=${encodeURIComponent(categoryName)}`);
      return;
    }

    // User is authenticated, set category in URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.set('category', categoryName);
    setSearchParams(newParams, { replace: true });
  };

  const handleLoadMorePreview = () => {
    if (!isFetchingArticles && hasMorePreviewArticles) {
      setPreviewPage((prev) => prev + 1);
    }
  };

  const handleLoadMoreComments = () => {
    if (!isFetchingComments && hasMoreComments) {
      setCommentsPage((prev) => prev + 1);
    }
  };

  const handleArticleClick = (documentId: string) => {
    // Require authentication to view article details
    if (!isAuthenticated) {
      navigate(`/login?redirect=/article/${documentId}`);
      return;
    }

    // User is authenticated, navigate to article
    navigate(`/article/${documentId}`);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section id="hero-section" className="hero-section">
        <div className="container">
          {/* Section Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-5xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
                <FormattedMessage id="landing.hero.title" />
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
              <FormattedMessage id="landing.hero.subtitle" />
            </p>
          </div>

          {/* Preview Card using shadcn Card */}
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader className="card-header">
              {/* All Categories Badge */}
              <Badge
                variant={selectedCategory === null ? 'default' : 'outline'}
                className="cursor-pointer px-5 py-4 text-lg whitespace-nowrap transition-all hover:opacity-80"
                onClick={() => handleCategoryClick(null)}
              >
                <FormattedMessage id="categories.all" />
              </Badge>

              {isLoadingCategories ? (
                <span className="text-muted-foreground whitespace-nowrap">
                  <FormattedMessage id="landing.categories.loading" />
                </span>
              ) : hasError && categories.length === 0 ? (
                <span className="text-destructive whitespace-nowrap">
                  <FormattedMessage id="landing.categories.error" />
                </span>
              ) : (
                categories.map((cat: Category) => (
                  <Badge
                    key={cat.id}
                    variant={
                      selectedCategory === cat.name ? 'default' : 'outline'
                    }
                    className="cursor-pointer px-5 py-4 text-lg whitespace-nowrap transition-all hover:opacity-80"
                    onClick={() => handleCategoryClick(cat.name)}
                  >
                    {cat.name}
                  </Badge>
                ))
              )}
            </CardHeader>

            <CardContent className="card-content-articles">
              {isInitialLoadingArticles ? (
                <div className="articles-loading-inline">
                  <div className="loading-spinner-small"></div>
                  <p className="text-sm text-gray-400">
                    <FormattedMessage id="landing.articles.loading" />
                  </p>
                </div>
              ) : hasError && articles.length === 0 ? (
                <div className="articles-error-inline">
                  <p className="text-destructive text-sm">
                    <FormattedMessage id="landing.articles.error" />
                  </p>
                </div>
              ) : articles.length === 0 ? (
                <div className="articles-empty-inline">
                  <p className="text-sm text-gray-400">
                    <FormattedMessage id="landing.articles.empty" />
                  </p>
                </div>
              ) : (
                <>
                  <div className="articles-preview-grid">
                    {articles.map((article) => (
                      <Card
                        key={article.id}
                        className="article-preview-card"
                        onClick={() => handleArticleClick(article.documentId)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleArticleClick(article.documentId);
                          }
                        }}
                      >
                        <div className="article-preview-image">
                          <img
                            src={article.cover_image_url || '/placeholder.jpg'}
                            alt={article.title}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                'https://placehold.co/400x250?text=Travel';
                            }}
                          />
                        </div>
                        <CardContent className="article-content">
                          <div className="flex flex-col gap-2">
                            <h3 className="article-title">{article.title}</h3>
                            <p className="article-description">
                              {article.description?.substring(0, 120)}
                              {article.description?.length > 120 ? '...' : ''}
                            </p>
                          </div>
                          <div className="article-meta">
                            <span className="article-date">
                              {new Date(article.publishedAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                },
                              )}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="read-more-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleArticleClick(article.documentId);
                              }}
                            >
                              <FormattedMessage id="landing.articles.readMore" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {isLoadingMoreArticles && !hasMorePreviewArticles && (
                    <div className="flex w-full items-center justify-center pt-6">
                      <div className="loading-spinner-small"></div>
                    </div>
                  )}

                  {/* Load More Button */}
                  {hasMorePreviewArticles && !isLoadingMoreArticles && (
                    <div className="mt-6 flex justify-center">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleLoadMorePreview}
                        disabled={isLoadingMoreArticles}
                        className="min-w-[200px]"
                      >
                        <FormattedMessage id="landing.articles.viewMore" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Recent Comments Section */}
      <section id="comments-section" className="comments-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <FormattedMessage id="landing.comments.title" />
            </h2>
            <p className="section-subtitle">
              <FormattedMessage id="landing.comments.subtitle" />
            </p>
          </div>

          {isInitialLoadingComments ? (
            <div className="comments-loading">
              <div className="loading-spinner"></div>
              <p className="text-gray-400">
                <FormattedMessage id="landing.comments.loading" />
              </p>
            </div>
          ) : comments.length === 0 ? (
            <div className="comments-empty">
              <p className="text-gray-400">
                <FormattedMessage id="landing.comments.empty" />
              </p>
            </div>
          ) : (
            <>
              <div className="comments-grid">
                {comments.map((comment) => (
                  <Card key={comment.id} className="comment-card">
                    <CardContent className="comment-content">
                      <div className="comment-header">
                        <div className="comment-avatar">
                          <div className="avatar-circle">
                            {comment.content.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="comment-meta">
                          <h4 className="comment-author">
                            {comment.user?.username || (
                              <FormattedMessage id="landing.comments.anonymous" />
                            )}
                          </h4>
                          <p className="comment-date">
                            {new Date(comment.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <p className="comment-text">
                        {comment.content.length > 150
                          ? `${comment.content.substring(0, 150)}...`
                          : comment.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {isLoadingMoreComments && !hasMoreComments && (
                <div className="flex w-full items-center justify-center pt-6">
                  <div className="loading-spinner-small"></div>
                </div>
              )}

              {/* Load More Comments Button */}
              {hasMoreComments && !isLoadingMoreComments && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLoadMoreComments}
                    disabled={isLoadingMoreComments}
                    className="min-w-[200px] cursor-pointer"
                  >
                    {isLoadingMoreComments ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <FormattedMessage id="common.loading" />
                      </>
                    ) : (
                      <FormattedMessage id="landing.comments.loadMore" />
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles-section" className="articles-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <FormattedMessage id="landing.latestArticles.title" />
            </h2>
            <p className="section-subtitle">
              <FormattedMessage id="landing.latestArticles.subtitle" />
            </p>
          </div>

          {isLoadingLatestArticles ? (
            <div className="articles-loading">
              <div className="loading-spinner"></div>
              <p className="text-gray-400">
                <FormattedMessage id="landing.latestArticles.loading" />
              </p>
            </div>
          ) : latestArticles.length === 0 ? (
            <div className="articles-empty">
              <p className="text-gray-400">
                <FormattedMessage id="landing.latestArticles.empty" />
              </p>
            </div>
          ) : (
            <div className="articles-grid">
              {latestArticles.map((article) => (
                <Card
                  key={article.id}
                  className="article-card"
                  onClick={() => handleArticleClick(article.documentId)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleArticleClick(article.documentId);
                    }
                  }}
                >
                  <div className="article-image-wrapper">
                    <img
                      src={article.cover_image_url || '/placeholder.jpg'}
                      alt={article.title}
                      className="article-image"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          'https://placehold.co/600x400?text=Travel+Article';
                      }}
                    />
                  </div>
                  <CardContent className="article-content">
                    <div className="flex flex-col gap-2">
                      <h3 className="article-title">{article.title}</h3>
                      <p className="article-description">
                        {article.description?.substring(0, 120)}
                        {article.description?.length > 120 ? '...' : ''}
                      </p>
                    </div>
                    <div className="article-meta">
                      <span className="article-date">
                        {new Date(article.publishedAt).toLocaleDateString(
                          'en-US',
                          {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          },
                        )}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="read-more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleArticleClick(article.documentId);
                        }}
                      >
                        <FormattedMessage id="landing.articles.readMore" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="articles-cta">
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer"
            >
              <FormattedMessage id="landing.latestArticles.viewAll" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <p>
              <FormattedMessage id="landing.footer.rights" />
            </p>
            <div className="footer-links">
              <a href="#privacy">
                <FormattedMessage id="landing.footer.privacy" />
              </a>
              <a href="#terms">
                <FormattedMessage id="landing.footer.terms" />
              </a>
              <a href="#contact">
                <FormattedMessage id="landing.footer.contact" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
