/*
 * @Author: BuXiongYu
 * @Date: 2025-04-15 17:52:23
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-15 18:25:22
 * @Description: 请填写简介
 */
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../types/auth.types';

const OAuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // 从URL参数获取token和用户信息
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userString = params.get('user');

        if (!token || !userString) {
          setError('认证失败：缺少必要的认证信息');
          return;
        }

        let user: User;
        try {
          user = JSON.parse(userString);
          console.log('user', user);
        } catch (err) {
          setError('认证失败：无法解析用户信息');
          console.error('OAuth callback error:', err);
          return;
        }

        // 将认证信息保存到本地存储
        localStorage.setItem('token', token);
        localStorage.setItem('user', userString);

        // 页面刷新，使AuthContext加载新的认证状态
        window.location.href = '/';
      } catch (err) {
        console.error('OAuth callback error:', err);
        setError('处理OAuth认证时出错');
      }
    };

    if (!isAuthenticated) {
      processOAuthCallback();
    } else {
      // 如果已经认证，直接跳转到首页
      navigate('/');
    }
  }, [location, navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md text-center">
        {error ? (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">认证错误</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition-colors"
            >
              返回登录
            </button>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-white mb-4">处理中...</h2>
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
            <p className="text-gray-300">登录成功，正在跳转...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
