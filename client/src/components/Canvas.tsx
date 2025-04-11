import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import CanvasDraw from 'react-canvas-draw';
import { io, Socket } from 'socket.io-client';
import * as Y from 'yjs';
import { encodeStateAsUpdate, applyUpdate } from 'yjs';

// Add type declaration for react-canvas-draw
declare module 'react-canvas-draw';

const CanvasContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
  overflow: hidden;
`;

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const ColorPicker = styled.input`
  cursor: pointer;
`;

const BrushSize = styled.input`
  width: 100px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3367d6;
  }
`;

const ClearButton = styled(Button)`
  background-color: #ea4335;

  &:hover {
    background-color: #d32f2f;
  }
`;

const BackButton = styled(Button)`
  background-color: #5f6368;

  &:hover {
    background-color: #494c50;
  }
`;

const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UsersCount = styled.div`
  background-color: #34a853;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.875rem;
`;

const DrawingArea = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
  height: calc(100vh - 200px);
`;

const Canvas = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [color, setColor] = useState('#000000');
  const [brushRadius, setBrushRadius] = useState(5);
  const [usersCount, setUsersCount] = useState(1);
  const canvasRef = useRef<CanvasDraw | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const docRef = useRef<Y.Doc | null>(null);
  const isInitialSync = useRef(true);
  const isLocalUpdate = useRef(false);

  // Initialize Yjs document and WebSocket connection
  useEffect(() => {
    if (!roomId) return;

    // Initialize Yjs document
    docRef.current = new Y.Doc();
    const doc = docRef.current;

    // Connect to WebSocket server
    socketRef.current = io('http://localhost:3000');
    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Connected to server');

      // Join the room
      socket.emit('joinRoom', { roomId });

      // Request initial state
      socket.emit('sync', { roomId });
    });

    socket.on('syncState', (data: { update: number[] }) => {
      if (!doc || !canvasRef.current) return;

      try {
        const update = new Uint8Array(data.update);
        applyUpdate(doc, update);

        // Apply the canvas state if there's data
        const canvasData = doc.getMap('canvas').get('data');
        if (canvasData && canvasRef.current && isInitialSync.current) {
          isLocalUpdate.current = true; // Prevent sending update when loading initial state
          canvasRef.current.loadSaveData(canvasData, true);
          isInitialSync.current = false;
          isLocalUpdate.current = false;
        }
      } catch (err) {
        console.error('Error applying sync update:', err);
      }
    });

    socket.on('update', (data: { update: number[] }) => {
      if (!doc || !canvasRef.current) return;

      try {
        const update = new Uint8Array(data.update);
        applyUpdate(doc, update);

        // Apply the canvas state
        const canvasData = doc.getMap('canvas').get('data');
        if (canvasData && canvasRef.current) {
          isLocalUpdate.current = true; // Prevent sending another update when loading
          canvasRef.current.loadSaveData(canvasData, true);
          setTimeout(() => {
            isLocalUpdate.current = false;
          }, 50); // Short delay to ensure the load completes before allowing new updates
        }
      } catch (err) {
        console.error('Error applying update:', err);
      }
    });

    socket.on('userJoined', (data: { usersCount: number }) => {
      setUsersCount(data.usersCount);
    });

    socket.on('userLeft', () => {
      setUsersCount((prev) => Math.max(1, prev - 1));
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    return () => {
      socket.disconnect();
      doc.destroy();
    };
  }, [roomId]);

  // Update the shared document when canvas changes
  const handleCanvasChange = useCallback(() => {
    if (!docRef.current || !canvasRef.current || !socketRef.current || !roomId || isLocalUpdate.current) {
      return; // Skip if this is a local update from receiving data
    }

    const saveData = canvasRef.current.getSaveData();

    try {
      // Update the Yjs document
      const canvasMap = docRef.current.getMap('canvas');
      canvasMap.set('data', saveData);

      // Send the update to the server
      const update = encodeStateAsUpdate(docRef.current);
      socketRef.current.emit('update', { roomId, update: Array.from(update) });
    } catch (err) {
      console.error('Error sending canvas update:', err);
    }
  }, [roomId]);

  const handleClearCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();

      // Explicitly trigger change after clearing
      setTimeout(() => {
        if (canvasRef.current) {
          handleCanvasChange();
        }
      }, 50);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <CanvasContainer>
      <ToolbarContainer>
        <ControlsContainer>
          <ColorPicker
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
          <span>Brush Size:</span>
          <BrushSize
            type="range"
            min="1"
            max="20"
            value={brushRadius}
            onChange={(e) => setBrushRadius(parseInt(e.target.value))}
          />
          <ClearButton onClick={handleClearCanvas}>Clear Canvas</ClearButton>
        </ControlsContainer>
        <RoomInfo>
          <UsersCount>{usersCount} users online</UsersCount>
          <span>Room: {roomId}</span>
          <BackButton onClick={goBack}>Exit Room</BackButton>
        </RoomInfo>
      </ToolbarContainer>
      <DrawingArea>
        <CanvasDraw
          ref={canvasRef}
          brushColor={color}
          brushRadius={brushRadius}
          lazyRadius={0}
          canvasWidth={window.innerWidth - 40}
          canvasHeight={window.innerHeight - 200}
          onChange={handleCanvasChange}
          immediateLoading={true}
        />
      </DrawingArea>
    </CanvasContainer>
  );
};

export default Canvas;
