import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema, LoginFormData } from '../../schemas/auth.schema';
import { ZodError } from 'zod';
import Toast from '../../components/Toast';
import { Github, Loader2 } from 'lucide-react';

interface LocationState {
  message?: string;
  from?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 从location中获取状态信息
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.message) {
      setMessage(state.message);
      setToastMessage(state.message);
      setShowToast(true);
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 清除错误
    if (value.trim()) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    try {
      loginSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof LoginFormData, string>> = {};

        error.errors.forEach((err) => {
          const path = err.path[0] as keyof LoginFormData;
          newErrors[path] = err.message;
        });

        setFormErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) return;

    try {
      await login(formData);

      // 登录成功后导航到原始请求页面或首页
      const state = location.state as LocationState;
      navigate(state?.from || '/');
    } catch (error) {
      // 错误已在 AuthContext 中处理
      console.error('Login failed:', error);
    }
  };

  // 处理OAuth登录
  const handleOAuthLogin = (provider: string) => {
    try {
      setOauthLoading(provider);
      // 重定向到后端OAuth路由
      const baseUrl = window.location.origin;
      const apiUrl = import.meta.env.VITE_API_URL || baseUrl;
      window.location.href = `${apiUrl}/api/auth/${provider}`;
    } catch (error) {
      console.error(`${provider} 登录失败:`, error);
      setOauthLoading(null);
      setToastMessage(`${provider} 登录过程中出现错误，请稍后重试或使用其他登录方式`);
      setShowToast(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Toast
        message={toastMessage}
        type="info"
        show={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      />

      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">欢迎回来</h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-amber-500 text-white p-3 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
              电子邮件地址*
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded bg-gray-700 text-white border ${
                formErrors.username ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:border-indigo-500`}
              placeholder="请输入用户名或邮箱"
            />
            {formErrors.username && (
              <p className="mt-1 text-sm text-red-500">{formErrors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              密码
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded bg-gray-700 text-white border ${
                formErrors.password ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:border-indigo-500`}
              placeholder="请输入密码"
            />
            {formErrors.password && (
              <p className="mt-1 text-sm text-red-500">{formErrors.password}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded bg-emerald-600 text-white font-medium ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-emerald-500'
              } transition-colors duration-300`}
            >
              {loading ? '登录中...' : '继续'}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-400">
              还没有账户？
              <Link to="/register" className="text-emerald-400 hover:text-emerald-300 ml-1">
                注册
              </Link>
            </p>
          </div>
        </form>

        {/* 分隔线 */}
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-600"></div>
          <span className="px-4 text-sm text-gray-400">或</span>
          <div className="flex-grow h-px bg-gray-600"></div>
        </div>

        {/* 社交登录按钮 */}
        <div className="space-y-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={!!oauthLoading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded border bg-white text-gray-800 hover:bg-gray-100 duration-300 ${oauthLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {oauthLoading === 'google' ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            继续使用 Google 登录
          </button>

          <button
            onClick={() => handleOAuthLogin('github')}
            disabled={!!oauthLoading}
            className={`w-full flex items-center justify-center py-3 px-4 rounded border bg-gray-900 border-gray-700 text-white hover:bg-gray-800 duration-300 ${oauthLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {oauthLoading === 'github' ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Github className="h-5 w-5 mr-2" />
            )}
            继续使用 GitHub 登录
          </button>
        </div>

        <div className="text-center mt-6 text-xs text-gray-400">
          <Link to="/terms" className="hover:text-emerald-400">使用条款</Link>
          <span className="mx-2">|</span>
          <Link to="/privacy" className="hover:text-emerald-400">隐私政策</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
