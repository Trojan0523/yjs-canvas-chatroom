import { useNavigate, useLocation } from 'react-router-dom';

/**
 * 跳转到房间页面
 * @param navigate useNavigate hook
 * @param roomId 房间ID
 */
export const navigateToRoom = (navigate: ReturnType<typeof useNavigate>, roomId: string) => {
  navigate(`/room/${roomId}`);
};

/**
 * 跳转到首页
 * @param navigate useNavigate hook
 */
export const navigateToHome = (navigate: ReturnType<typeof useNavigate>) => {
  navigate('/');
};

/**
 * 获取当前路由参数中的roomId
 * @param params 包含roomId的对象
 * @returns roomId或null
 */
export const getRoomIdFromParams = <T extends { roomId?: string }>(params: T): string | null => {
  return params.roomId || null;
};

/**
 * 生成新的房间ID
 * @returns 随机生成的房间ID
 */
export const generateRoomId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};

/**
 * 检查当前是否在房间页面
 * @param location useLocation hook结果
 * @returns 是否在房间页面
 */
export const isInRoomPage = (location: ReturnType<typeof useLocation>): boolean => {
  return location.pathname.startsWith('/room/');
};
