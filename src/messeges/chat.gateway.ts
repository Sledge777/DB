import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Messege } from './messeges.model';
import { UsersService } from '../users/users.service';

@WebSocketGateway(3000, { cors: { origin: "*" } })
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

    // Отправка сообщения отправителю
    client.emit('receiveMessage', messege);

    // Отправка сообщения в комнату получателя
    this.server.to(receiver.id.toString()).emit('receiveMessage', messege);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket): void {
    client.join(userId); // Подключение пользователя к комнате по его идентификатору
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(@MessageBody() userId: string, @ConnectedSocket() client: Socket): void {
    client.leave(userId); // Отключение пользователя от комнаты по его идентификатору
  }
}