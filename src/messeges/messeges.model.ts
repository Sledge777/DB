import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import { UserMesseges } from "./user-messeges.model";

interface MessegeCreationAttrs {
    readonly content: string;
    readonly sendername: string;
    readonly recievername: string;
}

@Table({ tableName: 'messeges' })
export class Messege extends Model<Messege, MessegeCreationAttrs> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @Column({ type: DataType.STRING, allowNull: false })
    content: string;

    @Column({ type: DataType.STRING, unique: false, allowNull: false })
    sendername: string;

    @Column({ type: DataType.STRING, unique: false, allowNull: false })
    recievername: string;

    @BelongsToMany(() => User, () => UserMesseges)
    users: User[];
}