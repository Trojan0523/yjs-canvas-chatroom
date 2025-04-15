/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:44:43
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-14 09:48:13
 * @Description: 主布局组件
 */
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';
import { LogOut, Menu, X, User as UserIcon, ChevronDown } from 'lucide-react';

/**
 * 主布局组件
 */
function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setProfileDropdownOpen(false);
  };

  // 获取显示名称 - 优先使用OAuth提供的displayName
  const displayName = user?.displayName || user?.username || '用户';

  // 检查是否是OAuth用户以及具体提供商
  const isGithubUser = user?.provider === 'github';
  const isGoogleUser = user?.provider === 'google';

  // 用户头像 - 如果有OAuth提供的头像则使用它
  const userAvatar = user?.photo;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* 页面头部 */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-700 sticky top-0 z-10 bg-gray-900 bg-opacity-95 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            协作画布聊天室
          </Link>

          {/* 移动端菜单按钮 */}
          <button
            className="block md:hidden text-gray-300"
            onClick={toggleMenu}
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* 导航菜单 - 大屏幕 */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">首页</Link>

                {/* 用户信息和下拉菜单 */}
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none"
                  >
                    {userAvatar ? (
                      <img
                        src={userAvatar}
                        alt={displayName}
                        className="w-8 h-8 rounded-full object-cover border border-gray-600"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                        <UserIcon size={16} />
                      </div>
                    )}
                    <span className="flex items-center">
                      {isGithubUser && (
                        <span className="mr-1 text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">
                          GitHub
                        </span>
                      )}
                      {isGoogleUser && (
                        <span className="mr-1 text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">
                          Google
                        </span>
                      )}
                      {displayName}
                      <ChevronDown size={14} className="ml-1" />
                    </span>
                  </button>

                  {/* 下拉菜单 */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20 border border-gray-700">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        个人资料
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 flex items-center"
                      >
                        <LogOut size={14} className="mr-2" />
                        退出登录
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white transition-colors">登录</Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors">注册</Link>
              </>
            )}
          </nav>

          {/* 移动端菜单 */}
          {menuOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={toggleMenu}
                aria-hidden="true"
              />
              <div className="relative w-4/5 max-w-sm bg-gray-800 h-full overflow-y-auto p-5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">菜单</h2>
                  <button onClick={toggleMenu} className="text-gray-400">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <Link
                    to="/"
                    className="block py-2 text-gray-300 hover:text-white"
                    onClick={toggleMenu}
                  >
                    首页
                  </Link>

                  {isAuthenticated ? (
                    <>
                      {/* 移动端用户信息 */}
                      <div className="py-3 border-t border-b border-gray-700 my-2">
                        <div className="flex items-center space-x-3 mb-3">
                          {userAvatar ? (
                            <img
                              src={userAvatar}
                              alt={displayName}
                              className="w-10 h-10 rounded-full object-cover border border-gray-600"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                              <UserIcon size={18} />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center">
                              {isGithubUser && (
                                <span className="mr-1 text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">
                                  GitHub
                                </span>
                              )}
                              {isGoogleUser && (
                                <span className="mr-1 text-xs px-1.5 py-0.5 bg-gray-700 rounded text-gray-300">
                                  Google
                                </span>
                              )}
                            </div>
                            <div className="font-medium">{displayName}</div>
                            <div className="text-xs text-gray-400">{user?.email}</div>
                          </div>
                        </div>
                      </div>

                      <Link
                        to="/profile"
                        className="block py-2 text-gray-300 hover:text-white"
                        onClick={toggleMenu}
                      >
                        个人资料
                      </Link>

                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                        className="w-full text-left block py-2 text-red-400 hover:text-red-300 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        退出登录
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block py-2 text-gray-300 hover:text-white"
                        onClick={toggleMenu}
                      >
                        登录
                      </Link>
                      <Link
                        to="/register"
                        className="block py-2 text-gray-300 hover:text-white"
                        onClick={toggleMenu}
                      >
                        注册
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 页面主内容 */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* 页面底部 */}
      <footer className="py-6 px-4 bg-gray-900 border-t border-gray-800">
        <div className="container mx-auto text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} 协作画布聊天室. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
