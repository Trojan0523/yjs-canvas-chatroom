/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:44:43
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-15 23:21:09
 * @Description: 首页组件
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTokens } from '../../contexts/TokenContext';
import { PaperTexture } from '../../assets/ghibli-decorations';
import '../../assets/ghibli-theme.css';

/**
 * 生成随机房间 ID
 */
const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 10);
};

/**
 * 魔法粒子效果 - 特定于主页的额外装饰
 */
const MagicParticles: React.FC = () => {
  // 用于设置动画随机延迟
  const randomDelay = () => Math.random() * 8 + 's';

  return (
    <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
      {/* 漂浮的光粒子 - 森林魔法感 */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: `${Math.random() * 12 + 3}px`,
            height: `${Math.random() * 12 + 3}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.2,
            filter: 'blur(1px)',
            animation: `float ${Math.random() * 15 + 10}s infinite ease-in-out, glow 3s infinite alternate ease-in-out`,
            animationDelay: randomDelay()
          }}
        />
      ))}

      {/* 漂浮的叶子 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`leaf-${i}`}
          className="absolute bg-[#90b77d] bg-opacity-60"
          style={{
            width: `${Math.random() * 30 + 20}px`,
            height: `${Math.random() * 30 + 20}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 30 + 30}%`,
            borderRadius: '0 50% 50% 50%',
            animation: `floatLeaf ${Math.random() * 15 + 20}s infinite ease-in-out`,
            animationDelay: randomDelay(),
            transform: `rotate(${Math.random() * 360}deg)`
          }}
        />
      ))}
    </div>
  );
};

/**
 * 首页组件
 */
function Home() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { tokens, hasTokens } = useTokens();

  // 加入房间
  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      // 未登录时，跳转到登录页面
      navigate('/login', { state: { message: '请先登录后再加入房间', from: '/' } });
      return;
    }

    if (!hasTokens) {
      // 没有入场次数，提示购买
      navigate('/buy-tokens', { state: { message: '您没有足够的入场次数，请先购买' } });
      return;
    }

    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  // 创建新房间
  const handleCreateRoom = () => {
    if (!isAuthenticated) {
      // 未登录时，跳转到登录页面
      navigate('/login', { state: { message: '请先登录后再创建房间', from: '/' } });
      return;
    }

    if (!hasTokens) {
      // 没有入场次数，提示购买
      navigate('/buy-tokens', { state: { message: '您没有足够的入场次数，请先购买' } });
      return;
    }

    const newRoomId = generateRoomId();
    navigate(`/room/${newRoomId}`);
  };

  // 购买入场次数
  const handleBuyTokens = () => {
    navigate('/buy-tokens');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] px-4 py-12 relative overflow-hidden">
      {/* 魔法粒子装饰 */}
      <MagicParticles />

      <div className="w-full max-w-md p-8 space-y-8 ghibli-container relative z-10 backdrop-blur-sm bg-opacity-95">
        <PaperTexture />

        <h2 className="text-3xl font-bold text-center ghibli-heading">
          加入画布聊天室
        </h2>

        {!isAuthenticated && (
          <div className="ghibli-alert ghibli-alert-orange mt-4 text-center">
            <p className="mb-2">您需要先登录才能创建或加入房间</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 ghibli-button"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 ghibli-button ghibli-button-orange"
              >
                注册
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="ghibli-alert ghibli-alert-blue mb-4 text-center">
            欢迎回来！您当前剩余入场次数：{tokens} 次
          </div>
        )}

        {isAuthenticated && !hasTokens && (
          <div className="ghibli-alert ghibli-alert-orange mt-4 text-center">
            您的入场次数已用完，请购买更多入场次数
            <Link to="/buy-tokens" className="underline font-bold ml-2">
              立即购买
            </Link>
          </div>
        )}

        {isAuthenticated && tokens <= 2 && tokens > 0 && (
          <div className="ghibli-alert ghibli-alert-orange opacity-80 mt-4 text-center text-sm">
            <p>您的入场次数不多了（剩余{tokens}次），建议尽快购买更多次数</p>
          </div>
        )}

        <form onSubmit={handleJoinRoom} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="roomId" className="text-sm font-medium text-ghibli-text-dark">
              房间ID
            </label>
            <input
              id="roomId"
              type="text"
              placeholder="输入房间 ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              className="w-full ghibli-input"
            />
          </div>

          <button
            type="submit"
            className={`w-full ghibli-button ${!isAuthenticated || !hasTokens ? 'opacity-60' : ''}`}
            disabled={!isAuthenticated || !hasTokens}
          >
            加入房间
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-ghibli-text-medium my-3">或者</p>

          <button
            onClick={handleCreateRoom}
            disabled={!isAuthenticated || !hasTokens}
            className={`w-full ghibli-button ghibli-button-green ${!isAuthenticated || !hasTokens ? 'opacity-60' : ''}`}
          >
            创建新房间
          </button>
        </div>

        {isAuthenticated && (
          <div className="mt-4 text-center">
            <button
              onClick={handleBuyTokens}
              className="text-ghibli-blue hover:text-ghibli-blue-light text-sm"
            >
              购买更多入场次数
            </button>
          </div>
        )}

        <p className="mt-6 text-sm text-center text-ghibli-text-medium">
          创建或加入房间开始协作绘画和聊天
        </p>
      </div>
    </div>
  );
}

export default Home;
