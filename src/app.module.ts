import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import * as path from 'path';
import { User } from "./users/users.model";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { MessegeModule } from "./messeges/messeges.module";
import { Messege } from "./messeges/messeges.model";
import { UserMesseges } from "./messeges/user-messeges.model";

@Module({
    controllers: [],
    providers: [],
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.${process.env.NODE_ENV}.env`
        }),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        SequelizeModule.forRoot({
            dialect: 'postgres',
            host: process.env.POSTGRES_HOST,
            port: Number(process.env.POSTGRESS_PORT),
            username: process.env.POSTGRES_USER,
            password: process.env.POSTGRESS_PASSWORD,
            database: process.env.POSTGRES_DB,
            models: [User, Messege, UserMesseges],
            autoLoadModels: true
        }),
        UsersModule,
        AuthModule,
        MessegeModule
    ]
})
export class AppModule { }