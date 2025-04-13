import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Canvas from '../pages/Canvas';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
// import * as Y from 'yjs';
import { io } from 'socket.io-client';

// Mock hooks and context
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ roomId: 'test-room-123' }),
    useNavigate: () => vi.fn(),
  };
});

// Get mocked instances
const mockIo = vi.mocked(io);
const mockSocket = mockIo() as any;

describe('Canvas Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the Canvas component correctly', () => {
    render(
      <MemoryRouter initialEntries={['/room/test-room-123']}>
        <Routes>
          <Route path="/room/:roomId" element={<Canvas />} />
        </Routes>
      </MemoryRouter>
    );

    // Check if basic elements are rendered
    expect(screen.getByText('画笔颜色')).toBeInTheDocument();
    expect(screen.getByText('画笔大小:')).toBeInTheDocument();
    expect(screen.getByText('清除画布')).toBeInTheDocument();
    expect(screen.getByText(/房间:/)).toBeInTheDocument();
    expect(screen.getByText('退出房间')).toBeInTheDocument();
  });

  it('initializes Yjs document and socket connection', () => {
    render(
      <MemoryRouter initialEntries={['/room/test-room-123']}>
        <Routes>
          <Route path="/room/:roomId" element={<Canvas />} />
        </Routes>
      </MemoryRouter>
    );

    // Verify socket connections
    expect(mockIo).toHaveBeenCalled();
    expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('syncState', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('userJoined', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('userLeft', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('update', expect.any(Function));
    expect(mockSocket.on).toHaveBeenCalledWith('clearCanvas', expect.any(Function));
  });

  it('handles mouse events and updates drawing', () => {
    render(
      <MemoryRouter initialEntries={['/room/test-room-123']}>
        <Routes>
          <Route path="/room/:roomId" element={<Canvas />} />
        </Routes>
      </MemoryRouter>
    );

    // Get the "Stage" element (mocked Konva Stage)
    const stageContainer = document.querySelector('.w-full.h-full');
    expect(stageContainer).not.toBeNull();

    if (stageContainer) {
      // Simulate mouse down, move, and up events
      fireEvent.mouseDown(stageContainer, { clientX: 100, clientY: 100 });
      
      // Verify socket emit was called for update
      expect(mockSocket.emit).toHaveBeenCalledWith('update', expect.any(Object));
      
      // Clear socket emit mock for next verification
      mockSocket.emit.mockClear();
      
      fireEvent.mouseMove(stageContainer, { clientX: 120, clientY: 120 });
      
      // Verify another update was sent
      expect(mockSocket.emit).toHaveBeenCalledWith('update', expect.any(Object));
      
      mockSocket.emit.mockClear();
      
      fireEvent.mouseUp(stageContainer);
      
      // Verify final update was sent
      expect(mockSocket.emit).toHaveBeenCalledWith('update', expect.any(Object));
    }
  });

  it('handles clear canvas functionality', () => {
    render(
      <MemoryRouter initialEntries={['/room/test-room-123']}>
        <Routes>
          <Route path="/room/:roomId" element={<Canvas />} />
        </Routes>
      </MemoryRouter>
    );

    // Find and click the clear button
    const clearButton = screen.getByText('清除画布');
    fireEvent.click(clearButton);

    // Verify clear canvas event was sent
    expect(mockSocket.emit).toHaveBeenCalledWith('clearCanvas', { roomId: 'test-room-123' });
  });
}); 