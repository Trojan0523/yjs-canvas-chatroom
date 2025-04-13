import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 如果未认证，重定向到登录页
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // 获取用户资料 - 简化版本，仅使用 AuthContext 中的用户数据
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        // 异步操作，例如验证 token 有效性
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        setError(err instanceof Error ? err.message : '无法获取个人资料');
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">个人资料</h1>
          </div>

          {error && (
            <div className="bg-red-500 text-white p-4">
              {error}
            </div>
          )}

          <div className="p-6">
            {user && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">基本信息</h2>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">用户名</p>
                        <p className="text-white">{user.username}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">邮箱</p>
                        <p className="text-white">{user.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">ID</p>
                        <p className="text-white font-mono text-sm">{user.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">状态</p>
                        <p className="text-white">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          {user.isActive ? '活跃' : '未激活'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    返回首页
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 