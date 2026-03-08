import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Bill } from 'src/bills/bill.model';

@Table({ timestamps: true, createdAt: true, updatedAt: false })
export class User extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({ type: DataType.STRING(), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  declare email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare passwordHash: string;

  @CreatedAt
  declare createdAt: Date;

  @HasMany(() => Bill)
  declare bills: Bill[];
}
