import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { AuthState, LoginRequest, RegisterRequest } from '../types/auth.types';
import { AuthService } from '../services/auth.service';

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
  const logout = () => {
    AuthService.clearAuth();
    setState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
      error: null,
    });
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