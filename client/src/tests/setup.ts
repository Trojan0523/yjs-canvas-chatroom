import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Mock Socket.IO client
vi.mock('socket.io-client', () => {
  const socketMock = {
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    id: 'test-socket-id',
  };

  return {
    io: vi.fn(() => socketMock),
  };
});

// Mock Konva
vi.mock('konva', () => {
  return {
    default: {
      Stage: vi.fn(),
      Layer: vi.fn(),
      Line: vi.fn(),
    },
  };
});

// Mock Yjs
vi.mock('yjs', () => {
  const YMapMock = vi.fn(() => ({
    set: vi.fn(),
    get: vi.fn(),
  }));

  const YArrayMock = vi.fn(() => ({
    observe: vi.fn(),
    push: vi.fn(),
    toArray: vi.fn(() => []),
    get: vi.fn(() => new YMapMock()),
    delete: vi.fn(),
    length: 0,
  }));

  const YDocMock = vi.fn(() => ({
    getArray: vi.fn(() => new YArrayMock()),
    destroy: vi.fn(),
  }));

  return {
    Doc: YDocMock,
    Map: YMapMock,
    Array: YArrayMock,
    encodeStateAsUpdate: vi.fn(() => new Uint8Array(0)),
    applyUpdate: vi.fn(),
  };
});

// Clean up after each test
afterEach(() => {
  cleanup();
  vi.resetAllMocks();
}); 