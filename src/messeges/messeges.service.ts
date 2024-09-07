import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateMessegeDto } from './dto/create-messeges.dto';
import { InjectModel } from "@nestjs/sequelize";
import { Messege } from './messeges.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MessegeService {

    constructor(
        @InjectModel(Messege) private messegeRepository: typeof Messege,
        private userService: UsersService
    ) {}

    async sendMessege(dto: CreateMessegeDto) {
        const sender = await this.userService.getUserByEmail(dto.sendername);
        const reciever = await this.userService.getUserByEmail(dto.recievername);

        if (!sender || !reciever) {
            throw new HttpException('Отправитель или получатель не существует', HttpStatus.BAD_REQUEST);
        }

        const messege = await this.messegeRepository.create(dto);
        
        await sender.$add('messeges', messege.id);
        await reciever.$add('messeges', messege.id);

        return messege;
    }

    async getMessegeBySenderId(sendername: string) {
        const messege = await this.messegeRepository.findOne({ where: { sendername } });
        return messege;
    }
}