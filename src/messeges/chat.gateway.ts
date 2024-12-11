import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Messege } from './messeges.model';
import { UsersService } from '../users/users.service';

@WebSocketGateway(3000, { cors: { origin: "*", methods: ["GET", "POST"]} })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly userService: UsersService) { }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() message: { sendername: string; receivername: string; content: string }, @ConnectedSocket() client: Socket): Promise<void> {
    const sender = await this.userService.getUserByEmail(message.sendername);
    const receiver = await this.userService.getUserByEmail(message.receivername);

    if (!sender || !receiver) {
      throw new HttpException('Отправитель или получатель не существует', HttpStatus.BAD_GATEWAY)
    }

    const messege = await Messege.create({
      content: message.content,
      sendername: message.sendername,
      recievername: message.receivername,
    });
    console.log('Сообщение создано и отправлено в комнату:', receiver.id.toString());

    client.emit('receiveMessage', messege);

    this.server.to(receiver.id.toString()).emit('receiveMessage', messege);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket): void {
    console.log(`Пользователь с ID ${userId} подключен к комнате`);
    client.join(userId);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket): void {
    client.leave(userId);
  }
}