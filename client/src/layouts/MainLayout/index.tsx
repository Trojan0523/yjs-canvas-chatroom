/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:44:43
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-15 18:59:41
 * @Description: 主布局组件
 */
import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Menu, X, ChevronDown } from 'lucide-react';
import TokenDisplay from '../../components/TokenDisplay';
import UserBadge from '../../components/UserBadge';
import { Button } from '../../components/ui/button';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* 页面头部 */}
      <header className="py-4 px-4 sm:px-6 lg:px-8 border-b border-gray-700 sticky top-0 z-10 bg-gray-900 bg-opacity-95 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            协作画布聊天室
          </Link>

          {/* 移动端菜单按钮 */}
          <Button
            onClick={toggleMenu}
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-300"
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* 导航菜单 - 大屏幕 */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild className="text-gray-300 hover:text-white">
                  <Link to="/">首页</Link>
                </Button>

                <TokenDisplay />

                {/* 用户信息和下拉菜单 - 暂时保持简单样式 */}
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center bg-gray-900 text-gray-300 hover:text-white focus:outline-none"
                  >
                    <div className="flex items-center">
                      <UserBadge user={user} size="sm" />
                      <ChevronDown size={14} className="ml-1 opacity-70" />
                    </div>
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
                      <Link
                        to="/buy-tokens"
                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        购买入场次数
                      </Link>
                      <div className="border-t border-gray-700 my-1"></div>
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
                <Button variant="ghost" asChild className="text-gray-300 hover:text-white">
                  <Link to="/login">登录</Link>
                </Button>
                <Button variant="default" asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link to="/register">注册</Link>
                </Button>
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMenu}
                    className="text-gray-400"
                  >
                    <X size={24} />
                  </Button>
                </div>

                <div className="space-y-4">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link
                      to="/"
                      onClick={toggleMenu}
                    >
                      首页
                    </Link>
                  </Button>

                  {isAuthenticated ? (
                    <>
                      {/* 移动端用户信息 */}
                      <div className="py-3 border-t border-b border-gray-700 my-2">
                        <div className="mb-3">
                          <UserBadge user={user} showEmail={true} size="lg" />
                        </div>

                        {/* 显示用户的入场次数 - 移动端 */}
                        <div className="mt-2">
                          <TokenDisplay />
                        </div>
                      </div>

                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link
                          to="/profile"
                          onClick={toggleMenu}
                        >
                          个人资料
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                        className="w-full justify-start text-red-400 hover:text-red-300 flex items-center"
                      >
                        <LogOut size={16} className="mr-2" />
                        退出登录
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link
                          to="/login"
                          onClick={toggleMenu}
                        >
                          登录
                        </Link>
                      </Button>
                      <Button variant="default" className="w-full justify-start" asChild>
                        <Link
                          to="/register"
                          onClick={toggleMenu}
                        >
                          注册
                        </Link>
                      </Button>
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
