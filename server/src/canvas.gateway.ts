import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AppService } from './app.service';
import * as Y from 'yjs';
import { encodeStateAsUpdate, applyUpdate } from 'yjs';

@WebSocketGateway({
  namespace: 'canvas',
  cors: {
    origin: '*',
  },
})
export class CanvasGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Store Yjs documents per room
  private documents: Map<string, Y.Doc> = new Map();
  // Keep track of last update per user
  private lastUpdateTimestamps: Map<string, Map<string, number>> = new Map();
  // Keep track of active drawing users
  private activeDrawingUsers: Map<string, Set<string>> = new Map();

  constructor(private readonly appService: AppService) {}

  handleConnection(client: Socket): void {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    console.log(`Client disconnected: ${client.id}`);

    // Check if client was in a room and remove them
    const roomId = this.getRoomFromClient(client);
    if (roomId) {
      this.appService.leaveRoom(roomId, client.id);
      client.leave(roomId);

      // Remove client from timestamp tracking
      const roomTimestamps = this.lastUpdateTimestamps.get(roomId);
      if (roomTimestamps) {
        roomTimestamps.delete(client.id);
      }

      // Remove from active drawing users
      const activeUsers = this.activeDrawingUsers.get(roomId);
      if (activeUsers) {
        activeUsers.delete(client.id);
      }

      // Notify others in the room
      const usersCount = this.server.sockets.adapter.rooms.get(roomId)?.size || 0;
      this.server.to(roomId).emit('userLeft', {
        userId: client.id,
        usersCount
      });
    }
  }

  private getRoomFromClient(client: Socket): string | null {
    const rooms = Array.from(client.rooms.values()).filter(room => room !== client.id);
    return rooms.length > 0 ? rooms[0] : null;
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ): void {
    const { roomId } = data;
    console.log(`Client ${client.id} joining room ${roomId}`);

    // Leave current room if in one
    const currentRoom = this.getRoomFromClient(client);
    if (currentRoom) {
      console.log(`Client ${client.id} leaving current room ${currentRoom}`);
      this.appService.leaveRoom(currentRoom, client.id);
      client.leave(currentRoom);

      // Remove from active drawing users
      const activeUsers = this.activeDrawingUsers.get(currentRoom);
      if (activeUsers) {
        activeUsers.delete(client.id);
      }
    }

    // Join new room
    client.join(roomId);
    this.appService.joinRoom(roomId, client.id);
    console.log(`Client ${client.id} joined room ${roomId}`);

    // Initialize Yjs document for this room if it doesn't exist
    if (!this.documents.has(roomId)) {
      console.log(`Creating new Yjs document for room ${roomId}`);
      const doc = new Y.Doc();
      this.documents.set(roomId, doc);
    } else {
      console.log(`Using existing Yjs document for room ${roomId}`);
    }

    // Initialize timestamp tracking for this room if it doesn't exist
    if (!this.lastUpdateTimestamps.has(roomId)) {
      this.lastUpdateTimestamps.set(roomId, new Map());
    }

    // Initialize active drawing users set for this room if it doesn't exist
    if (!this.activeDrawingUsers.has(roomId)) {
      this.activeDrawingUsers.set(roomId, new Set());
    }

    const doc = this.documents.get(roomId);
    const update = encodeStateAsUpdate(doc);
    console.log(`Sending initial state to client ${client.id}, update size: ${update.length}`);

    // Send current state to the new user
    client.emit('syncState', { update: Array.from(update) });

    // Notify others in the room
    const usersCount = this.server.sockets.adapter.rooms.get(roomId)?.size || 0;
    console.log(`Notifying room ${roomId} of new user, total users: ${usersCount}`);
    this.server.to(roomId).emit('userJoined', {
      userId: client.id,
      usersCount
    });
  }

  @SubscribeMessage('sync')
  handleSync(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ): void {
    const { roomId } = data;
    console.log(`Sync request from client ${client.id} for room ${roomId}`);

    if (this.documents.has(roomId)) {
      const doc = this.documents.get(roomId);
      const update = encodeStateAsUpdate(doc);
      console.log(`Sending sync state to client ${client.id}, update size: ${update.length}`);

      // Send current state to the requesting user
      client.emit('syncState', { update: Array.from(update) });
    } else {
      console.log(`No document found for room ${roomId} during sync request`);
    }
  }

  @SubscribeMessage('startDrawing')
  handleStartDrawing(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId?: string }
  ): void {
    const { roomId, userId } = data;
    const userIdentifier = userId || client.id;

    // Add user to active drawing users
    if (!this.activeDrawingUsers.has(roomId)) {
      this.activeDrawingUsers.set(roomId, new Set());
    }
    this.activeDrawingUsers.get(roomId).add(userIdentifier);

    // Broadcast to other clients in the room
    client.to(roomId).emit('userDrawing', { userId: userIdentifier });
  }

  @SubscribeMessage('update')
  handleUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string, update: Uint8Array | number[], userId?: string }
  ): void {
    const { roomId, update, userId } = data;
    const userIdentifier = userId || client.id;
    const currentTime = Date.now();
    const updateSize = Array.isArray(update) ? update.length : update.byteLength;
    console.log(`Update from client ${client.id} for room ${roomId}, size: ${updateSize}`);

    // Rate limiting to prevent too frequent updates from same client
    const roomTimestamps = this.lastUpdateTimestamps.get(roomId);
    if (roomTimestamps) {
      const lastUpdateTime = roomTimestamps.get(client.id) || 0;
      if (currentTime - lastUpdateTime < 30) {  // Debounce 30ms
        console.log(`Rate limiting update from client ${client.id}`);
        return;
      }
      roomTimestamps.set(client.id, currentTime);
    }

    if (!this.documents.has(roomId)) {
      console.log(`Creating new Yjs document for room ${roomId} during update`);
      const doc = new Y.Doc();
      this.documents.set(roomId, doc);
    }

    const doc = this.documents.get(roomId);

    try {
      // Apply the update to the document
      const uint8Update = update instanceof Uint8Array ?
        update : new Uint8Array(update as number[]);
      console.log(`Applying update to Yjs document for room ${roomId}`);
      applyUpdate(doc, uint8Update);

      // Add user to active drawing users if not already
      if (!this.activeDrawingUsers.has(roomId)) {
        this.activeDrawingUsers.set(roomId, new Set());
      }
      this.activeDrawingUsers.get(roomId).add(userIdentifier);

      // Broadcast to all clients in the room except sender
      console.log(`Broadcasting update to room ${roomId} from client ${client.id}`);
      client.to(roomId).emit('update', { update, userId: userIdentifier });
    } catch (err) {
      console.error(`Error applying update for room ${roomId}:`, err);
    }
  }

  @SubscribeMessage('clearCanvas')
  handleClearCanvas(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ): void {
    const { roomId } = data;
    console.log(`Clear canvas request from client ${client.id} for room ${roomId}`);

    if (this.documents.has(roomId)) {
      try {
        // Create a new document to replace the old one
        const newDoc = new Y.Doc();
        this.documents.set(roomId, newDoc);
        console.log(`Cleared canvas for room ${roomId}`);

        // Broadcast the clear event to all clients in the room except sender
        console.log(`Broadcasting clear canvas to room ${roomId}`);
        client.to(roomId).emit('clearCanvas', { userId: client.id });
      } catch (err) {
        console.error(`Error clearing canvas for room ${roomId}:`, err);
      }
    }
  }
}
