import { useEffect, useMemo } from 'react';

import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  useArticleDetail,
  useCreateArticle,
  useUpdateArticle,
} from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { articleSchema, type ArticleFormData } from '@/lib/validations/article';
import { useAuthStore } from '@/store/auth';
import { zodResolver } from '@hookform/resolvers/zod';

import '@/pages/_article-form/article-form.css';

const ArticleFormPage = () => {
  const navigate = useNavigate();
  const { documentId } = useParams<{ documentId?: string }>();
  const { user } = useAuthStore();

  const isEditMode = !!documentId;

  // Fetch article data if editing
  const {
    data: article,
    isLoading: isLoadingArticle,
    error: articleError,
  } = useArticleDetail({
    documentId: documentId || '',
    populateAll: true,
  });

  // Fetch categories
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  // Mutations
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  // React Hook Form
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    watch,
    reset,
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      cover_image_url: '',
      category: '',
    },
  });

  // Watch form values
  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedCoverImageUrl = watch('cover_image_url');
  const watchedCategory = watch('category');

  // Initialize form with article data in edit mode
  useEffect(() => {
    if (isEditMode && article) {
      reset({
        title: article.title,
        description: article.description,
        cover_image_url: article.cover_image_url,
        category: article.category?.documentId || '',
      });
    }
  }, [isEditMode, article, reset]);

  // Check if user owns the article (for edit mode)
  const isOwner = useMemo(() => {
    if (!isEditMode || !article || !user) return false;
    return article.user?.id === user.id;
  }, [isEditMode, article, user]);

  // Redirect if not owner in edit mode
  useEffect(() => {
    if (isEditMode && article && !isLoadingArticle && !isOwner) {
      navigate('/');
    }
  }, [isEditMode, article, isLoadingArticle, isOwner, navigate]);

  const handleSubmit = async (data: ArticleFormData) => {
    const articleData = {
      title: data.title,
      description: data.description,
      cover_image_url: data.cover_image_url,
      category:
        data.category && data.category !== 'none' ? data.category : undefined,
    };

    try {
      if (isEditMode && documentId) {
        await updateArticle.mutateAsync({
          documentId,
          data: articleData,
        });
      } else {
        await createArticle.mutateAsync(articleData);
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to save article:', error);
    }
  };

  const isSubmitting = createArticle.isPending || updateArticle.isPending;
  const isLoading = isLoadingArticle || isLoadingCategories;

  // Determine if submit button should be enabled
  const isSubmitEnabled = isEditMode ? isValid && isDirty : isValid;

  // Show loading state
  if (isLoading && isEditMode) {
    return (
      <div className="article-form-page">
        <div className="form-container">
          <div className="loading-state">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>
              <FormattedMessage
                id="common.loading"
                defaultMessage="Loading..."
              />
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (articleError && isEditMode) {
    return (
      <div className="article-form-page">
        <div className="form-container">
          <Card>
            <CardContent className="error-state">
              <h2>
                <FormattedMessage id="common.error" defaultMessage="Error" />
              </h2>
              <p className="text-muted-foreground">
                {articleError.message || 'An error occurred'}
              </p>
              <Button onClick={() => navigate('/')} className="cursor-pointer">
                <ArrowLeft className="mr-2 h-4 w-4" />
                <FormattedMessage id="common.back" defaultMessage="Back" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="article-form-page">
      <div className="container-article-form-page">
        <div className="article-form-page-header">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            <FormattedMessage id="common.back" defaultMessage="Back" />
          </Button>
          <h1 className="form-title">
            {isEditMode ? (
              <FormattedMessage
                id="article.edit"
                defaultMessage="Edit Article"
              />
            ) : (
              <FormattedMessage
                id="article.create"
                defaultMessage="Create Article"
              />
            )}
          </h1>
        </div>

        <main className="article-form-main">
          <Card className="article-form-card">
            <CardContent className="article-form-content">
              <form
                onSubmit={handleFormSubmit(handleSubmit)}
                className="article-form"
              >
                <Field>
                  <Label htmlFor="title">
                    <FormattedMessage
                      id="article.title"
                      defaultMessage="Title"
                    />{' '}
                    *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter article title"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.title.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="description">
                    <FormattedMessage
                      id="article.description"
                      defaultMessage="Description"
                    />{' '}
                    *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Enter article description"
                    rows={6}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.description.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="coverImage">
                    <FormattedMessage
                      id="article.coverImage"
                      defaultMessage="Cover Image URL"
                    />{' '}
                    *
                  </Label>
                  <Input
                    id="coverImage"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    {...register('cover_image_url')}
                  />
                  {errors.cover_image_url && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.cover_image_url.message}
                    </p>
                  )}
                  {watchedCoverImageUrl && !errors.cover_image_url && (
                    <div className="image-preview">
                      <img
                        src={watchedCoverImageUrl}
                        alt="Cover preview"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            'https://placehold.co/600x400?text=Invalid+URL';
                        }}
                      />
                    </div>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="category">
                    <FormattedMessage
                      id="article.category"
                      defaultMessage="Category"
                    />
                  </Label>
                  <Select
                    value={watchedCategory}
                    onValueChange={(value) =>
                      setValue('category', value, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <FormattedMessage
                          id="article.noCategory"
                          defaultMessage="No Category"
                        />
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.documentId}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-destructive mt-1 text-sm">
                      {errors.category.message}
                    </p>
                  )}
                </Field>

                <div className="form-actions">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    disabled={isSubmitting}
                    className="cursor-pointer"
                  >
                    <FormattedMessage
                      id="common.cancel"
                      defaultMessage="Cancel"
                    />
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isSubmitEnabled || isSubmitting}
                    className="cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {isEditMode ? (
                          <FormattedMessage
                            id="article.updating"
                            defaultMessage="Updating..."
                          />
                        ) : (
                          <FormattedMessage
                            id="article.creating"
                            defaultMessage="Creating..."
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {isEditMode ? (
                          <FormattedMessage
                            id="article.update"
                            defaultMessage="Update Article"
                          />
                        ) : (
                          <FormattedMessage
                            id="article.create"
                            defaultMessage="Create Article"
                          />
                        )}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ArticleFormPage;
