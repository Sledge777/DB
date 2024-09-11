import {Module} from '@nestjs/common';
import { MessegeService } from './messeges.service';
import { MessegeController } from './messeges.controller';
import {SequelizeModule} from "@nestjs/sequelize";
import { Messege } from './messeges.model';
import {User} from "../users/users.model";
import { UserMesseges } from './user-messeges.model';
import { UsersModule } from 'src/users/users.module';
import { ChatGateway } from './chat.gateway';

@Module({
  providers: [MessegeService, ChatGateway],
  controllers: [MessegeController],
  imports: [
    SequelizeModule.forFeature([Messege, User, UserMesseges]),
    UsersModule
  ],
  exports: [
    MessegeService
  ]
})
export class MessegeModule {}