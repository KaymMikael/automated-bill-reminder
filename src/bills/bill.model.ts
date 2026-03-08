import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/user.model';
import { type BillStatus } from './bills.interface';
import { Reminder } from './reminder.model';

@Table({ timestamps: true, createdAt: true, updatedAt: false })
export class Bill extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Index
  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  declare userId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare description: string;

  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare amount: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare dueDate: Date;

  @Index
  @Column({
    type: DataType.ENUM('pending', 'paid'),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare status: BillStatus;

  @CreatedAt
  declare createdAt: Date;

  @BelongsTo(() => User)
  declare user: User;

  @HasMany(() => Reminder)
  declare reminders: Reminder[];
}
