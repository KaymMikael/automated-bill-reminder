import {
  Table,
  Column,
  DataType,
  Index,
  ForeignKey,
  CreatedAt,
  BelongsTo,
  Model,
} from 'sequelize-typescript';
import { Bill } from './bill.model';
import { type ReminderStatus } from './bills.interface';

@Table({ timestamps: true, createdAt: true, updatedAt: false })
export class Reminder extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Index
  @ForeignKey(() => Bill)
  @Column({ type: DataType.UUID, allowNull: false })
  declare billId: string;

  @Column({ type: DataType.DECIMAL, allowNull: false })
  declare amount: string;

  @Column({ type: DataType.DATEONLY, allowNull: false })
  declare remindDate: Date;

  @Index
  @Column({
    type: DataType.ENUM('pending', 'sent'),
    allowNull: false,
    defaultValue: 'pending',
  })
  declare status: ReminderStatus;

  @CreatedAt
  declare createdAt: Date;

  @BelongsTo(() => Bill)
  declare bill: Bill;
}
