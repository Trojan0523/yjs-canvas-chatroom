import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  private rooms: Map<string, {
    users: Set<string>,
    createdAt: Date
  }> = new Map();

  getHello(): string {
    return 'Welcome to the Canvas Chat Room API!';
  }

  getRoomInfo(roomId: string): any {
    if (!this.rooms.has(roomId)) {
      this.createRoom(roomId);
    }

    const room = this.rooms.get(roomId);
    return {
      roomId,
      usersCount: room.users.size,
      createdAt: room.createdAt
    };
  }

  createRoom(roomId: string): void {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, {
        users: new Set(),
        createdAt: new Date()
      });
    }
  }

  joinRoom(roomId: string, userId: string): void {
    if (!this.rooms.has(roomId)) {
      this.createRoom(roomId);
    }

    const room = this.rooms.get(roomId);
    room.users.add(userId);
  }

  leaveRoom(roomId: string, userId: string): void {
    if (this.rooms.has(roomId)) {
      const room = this.rooms.get(roomId);
      room.users.delete(userId);

      // Clean up empty rooms
      if (room.users.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }
}
