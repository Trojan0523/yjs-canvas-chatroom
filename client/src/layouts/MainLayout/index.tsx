/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:44:43
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-14 00:10:53
 * @Description: 主布局组件
 */
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * 主布局组件
 */
function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* 页面头部 */}
      <header className="py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-700">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-bold mb-4 sm:mb-0 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            协作画布聊天室
          </Link>

          <div className="flex items-center space-x-4">
            {/* 导航菜单 */}
            <nav className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-300">欢迎, {user?.username}</span>
                  <Link to="/profile" className="text-gray-300 hover:text-white transition-colors">个人资料</Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                  >
                    退出
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-300 hover:text-white transition-colors">登录</Link>
                  <Link to="/register" className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors">注册</Link>
                </>
              )}
            </nav>

            <a
              href="https://github.com/yourusername/simple-crdt-chatroom-canvas"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer className="py-4 px-4 border-t border-gray-700 text-center text-gray-400 text-sm">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} 协作画布聊天室 | 基于 CRDT 的实时协作应用</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;