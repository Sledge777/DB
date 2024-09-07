import {BelongsToMany, Column, DataType, HasMany, Model, Table} from "sequelize-typescript";
import { Messege } from "src/messeges/messeges.model";
import { UserMesseges } from "src/messeges/user-messeges.model";

interface UserCreationAttrs {
    email: string;
    password: string;
}

@Table({tableName: 'users'})
export class User extends Model<User, UserCreationAttrs> {

    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    email: string;

    @Column({type: DataType.STRING, allowNull: false})
    password: string;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    banned: boolean;

    @Column({type: DataType.STRING, allowNull: true})
    banReason: string;

    @BelongsToMany(() => Messege, () => UserMesseges)
    messeges: Messege[];
}