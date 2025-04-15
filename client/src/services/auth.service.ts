import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || '';

/**
 * 检查是否在浏览器环境中
 * 用于避免在服务端渲染时访问window对象导致错误
 */
const isBrowser = typeof window !== 'undefined';

/**
 * 用户认证服务
 */
export const AuthService = {
  /**
   * 用户登录
   * @param credentials 登录凭证
   * @returns 认证响应
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || '登录失败');
        } else {
          // If response is not JSON (e.g., HTML error page)
          throw new Error('服务器连接错误 - 请确保API服务器正在运行 (端口3000)');
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new Error('服务器连接错误 - 请确保API服务器正在运行 (端口3000)');
        }
        throw error;
      }
    }

    return response.json();
  },

  /**
   * 用户注册
   * @param userData 用户数据
   * @returns 注册响应
   */
  async register(userData: RegisterRequest): Promise<{ message: string; user: User }> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || '注册失败');
        } else {
          // If response is not JSON (e.g., HTML error page)
          throw new Error('服务器连接错误 - 请确保API服务器正在运行 (端口3000)');
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          throw new Error('服务器连接错误 - 请确保API服务器正在运行 (端口3000)');
        }
        throw error;
      }
    }

    return response.json();
  },

  /**
   * 获取用户个人资料
   * @returns 用户信息
   */
  async getProfile(): Promise<User> {
    const token = isBrowser ? localStorage.getItem('token') : null;

    if (!token) {
      throw new Error('未授权');
    }

    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '获取个人资料失败');
    }

    return response.json();
  },

  /**
   * 保存认证信息到本地存储
   * @param token JWT令牌
   * @param user 用户信息
   */
  saveAuth(token: string, user: User): void {
    if (!isBrowser) return;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * 清除认证信息
   */
  clearAuth(): void {
    if (!isBrowser) return;

    // 清除本地存储的认证信息
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // 清除可能存在的第三方认证cookie
    this.clearOAuthCookies();

    // 如果有其他存储位置，也清除它们
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  },

  /**
   * 清除三方登录相关的cookie
   * 这个方法会尝试清除常见的OAuth相关cookie
   */
  clearOAuthCookies(): void {
    if (!isBrowser) return;

    // 获取所有domains的cookies
    const hostname = window.location.hostname;
    const domains = [
      hostname,
      `.${hostname}`,
      '',
    ];

    // 常见的OAuth cookie名称
    const cookieNames = [
      'github-oauth-state',
      'google-oauth-state',
      'oauth_token',
      'oauth_state',
      'auth_provider',
      'auth_session'
    ];

    // 清除所有可能的组合
    domains.forEach(domain => {
      cookieNames.forEach(name => {
        document.cookie = `${name}=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict;`;
      });
    });

    // 清除所有包含auth, oauth, token关键词的cookie
    const allCookies = document.cookie.split(';');
    for (const cookie of allCookies) {
      const cookieName = cookie.split('=')[0].trim();
      if (
        cookieName.toLowerCase().includes('auth') ||
        cookieName.toLowerCase().includes('oauth') ||
        cookieName.toLowerCase().includes('token') ||
        cookieName.toLowerCase().includes('session') ||
        cookieName.toLowerCase().includes('github') ||
        cookieName.toLowerCase().includes('google')
      ) {
        domains.forEach(domain => {
          document.cookie = `${cookieName}=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; secure; samesite=strict;`;
        });
      }
    }
  },

  /**
   * 从本地存储获取认证信息
   * @returns 令牌和用户信息
   */
  getAuth(): { token: string | null; user: User | null } {
    if (!isBrowser) {
      return { token: null, user: null };
    }

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    return { token, user };
  },

  /**
   * 检查用户是否已认证
   * @returns 是否已认证
   */
  isAuthenticated(): boolean {
    return isBrowser ? !!localStorage.getItem('token') : false;
  },
};
