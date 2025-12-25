import { useMemo, useState } from 'react';

import { ArrowLeft, Edit, Loader2, Trash2 } from 'lucide-react';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useArticleDetail, useDeleteArticle } from '@/hooks/useArticles';
import {
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from '@/hooks/useComments';
import { useAuthStore } from '@/store/auth';

import '@/pages/_article-detail/article-detail.css';

const ArticleDetailPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [commentContent, setCommentContent] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  // Fetch article detail with comments (populateAll=true)
  const {
    data: article,
    isLoading: isLoadingArticle,
    error: articleError,
  } = useArticleDetail({
    documentId: documentId || '',
    populateCommentsUser: true,
  });

  // Create comment mutation
  const createCommentMutation = useCreateComment();

  // Update comment mutation
  const updateCommentMutation = useUpdateComment();

  // Delete comment mutation
  const deleteCommentMutation = useDeleteComment();

  // Delete article mutation
  const deleteArticleMutation = useDeleteArticle();

  // Check if current user owns the article
  const isOwner = useMemo(() => {
    if (!article || !user) return false;
    return article.user?.id === user.id;
  }, [article, user]);

  // Memoized values - get comments from article data
  const comments = useMemo(() => article?.comments || [], [article?.comments]);

  const isLoadingComments = useMemo(() => isLoadingArticle, [isLoadingArticle]);

  const isSubmittingComment = useMemo(
    () => createCommentMutation.isPending,
    [createCommentMutation.isPending],
  );

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!commentContent.trim() || !documentId || !article?.id) return;

    try {
      await createCommentMutation.mutateAsync({
        content: commentContent.trim(),
        articleId: article.id,
      });
      setCommentContent('');
    } catch (error) {
      console.error('Failed to post comment:', error);
    }
  };

  const handleEditArticle = () => {
    if (documentId) {
      navigate(`/article/${documentId}/edit`);
    }
  };

  const handleDeleteArticle = async () => {
    if (
      !documentId ||
      !window.confirm('Are you sure you want to delete this article?')
    )
      return;

    try {
      await deleteArticleMutation.mutateAsync(documentId);
      navigate('/');
    } catch (error) {
      console.error('Failed to delete article:', error);
      alert('Failed to delete article. Please try again.');
    }
  };

  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
  };

  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editingCommentContent.trim()) return;

    try {
      await updateCommentMutation.mutateAsync({
        documentId: commentId,
        content: editingCommentContent.trim(),
      });
      setEditingCommentId(null);
      setEditingCommentContent('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?'))
      return;

    try {
      await deleteCommentMutation.mutateAsync(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  if (isLoadingArticle) {
    return (
      <div className="article-detail-page">
        <div className="article-loading">
          <div className="loading-spinner"></div>
          <p className="text-gray-400">Loading article...</p>
        </div>
      </div>
    );
  }

  if (articleError || !article) {
    return (
      <div className="article-detail-page">
        <div className="article-error">
          <p className="text-destructive">Failed to load article</p>
          <Button onClick={() => navigate('/')} className="cursor-pointer">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-detail-page">
      <div className="container-article-detail-page">
        {/* Article Page Header */}
        <div className="article-detail-page-header">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <FormattedMessage id="common.back" defaultMessage="Back" />
          </Button>
          {isOwner && (
            <div className="article-owner-actions">
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditArticle}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteArticle}
                disabled={deleteArticleMutation.isPending}
                className="text-destructive hover:text-destructive cursor-pointer"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteArticleMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
        </div>

        {/* Article Content */}
        <main className="article-detail-main">
          <article className="article-content-wrapper">
            {/* Cover Image */}
            <div className="article-cover">
              <img
                src={article.cover_image_url || '/placeholder.jpg'}
                alt={article.title}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://placehold.co/1200x600?text=Article';
                }}
              />
            </div>

            {/* Article Header */}
            <div className="article-header">
              <h1 className="article-title">{article.title}</h1>
              <div className="article-author">
                <div className="author-info">
                  <p className="author-name">
                    {article.user?.username || 'Travel Writer'}
                  </p>
                  <p className="article-date">
                    {new Date(article.publishedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="author-avatar">
                  {article.user?.username?.charAt(0).toUpperCase() ||
                    article.title.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            {/* Article Body */}
            <div className="article-body">
              <p className="article-description">{article.description}</p>
            </div>
          </article>

          {/* Comments Section */}
          <section className="comments-section-detail">
            <div className="comments-header">
              <h2 className="comments-title">
                <FormattedMessage
                  id="comments.title"
                  defaultMessage="Comments"
                />
                <Badge variant={'secondary'}>{comments.length}</Badge>
              </h2>
            </div>

            {/* Add Comment Form */}
            <Card className="comment-form-card">
              <CardContent className="comment-form-content">
                <form onSubmit={handleSubmitComment}>
                  <div className="comment-form-header">
                    <div className="form-avatar">
                      {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <Textarea
                      placeholder="Add a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="comment-textarea"
                      rows={3}
                      disabled={isSubmittingComment}
                    />
                  </div>
                  <div className="comment-form-actions">
                    <Button
                      type="submit"
                      disabled={!commentContent.trim() || isSubmittingComment}
                      className="cursor-pointer"
                    >
                      {isSubmittingComment ? (
                        <FormattedMessage
                          id="comments.posting"
                          defaultMessage="Posting..."
                        />
                      ) : (
                        <FormattedMessage
                          id="comments.post"
                          defaultMessage="Post Comment"
                        />
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Comments List */}
            <div className="comments-list">
              {isLoadingComments ? (
                <div className="comments-loading">
                  <div className="loading-spinner-small"></div>
                  <p className="text-sm text-gray-400">Loading comments...</p>
                </div>
              ) : comments.length === 0 ? (
                <div className="comments-empty">
                  <p className="text-gray-400">
                    <FormattedMessage
                      id="comments.empty"
                      defaultMessage="No comments yet. Be the first to comment!"
                    />
                  </p>
                </div>
              ) : (
                comments.map((comment) => {
                  const isCommentOwner = user?.id === comment.user?.id;
                  const isEditing = editingCommentId === comment.documentId;

                  return (
                    <Card key={comment.id} className="comment-item-card">
                      <CardContent className="comment-item-content">
                        <div className="comment-item-header">
                          <div className="comment-avatar">
                            {comment.user?.username?.charAt(0).toUpperCase() ||
                              comment.content.charAt(0).toUpperCase()}
                          </div>
                          <div className="comment-meta">
                            <h4 className="comment-author-name">
                              {comment.user?.username || 'Anonymous User'}
                            </h4>
                            <p className="comment-timestamp">
                              {new Date(comment.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                },
                              )}
                            </p>
                          </div>
                          {isCommentOwner && !isEditing && (
                            <div className="comment-actions">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleEditComment(
                                    comment.documentId,
                                    comment.content,
                                  )
                                }
                                className="cursor-pointer"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteComment(comment.documentId)
                                }
                                disabled={deleteCommentMutation.isPending}
                                className="cursor-pointer"
                              >
                                <Trash2 className="text-destructive h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                        {isEditing ? (
                          <div className="comment-edit-form">
                            <Textarea
                              value={editingCommentContent}
                              onChange={(e) =>
                                setEditingCommentContent(e.target.value)
                              }
                              className="comment-textarea"
                              rows={3}
                            />
                            <div className="comment-edit-actions">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEditComment}
                                disabled={updateCommentMutation.isPending}
                                className="cursor-pointer"
                              >
                                <FormattedMessage
                                  id="common.cancel"
                                  defaultMessage="Cancel"
                                />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleUpdateComment(comment.documentId)
                                }
                                disabled={
                                  !editingCommentContent.trim() ||
                                  updateCommentMutation.isPending
                                }
                                className="cursor-pointer"
                              >
                                {updateCommentMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    <FormattedMessage
                                      id="comments.updating"
                                      defaultMessage="Updating..."
                                    />
                                  </>
                                ) : (
                                  <FormattedMessage
                                    id="common.save"
                                    defaultMessage="Save"
                                  />
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="comment-text">{comment.content}</p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
