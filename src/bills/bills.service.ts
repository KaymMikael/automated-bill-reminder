import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bill } from './bill.model';
import { Reminder } from './reminder.model';
import { type CreateBillDto } from './dto/create-bill.dto';
import { type IUser } from 'src/auth/auth.inferface';
import { isBefore, isEqual, startOfDay, subDays } from 'date-fns';

@Injectable()
export class BillsService {
  constructor(
    @InjectModel(Bill) private billModel: typeof Bill,
    @InjectModel(Reminder) private reminderModel: typeof Reminder,
  ) {}

  async createOne(createBillDto: CreateBillDto, user: IUser) {
    const { id: userId } = user;

    const dueDate = startOfDay(new Date(createBillDto.dueDate));
    const today = startOfDay(new Date());

    // Reject past dates AND today
    if (isBefore(dueDate, today) || isEqual(dueDate, today)) {
      throw new BadRequestException('Due date must be strictly in the future');
    }

    const bill = await this.billModel.create({ ...createBillDto, userId });

    const threeDaysBefore = subDays(dueDate, 3);

    const reminders: Partial<Reminder>[] = [];

    // Always add the due date reminder
    reminders.push({
      billId: bill.id,
      remindDate: dueDate,
      status: 'pending',
    });

    // Add "3 days before" only if it's strictly after today
    if (isBefore(today, threeDaysBefore)) {
      reminders.push({
        billId: bill.id,
        remindDate: threeDaysBefore,
        status: 'pending',
      });
    }

    await this.reminderModel.bulkCreate(reminders);

    return {
      bill,
      message: 'New bill created with valid reminders',
    };
  }
}
