/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:44:43
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-11 20:30:00
 * @Description: 首页组件
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

  // 加入房间
  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/room/${roomId}`);
    }
  };

  // 创建新房间
  const handleCreateRoom = () => {
    const newRoomId = generateRoomId();
    navigate(`/room/${newRoomId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] px-4 py-12 bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-700 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-indigo-500/20">
        <h2 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          加入画布聊天室
        </h2>
        
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
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            加入房间
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-400 my-3">或者</p>
          
          <button
            onClick={handleCreateRoom}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
          >
            创建新房间
          </button>
        </div>
        
        <p className="mt-6 text-sm text-center text-gray-400">
          创建或加入房间开始协作绘画和聊天
        </p>
      </div>
    </div>
  );
}

export default Home; 