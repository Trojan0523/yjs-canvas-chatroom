import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema, LoginFormData } from '../../schemas/auth.schema';
import { ZodError } from 'zod';
import Toast from '../../components/Toast';

interface LocationState {
  message?: string;
  from?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error } = useAuth();

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
        <h2 className="text-3xl font-bold text-white mb-6 text-center">登录</h2>

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
              用户名
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
              placeholder="请输入用户名"
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
              className={`w-full py-2 px-4 rounded bg-indigo-600 text-white font-medium ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-indigo-500'
              } transition-colors duration-300`}
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-400">
              还没有账号？
              <Link to="/register" className="text-indigo-400 hover:text-indigo-300 ml-1">
                立即注册
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
