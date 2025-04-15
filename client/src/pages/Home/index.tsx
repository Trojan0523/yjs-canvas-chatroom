/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:44:43
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-15 20:18:58
 * @Description: 首页组件
 */
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTokens } from '../../contexts/TokenContext';

/**
 * 生成随机房间 ID
 */
const generateRoomId = () => {
  return Math.random().toString(36).substring(2, 10);
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] px-4 py-12 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-700 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-indigo-500/20">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          加入画布聊天室
        </h2>

        {!isAuthenticated && (
          <div className="bg-amber-600 text-white p-4 rounded mt-4 text-center">
            <p className="mb-2">您需要先登录才能创建或加入房间</p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                to="/login"
                className="px-4 py-2 bg-white text-amber-600 rounded hover:bg-gray-100 transition-colors"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 bg-amber-700 text-white rounded hover:bg-amber-800 transition-colors"
              >
                注册
              </Link>
            </div>
          </div>
        )}

        {isAuthenticated && (
          <div className="bg-blue-600 text-white p-4 rounded mb-4 text-center">
            欢迎回来！您当前剩余入场次数：{tokens} 次
          </div>
        )}

        {isAuthenticated && !hasTokens && (
          <div className="bg-amber-600 text-white p-4 rounded mt-4 text-center">
            您的入场次数已用完，请购买更多入场次数
            <Link to="/buy-tokens" className="underline font-bold ml-2">
              立即购买
            </Link>
          </div>
        )}

        {isAuthenticated && tokens <= 2 && tokens > 0 && (
          <div className="bg-amber-500 bg-opacity-40 text-white p-3 rounded mt-4 text-center text-sm">
            <p>您的入场次数不多了（剩余{tokens}次），建议尽快购买更多次数</p>
          </div>
        )}

        <form onSubmit={handleJoinRoom} className="mt-8 space-y-6">
          <div className="space-y-2">
            <label htmlFor="roomId" className="text-sm font-medium text-gray-300">
              房间ID
            </label>
            <input
              id="roomId"
              type="text"
              placeholder="输入房间 ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-600 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
            disabled={!isAuthenticated || !hasTokens}
          >
            加入房间
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 my-3">或者</p>

          <button
            onClick={handleCreateRoom}
            disabled={!isAuthenticated || !hasTokens}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            创建新房间
          </button>
        </div>

        {isAuthenticated && (
          <div className="mt-4 text-center">
            <button
              onClick={handleBuyTokens}
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              购买更多入场次数
            </button>
          </div>
        )}

        <p className="mt-6 text-sm text-center text-gray-400">
          创建或加入房间开始协作绘画和聊天
        </p>
      </div>
    </div>
  );
}

export default Home;
