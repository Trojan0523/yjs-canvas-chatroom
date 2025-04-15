import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CloudDecoration } from '../assets/ghibli-decorations';

// 导入实际组件
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Canvas from '../pages/Canvas';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Profile from '../pages/Auth/Profile';
import OAuthCallback from '../pages/Auth/OAuthCallback';
import BuyTokens from '../pages/BuyTokens';

// 错误页面组件
const ErrorPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
    <CloudDecoration />

    <div className="ghibli-container p-8 max-w-md w-full text-center relative z-10">
      <h1 className="text-4xl font-bold mb-4 ghibli-heading">出错了！</h1>
      <p className="text-xl mb-8 text-ghibli-text-dark">页面未找到或发生错误</p>
      <button
        onClick={() => window.location.href = '/'}
        className="px-6 py-3 ghibli-button"
      >
        返回首页
      </button>
    </div>
  </div>
);

/**
 * 需要认证的路由包装组件
 */
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  // 加载中显示加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen relative overflow-hidden">
        <CloudDecoration />
        <div className="ghibli-container p-6 relative z-10">加载中...</div>
      </div>
    );
  }

  // 如果未认证，重定向到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 已认证，渲染组件
  return <>{element}</>;
};

/**
 * 仅未认证用户可访问的路由包装组件
 */
const PublicOnlyRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  // 加载中显示加载状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen relative overflow-hidden">
        <CloudDecoration />
        <div className="ghibli-container p-6 relative z-10">加载中...</div>
      </div>
    );
  }

  // 如果已认证，重定向到首页
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 未认证，渲染组件
  return <>{element}</>;
};

/**
 * 路由配置
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'room/:roomId',
        element: <ProtectedRoute element={<Canvas />} />,
      },
      {
        path: 'profile',
        element: <ProtectedRoute element={<Profile />} />,
      },
      {
        path: 'login',
        element: <PublicOnlyRoute element={<Login />} />,
      },
      {
        path: 'register',
        element: <PublicOnlyRoute element={<Register />} />,
      },
      {
        path: 'oauth-callback',
        element: <OAuthCallback />,
      },
      {
        path: 'buy-tokens',
        element: <ProtectedRoute element={<BuyTokens />} />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
];
