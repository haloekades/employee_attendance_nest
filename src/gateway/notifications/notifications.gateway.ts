import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EmployeeUpdatedEvent } from '../../common/employee-updated.event';
import { JwtPayload } from '../../common/jwt-payload';

const ADMIN_ROOM = 'admins';

@WebSocketGateway({ namespace: 'notifications', cors: { origin: '*' } })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private readonly server!: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket): void {
    const token = this.extractToken(client);
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      if (payload.role !== 'admin') {
        client.disconnect();
        return;
      }
      void client.join(ADMIN_ROOM);
      this.logger.log(`Admin ${payload.email} connected (${client.id})`);
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Client disconnected (${client.id})`);
  }

  private extractToken(client: Socket): string | undefined {
    const fromAuth = client.handshake.auth?.token as string | undefined;
    if (fromAuth) {
      return fromAuth;
    }
    const header = client.handshake.headers.authorization;
    return header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  }

  notifyEmployeeUpdated(event: EmployeeUpdatedEvent): void {
    this.server.to(ADMIN_ROOM).emit('employee.updated', event);
  }
}
