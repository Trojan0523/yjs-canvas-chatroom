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
  cors: {
    origin: '*',
  },
})
export class CanvasGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  // Store Yjs documents per room
  private documents: Map<string, Y.Doc> = new Map();

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

      // Notify others in the room
      this.server.to(roomId).emit('userLeft', { userId: client.id });
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

    // Leave current room if in one
    const currentRoom = this.getRoomFromClient(client);
    if (currentRoom) {
      this.appService.leaveRoom(currentRoom, client.id);
      client.leave(currentRoom);
    }

    // Join new room
    client.join(roomId);
    this.appService.joinRoom(roomId, client.id);

    // Initialize Yjs document for this room if it doesn't exist
    if (!this.documents.has(roomId)) {
      const doc = new Y.Doc();
      this.documents.set(roomId, doc);
    }

    const doc = this.documents.get(roomId);
    const update = encodeStateAsUpdate(doc);

    // Send current state to the new user
    client.emit('syncState', { update: Array.from(update) });

    // Notify others in the room
    this.server.to(roomId).emit('userJoined', {
      userId: client.id,
      usersCount: this.server.sockets.adapter.rooms.get(roomId)?.size || 0
    });
  }

  @SubscribeMessage('sync')
  handleSync(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
  ): void {
    const { roomId } = data;

    if (this.documents.has(roomId)) {
      const doc = this.documents.get(roomId);
      const update = encodeStateAsUpdate(doc);

      // Send current state to the requesting user
      client.emit('syncState', { update: Array.from(update) });
    }
  }

  @SubscribeMessage('update')
  handleUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string, update: Uint8Array | number[] }
  ): void {
    const { roomId, update } = data;

    if (!this.documents.has(roomId)) {
      const doc = new Y.Doc();
      this.documents.set(roomId, doc);
    }

    const doc = this.documents.get(roomId);

    // Apply the update to the document
    const uint8Update = update instanceof Uint8Array ?
      update : new Uint8Array(update as number[]);
    applyUpdate(doc, uint8Update);

    // Broadcast to all clients in the room except sender
    client.to(roomId).emit('update', { update });
  }
}
