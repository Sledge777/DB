import { BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../users/users.model";
import { Messege } from "./messeges.model";

@Table({ tableName: 'user_messeges', createdAt: false, updatedAt: false })
export class UserMesseges extends Model<UserMesseges> {

    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    id: number;

    @ForeignKey(() => Messege)
    @Column({ type: DataType.INTEGER })
    messegeId: number;

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId: number;

}
