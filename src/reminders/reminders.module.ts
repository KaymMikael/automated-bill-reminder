import { Module } from '@nestjs/common';
import { RemindersService } from './reminders.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Reminder } from 'src/bills/reminder.model';

@Module({
  imports: [SequelizeModule.forFeature([Reminder])],
  providers: [RemindersService],
})
export class RemindersModule {}
