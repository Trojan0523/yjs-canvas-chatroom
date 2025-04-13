import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Toast from '../../components/Toast';
import { registerSchema, RegisterFormData } from '../../schemas/auth.schema';
import { ZodError } from 'zod';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [success, setSuccess] = useState('');
  const [showToast, setShowToast] = useState(false);

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
      registerSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};

        error.errors.forEach((err) => {
          const path = err.path[0] as keyof RegisterFormData;
          newErrors[path] = err.message;
        });

        setFormErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      // 显示验证错误的 toast
      setSuccess('');
      setShowToast(false);
      return;
    }

    try {
      // 提取服务器需要的字段
      const registerData = {
        username: formData.username,
        email: formData.email,
        password: formData.password
      };

      await register(registerData);
      setSuccess('注册成功！即将跳转到登录页面...');
      setShowToast(true);

      // 延迟后跳转到登录页
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      // 错误已在 AuthContext 中处理
      console.error('Registration failed:', error);
      setShowToast(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <Toast
        message={success}
        type="success"
        show={showToast}
        onClose={() => setShowToast(false)}
        duration={2500}
      />

      <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">注册</h2>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 text-white p-3 rounded mb-4">
            {success}
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
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              邮箱
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded bg-gray-700 text-white border ${
                formErrors.email ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:border-indigo-500`}
              placeholder="请输入邮箱"
            />
            {formErrors.email && (
              <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
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
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
              确认密码
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded bg-gray-700 text-white border ${
                formErrors.confirmPassword ? 'border-red-500' : 'border-gray-600'
              } focus:outline-none focus:border-indigo-500`}
              placeholder="请再次输入密码"
            />
            {formErrors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{formErrors.confirmPassword}</p>
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
              {loading ? '注册中...' : '注册'}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-400">
              已有账号？
              <Link to="/login" className="text-indigo-400 hover:text-indigo-300 ml-1">
                立即登录
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
