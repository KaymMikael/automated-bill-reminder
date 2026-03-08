import { Module } from '@nestjs/common';
import { BillsService } from './bills.service';
import { BillsController } from './bills.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Bill } from './bill.model';
import { Reminder } from './reminder.model';

@Module({
  imports: [SequelizeModule.forFeature([Bill, Reminder])],
  providers: [BillsService],
  controllers: [BillsController],
})
export class BillsModule {}
