import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import ArticleDetail from '@/app/article-detail/page';
import ArticleForm from '@/app/article-form/page';
import Landing from '@/app/landing/page';
import Login from '@/app/login/page';
import Register from '@/app/register/page';
import { MainLayout } from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import IntlProviderWrapper from '@/contexts/IntlContext';

const App = () => (
  <IntlProviderWrapper>
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/article/create"
            element={
              <ProtectedRoute>
                <ArticleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article/:documentId/edit"
            element={
              <ProtectedRoute>
                <ArticleForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article/:documentId"
            element={
              <ProtectedRoute>
                <ArticleDetail />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  </IntlProviderWrapper>
);

export default App;
