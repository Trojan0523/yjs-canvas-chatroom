/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:44:43
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-15 18:59:41
 * @Description: 主布局组件
 */
import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Menu, X, ChevronDown } from 'lucide-react';
import TokenDisplay from '../../components/TokenDisplay';
import UserBadge from '../../components/UserBadge';
import { Button } from '../../components/ui/button';
import { CloudBackground } from '../../assets/ghibli-decorations';
import '../../assets/ghibli-theme.css';

/**
 * 森林背景组件 - 全局使用
 */
const GhibliForestBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {/* 渐变背景 - 天空和森林色调 */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#D4E9F7] via-[#e0ece4] to-[#cadecc]"
        style={{ opacity: 0.9 }}
      ></div>

      {/* 树林层 - 使用简化的颜色波浪代替SVG */}
      <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-[#90b77d] bg-opacity-30"
           style={{ borderTopLeftRadius: '70% 100%', borderTopRightRadius: '50% 100%' }}>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-[#90b77d] bg-opacity-50"
           style={{ borderTopLeftRadius: '50% 100%', borderTopRightRadius: '70% 100%' }}>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-[#78a76c] bg-opacity-70"
           style={{ borderTopLeftRadius: '30% 100%', borderTopRightRadius: '40% 100%' }}>
      </div>

      {/* 薄雾效果 */}
      <div className="absolute inset-x-0 bottom-0 h-[15%] bg-white opacity-20 blur-xl"></div>
    </div>
  );
};

/**
 * 主布局组件
 */
function MainLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleProfileDropdown = () => setProfileDropdownOpen(!profileDropdownOpen);

  // 处理滚动事件，用于改变header样式
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 添加自定义的动画样式
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 5px rgba(255, 255, 255, 0.8); }
        50% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.8); }
      }

      @keyframes floatLeaf {
        0% { transform: translate(0, 0) rotate(0deg); }
        25% { transform: translate(5px, 10px) rotate(90deg); }
        50% { transform: translate(10px, 5px) rotate(180deg); }
        75% { transform: translate(5px, 10px) rotate(270deg); }
        100% { transform: translate(0, 0) rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setProfileDropdownOpen(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 全局森林背景 */}
      <GhibliForestBackground />

      {/* 装饰性云朵 */}
      <CloudBackground />

      {/* 页面头部 - 使用固定定位实现更好的吸顶效果 */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
          scrolled
            ? 'py-2 bg-opacity-80 shadow-md backdrop-blur-md border-opacity-40 border-b border-ghibli-blue-light'
            : 'py-4 bg-opacity-30 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
          <Link to="/" className={`font-bold ghibli-heading transition-all duration-300 ${scrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
            协作画布聊天室
          </Link>

          {/* 移动端菜单按钮 */}
          <Button
            onClick={toggleMenu}
            variant="ghost"
            size="icon"
            className="md:hidden text-ghibli-text-dark"
            aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>

          {/* 导航菜单 - 大屏幕 */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" asChild className="text-ghibli-text-dark hover:text-ghibli-text-dark">
                  <Link to="/">首页</Link>
                </Button>

                <TokenDisplay />

                {/* 用户信息和下拉菜单 - 暂时保持简单样式 */}
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center text-ghibli-text-dark hover:text-ghibli-text-dark focus:outline-none"
                  >
                    <div className="flex items-center">
                      <UserBadge user={user} size="sm" />
                      <ChevronDown size={14} className="ml-1 opacity-70" />
                    </div>
                  </button>

                  {/* 下拉菜单 */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 ghibli-container py-1 z-20">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-ghibli-text-dark hover:bg-ghibli-blue-light hover:bg-opacity-20"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        个人资料
                      </Link>
                      <Link
                        to="/buy-tokens"
                        className="block px-4 py-2 text-sm text-ghibli-text-dark hover:bg-ghibli-blue-light hover:bg-opacity-20"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        购买入场次数
                      </Link>
                      <div className="border-t border-ghibli-cloud-shadow my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-ghibli-orange hover:bg-ghibli-blue-light hover:bg-opacity-20 flex items-center"
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
                <Button variant="ghost" asChild className="text-ghibli-text-dark hover:text-ghibli-text-dark">
                  <Link to="/login">登录</Link>
                </Button>
                <Link to="/register" className="ghibli-button">
                  注册
                </Link>
              </>
            )}
          </nav>

          {/* 移动端菜单 */}
          {menuOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div
                className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
                onClick={toggleMenu}
                aria-hidden="true"
              />
              <div className="relative w-4/5 max-w-sm ghibli-container h-full overflow-y-auto p-5">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold ghibli-heading">菜单</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMenu}
                    className="text-ghibli-text-dark"
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
                      <div className="py-3 border-t border-b border-ghibli-cloud-shadow my-2">
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
                        className="w-full justify-start text-ghibli-orange flex items-center"
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
                      <Link
                        to="/register"
                        onClick={toggleMenu}
                        className="block w-full ghibli-button text-center"
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

      {/* 为固定定位的header添加空白占位 */}
      <div className="h-16 md:h-20"></div>

      {/* 页面主内容 */}
      <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
        <Outlet />
      </main>

      {/* 页面底部 */}
      <footer className="py-6 px-4 border-t border-opacity-20 border-ghibli-blue-light relative z-10 backdrop-blur-sm bg-opacity-50">
        <div className="container mx-auto text-center text-ghibli-text-medium text-sm">
          <p>&copy; {new Date().getFullYear()} 协作画布聊天室. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
