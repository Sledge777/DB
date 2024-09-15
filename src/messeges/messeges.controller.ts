import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessegeService } from './messeges.service';
import { CreateMessegeDto } from './dto/create-messeges.dto';

@Controller('contact')
export class MessegeController {
    constructor(private messegeService: MessegeService) { }

    @Post('/send')
    create(@Body() dto: CreateMessegeDto) {
        return this.messegeService.sendMessege(dto);
    }

    @Get('/:findmessege')
    getByValue(@Param('senderid') senderid: string) {
        return this.messegeService.getMessegeBySenderId(senderid);
    }
}