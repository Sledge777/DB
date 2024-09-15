import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMessegeDto } from './dto/create-messeges.dto';
import { InjectModel } from "@nestjs/sequelize";
import { Messege } from './messeges.model';
import { UsersService } from 'src/users/users.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class MessegeService {

    constructor(
        @InjectModel(Messege) private messegeRepository: typeof Messege,
        private userService: UsersService,
        private ChatGateway: ChatGateway,
    ) { }

    async sendMessege(dto: CreateMessegeDto) {
        const sender = await this.userService.getUserByEmail(dto.sendername);
        const reciever = await this.userService.getUserByEmail(dto.recievername);

        if (!sender || !reciever) {
            throw new HttpException('Отправитель или получатель не существует', HttpStatus.BAD_REQUEST);
        }

        const messege = await this.messegeRepository.create(dto);

        this.ChatGateway.server.to(reciever.id.toString()).emit('receiveMessage', messege);
        return messege;
    }

    async getMessegeBySenderId(sendername: string) {
        const messege = await this.messegeRepository.findOne({ where: { sendername } });
        return messege;
    }
}