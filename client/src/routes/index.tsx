import { RouteObject } from 'react-router-dom';
import Home from '../pages/Home';
import Canvas from '../pages/Canvas';
import ErrorPage from '../pages/Error';
import MainLayout from '../layouts/MainLayout';

// 定义路由配置
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'room/:roomId',
        element: <Canvas />
      },
      {
        // 捕获所有未匹配的路由
        path: '*',
        element: <ErrorPage />
      }
    ]
  }
];
