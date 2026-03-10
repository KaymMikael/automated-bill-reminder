import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Bill } from './bill.model';
import { Reminder } from './reminder.model';
import { type CreateBillDto } from './dto/create-bill.dto';
import { type IUser } from 'src/auth/auth.inferface';
import { isBefore, isEqual, startOfDay, subDays } from 'date-fns';
import { type UpdateBillStatusDto } from './dto/update-bill-status.dto';
import { type GetUserBillsDto } from './dto/get-user-bills.dto';
import { Op } from 'sequelize';

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

  async updateBillStatus(
    billId: string,
    updateBillStatusDto: UpdateBillStatusDto,
    user: IUser,
  ) {
    const { id: userId } = user;
    const { newBillStatus } = updateBillStatusDto;
    const bill = await this.billModel.findOne({
      where: { id: billId, userId },
    });

    if (!bill) {
      throw new NotFoundException('Bill not found');
    }

    if (newBillStatus === bill.status) {
      throw new BadRequestException(
        'New bill status must be different from current bill status',
      );
    }

    if (newBillStatus === 'paid') {
      await this.reminderModel.destroy({ where: { billId } });
      const updatedBill = await bill.update({ status: newBillStatus });
      return { updatedBill, message: 'Bill status updated' };
    }

    const dueDate = startOfDay(new Date(bill.dueDate));
    const today = startOfDay(new Date());
    const threeDaysBefore = subDays(dueDate, 3);

    const reminders: Partial<Reminder>[] = [];

    // Always add due date reminder if still in the future
    if (isBefore(today, dueDate)) {
      reminders.push({
        billId: bill.id,
        remindDate: dueDate,
        status: 'pending',
      });
    }

    // Add "3 days before" only if it's strictly after today
    if (isBefore(today, threeDaysBefore)) {
      reminders.push({
        billId: bill.id,
        remindDate: threeDaysBefore,
        status: 'pending',
      });
    }

    if (reminders.length > 0) {
      await this.reminderModel.bulkCreate(reminders);
    }

    const updatedBill = await bill.update({ status: newBillStatus });

    return {
      updatedBill,
      message: 'Bill status updated',
    };
  }

  async getUserBills(user: IUser, searchParams: GetUserBillsDto) {
    const LIMIT = 10;
    const { id: userId } = user;
    const { page, q, sortedBy, orderBy } = searchParams;
    const whereClause = { userId } as Record<string, any>;

    if (q) {
      whereClause.description = { [Op.iLike]: `%${q}%` };
    }

    const [totalBills, bills] = await Promise.all([
      this.billModel.count({ where: whereClause }),
      this.billModel.findAll({
        limit: LIMIT,
        offset: (page - 1) * LIMIT,
        where: whereClause,
        order: [[sortedBy, orderBy]],
      }),
    ]);

    const totalPages = Math.ceil(totalBills / LIMIT);

    return {
      bills,
      totalBills,
      totalPages,
      currentPage: page,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  }
}
