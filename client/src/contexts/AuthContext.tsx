import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthState, LoginRequest, RegisterRequest } from '../types/auth.types';
import { AuthService } from '../services/auth.service';

// 检查是否在浏览器环境
const isBrowser = typeof window !== 'undefined';

// 定义上下文类型
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
}

// 创建认证上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 创建认证上下文提供者组件
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 初始认证状态
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
    error: null,
  });

  // 初始化时检查本地存储中是否有认证信息
  useEffect(() => {
    // 确保只在客户端执行
    if (!isBrowser) {
      setState(prevState => ({ ...prevState, loading: false }));
      return;
    }

    const initAuth = () => {
      try {
        const { token, user } = AuthService.getAuth();
        if (token && user) {
          setState({
            isAuthenticated: true,
            user,
            token,
            loading: false,
            error: null,
          });
        } else {
          setState(prevState => ({ ...prevState, loading: false }));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setState({
          isAuthenticated: false,
          user: null,
          token: null,
          loading: false,
          error: 'Authentication failed',
        });
      }
    };

    initAuth();
  }, []);

  // 登录方法
  const login = async (credentials: LoginRequest) => {
    try {
      setState(prevState => ({ ...prevState, loading: true, error: null }));

      const response = await AuthService.login(credentials);
      const { access_token, user } = response;

      AuthService.saveAuth(access_token, user);

      setState({
        isAuthenticated: true,
        user,
        token: access_token,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: error instanceof Error ? error.message : '登录失败',
      }));
      throw error;
    }
  };

  // 注册方法
  const register = async (userData: RegisterRequest) => {
    try {
      setState(prevState => ({ ...prevState, loading: true, error: null }));

      await AuthService.register(userData);

      setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    } catch (error) {
      setState(prevState => ({
        ...prevState,
        loading: false,
        error: error instanceof Error ? error.message : '注册失败',
      }));
      throw error;
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      setState(prevState => ({ ...prevState, loading: true }));

      // 获取当前用户的提供商信息
      const isOAuthUser = !!state.user?.provider;

      // 通知后端退出登录(可选功能)
      try {
        if (isBrowser && state.token) {
          const API_URL = import.meta.env.VITE_API_URL || '';
          // 发送退出请求但不等待响应，避免阻塞用户体验
          fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${state.token}`,
              'Content-Type': 'application/json',
            },
          }).catch(e => console.error('Backend logout error:', e));
        }
      } catch (e) {
        console.error('Error during backend logout:', e);
      }

      // 清除本地认证信息
      AuthService.clearAuth();

      // 如果是OAuth用户且在浏览器环境，尝试重定向到OAuth提供商注销页面
      if (isBrowser && isOAuthUser && state.user?.provider === 'github') {
        // 可选：重定向到 GitHub 注销页面
        // 注：大多数情况下，这只会注销GitHub会话，而不是你的应用
        // window.open('https://github.com/logout', '_blank');
      }

      // 重置认证状态
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      // 即使出错也清除本地状态
      AuthService.clearAuth();
      setState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
        error: null,
      });
    }
  };

  // 提供上下文值
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定义Hook用于消费认证上下文
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
