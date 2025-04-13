/*
 * @Author: BuXiongYu
 * @Date: 2025-04-11 18:44:43
 * @LastEditors: BuXiongYu
 * @LastEditTime: 2025-04-14 00:07:38
 * @Description: 画布聊天室组件
 */
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import { Stage, Layer, Line } from 'react-konva';
import Konva from 'konva';
import * as Y from 'yjs';
import { encodeStateAsUpdate, applyUpdate } from 'yjs';

// 默认API地址
const API_URL = import.meta.env.VITE_API_URL || '';

// 创建共享类型
interface SharedLine {
  points: number[];
  color: string;
  strokeWidth: number;
}

/**
 * 画布页面组件
 */
function Canvas() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [brushColor, setBrushColor] = useState('#000000');
  const [brushRadius, setBrushRadius] = useState(3);
  const [usersCount, setUsersCount] = useState(0);
  const [lines, setLines] = useState<SharedLine[]>([]);
  const isDrawingRef = useRef(false);
  const stageRef = useRef<Konva.Stage | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const docRef = useRef<Y.Doc | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const linesArrayRef = useRef<Y.Array<Y.Map<any>>>(null!);

  // 更新线条状态
  const updateLinesState = () => {
    if (!linesArrayRef.current) {
      console.error('linesArrayRef is null in updateLinesState');
      return;
    }

    try {
      // 将 Yjs 数组转换为普通数组并更新状态
      const linesArray = linesArrayRef.current.toArray().map(item => {
        const points = item.get('points');
        const color = item.get('color');
        const strokeWidth = item.get('strokeWidth');

        console.log('Line data:', {
          hasPoints: !!points,
          pointsLength: points ? points.length : 0,
          color,
          strokeWidth
        });

        return {
          points: points as number[],
          color: color as string,
          strokeWidth: strokeWidth as number
        };
      });

      console.log(`Updating UI with ${linesArray.length} lines`);
      setLines(linesArray);
    } catch (err) {
      console.error('Error in updateLinesState:', err);
    }
  };

  // 初始化 Yjs 文档和数组
  useEffect(() => {
    console.log('Initializing Yjs document');
    try {
      // 创建新的 Yjs 文档
      const doc = new Y.Doc();
      docRef.current = doc;

      // 创建共享数组用于存储线条
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const yLines = doc.getArray<Y.Map<any>>('lines');
      linesArrayRef.current = yLines;

      console.log('Created Yjs document and array');

      // 监听数组变化
      yLines.observe((event) => {
        console.log('Yjs array changed:', {
          added: event.changes.added.size,
          deleted: event.changes.deleted.size,
          delta: event.changes.delta.length
        });
        updateLinesState();
      });

      console.log('Registered Yjs array observer');
    } catch (err) {
      console.error('Error initializing Yjs:', err);
    }

    return () => {
      // 清理
      console.log('Cleaning up Yjs document');
      if (docRef.current) {
        docRef.current.destroy();
      }
    };
  }, []);

  // 组件挂载时连接WebSocket
  useEffect(() => {
    if (!roomId || !docRef.current) return;

    console.log('Connecting to server with roomId:', roomId);
    // 连接服务器WebSocket - 使用命名空间进行连接
    const socket = io(`${API_URL}/canvas`, {
      path: '/socket.io',
      transports: ['websocket'],
      upgrade: false,
    });
    socketRef.current = socket;

    // 当连接成功时
    socket.on('connect', () => {
      console.log('Connected to server, socket id:', socket.id);

      // 加入房间
      socket.emit('joinRoom', { roomId });
      console.log('Sent joinRoom event for room:', roomId);

      // 加入后请求同步
      setTimeout(() => {
        socket.emit('sync', { roomId });
        console.log('Sent sync request for room:', roomId);

        // 请求房间信息以获取正确的用户数量
        fetch(`${API_URL}/api/rooms/${roomId}`)
          .then(response => response.json())
          .then(data => {
            console.log('Fetched room info:', data);
            if (data && typeof data.usersCount === 'number') {
              setUsersCount(data.usersCount);
            }
          })
          .catch(err => console.error('Error fetching room info:', err));
      }, 500);
    });

    // 监听连接错误
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // 监听断开连接
    socket.on('disconnect', (reason) => {
      console.log('Disconnected from server:', reason);
    });

    // 同步画布状态
    socket.on('syncState', (data: { update: number[] }) => {
      console.log('Received syncState event, update size:', data.update.length);
      if (docRef.current) {
        try {
          // 将二进制数据转换回Uint8Array
          const update = new Uint8Array(data.update);
          console.log('Applying update to Yjs doc');
          applyUpdate(docRef.current, update);

          // 手动触发更新，确保 UI 刷新
          updateLinesState();
          console.log('Synced state from server, lines count:', linesArrayRef.current?.length);
        } catch (err) {
          console.error('Error applying sync update:', err);
        }
      } else {
        console.error('Doc ref is null when receiving syncState');
      }
    });

    // 用户加入房间
    socket.on('userJoined', (data: { userId: string; usersCount: number }) => {
      console.log(`User joined: ${data.userId}, count: ${data.usersCount}`);
      // 确保设置有效的用户数
      if (typeof data.usersCount === 'number' && data.usersCount > 0) {
        setUsersCount(data.usersCount);
      }
    });

    // 用户离开房间
    socket.on('userLeft', (data: { userId: string; usersCount: number }) => {
      console.log(`User left: ${data.userId}, count: ${data.usersCount}`);
      // 确保设置有效的用户数
      if (typeof data.usersCount === 'number' && data.usersCount >= 0) {
        setUsersCount(data.usersCount);
      }
    });

    // 接收更新
    socket.on('update', (data: { update: number[], userId: string }) => {
      console.log(`Received update from ${data.userId}, update size: ${data.update.length}`);
      if (data.userId === socket.id) {
        console.log('Ignoring update from self');
        return; // 避免应用自己的更新
      }

      if (docRef.current) {
        try {
          // 将二进制数据转换回Uint8Array
          const update = new Uint8Array(data.update);
          console.log('Applying remote update to Yjs doc');
          applyUpdate(docRef.current, update);

          // 手动触发更新，确保 UI 刷新
          updateLinesState();
          console.log('Applied remote update, current lines:', linesArrayRef.current?.length);
        } catch (err) {
          console.error('Error applying update:', err);
        }
      } else {
        console.error('Doc ref is null when receiving update');
      }
    });

    // 接收清除画布事件
    socket.on('clearCanvas', () => {
      console.log('Canvas cleared by another user');
      if (linesArrayRef.current) {
        // 清除共享数组
        linesArrayRef.current.delete(0, linesArrayRef.current.length);
        // 确保 UI 更新
        updateLinesState();
      }
    });

    // 断开连接时清理
    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  // 发送更新到服务器
  const sendUpdate = () => {
    if (!docRef.current || !socketRef.current || !roomId) {
      console.error('Cannot send update, missing:', {
        hasDoc: !!docRef.current,
        hasSocket: !!socketRef.current,
        roomId
      });
      return;
    }

    try {
      // 编码状态更新并发送到服务器
      const update = encodeStateAsUpdate(docRef.current);
      console.log('Encoded update size:', update.length);

      socketRef.current.emit('update', {
        roomId,
        update: Array.from(update)
      });
      console.log('Sent update to server');
    } catch (err) {
      console.error('Error sending update:', err);
    }
  };

  // 处理鼠标按下事件
  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    isDrawingRef.current = true;
    console.log('Mouse down event triggered');

    const pos = e.target.getStage()?.getPointerPosition();
    if (pos && linesArrayRef.current && docRef.current) {
      try {
        console.log('Creating new line at position:', pos);
        // 创建一个新的线条对象
        const ymap = new Y.Map();
        ymap.set('points', [pos.x, pos.y]);
        ymap.set('color', brushColor);
        ymap.set('strokeWidth', brushRadius);

        // 添加到共享数组
        linesArrayRef.current.push([ymap]);
        console.log('Added new line to Yjs array, current count:', linesArrayRef.current.length);

        // 发送更新
        sendUpdate();

        // 确保 UI 更新
        updateLinesState();
      } catch (err) {
        console.error('Error in mouse down handler:', err);
      }
    }
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
    if (!isDrawingRef.current) return;

    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point || !linesArrayRef.current || !docRef.current) {
      console.log('Missing data in mouse move:', {
        hasPoint: !!point,
        hasLinesArray: !!linesArrayRef.current,
        hasDoc: !!docRef.current
      });
      return;
    }

    try {
      // 获取最后一条线
      const lastIndex = linesArrayRef.current.length - 1;
      if (lastIndex < 0) {
        console.error('No lines available in mouse move');
        return;
      }

      const lastLineYMap = linesArrayRef.current.get(lastIndex);
      if (!lastLineYMap) {
        console.error('Could not get last line in mouse move');
        return;
      }

      // 获取现有点
      const existingPoints = lastLineYMap.get('points');
      if (!existingPoints || !Array.isArray(existingPoints)) {
        console.error('Invalid points data:', existingPoints);
        return;
      }

      // 添加新点
      const newPoints = [...existingPoints, point.x, point.y];
      // 更新点
      lastLineYMap.set('points', newPoints);
      console.log(`Updated line with new point at (${point.x}, ${point.y}), total points: ${newPoints.length/2}`);

      // 发送更新
      sendUpdate();

      // 确保 UI 更新
      updateLinesState();
    } catch (err) {
      console.error('Error in mouse move handler:', err);
    }
  };

  // 处理鼠标释放事件
  const handleMouseUp = () => {
    isDrawingRef.current = false;

    // 发送最终更新
    if (linesArrayRef.current && linesArrayRef.current.length > 0) {
      sendUpdate();
    }
  };

  // 清除画布
  const handleClearCanvas = () => {
    if (linesArrayRef.current && docRef.current && socketRef.current) {
      // 清除共享数组
      linesArrayRef.current.delete(0, linesArrayRef.current.length);

      // 通知其他用户清除画布
      socketRef.current.emit('clearCanvas', { roomId });

      // 确保 UI 更新
      updateLinesState();
    }
  };

  // 退出房间
  const handleExitRoom = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* 顶部工具栏 */}
      <div className="p-4 bg-gray-800 border-b border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* 绘画工具 */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border-0"
            />
            <span className="text-sm whitespace-nowrap">画笔颜色</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm whitespace-nowrap">画笔大小:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={brushRadius}
              onChange={(e) => setBrushRadius(parseInt(e.target.value))}
              className="accent-indigo-500"
            />
            <span className="text-sm w-6 text-center">{brushRadius}</span>
          </div>

          <button
            onClick={handleClearCanvas}
            className="ml-auto sm:ml-0 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            清除画布
          </button>
        </div>

        {/* 房间信息 */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm">{usersCount} 用户在线</span>
          </div>

          <div className="text-sm">
            房间: <span className="font-mono text-indigo-400">{roomId}</span>
          </div>

          <button
            onClick={handleExitRoom}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
          >
            退出房间
          </button>
        </div>
      </div>

      {/* 画布区域 */}
      <div className="flex-grow overflow-hidden p-4">
        <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden">
          <Stage
            width={window.innerWidth - 40}
            height={window.innerHeight - 200}
            onMouseDown={handleMouseDown}
            onMousemove={handleMouseMove}
            onMouseup={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchMove={handleMouseMove}
            onTouchEnd={handleMouseUp}
            ref={stageRef}
          >
            <Layer>
              {lines.map((line, i) => (
                <Line
                  key={i}
                  points={line.points}
                  stroke={line.color}
                  strokeWidth={line.strokeWidth}
                  tension={0.5}
                  lineCap="round"
                  lineJoin="round"
                  globalCompositeOperation="source-over"
                />
              ))}
            </Layer>
          </Stage>
        </div>
      </div>
    </div>
  );
}

export default Canvas;
