import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Bill } from 'src/bills/bill.model';
import { Reminder } from 'src/bills/reminder.model';
import { User } from 'src/users/user.model';

@Injectable()
export class RemindersService {
  constructor(
    @InjectModel(Reminder) private reminderModel: typeof Reminder,
    private mailerService: MailerService,
  ) {}

  findPendingRemindersToday() {
    return this.reminderModel.findAll({
      where: { status: 'pending', remindDate: new Date() },
      include: {
        model: Bill,
        include: [User],
      },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async notifyReminders() {
    const reminders = await this.findPendingRemindersToday();

    await Promise.all(
      reminders.map((reminder) =>
        this.mailerService.sendMail({
          to: reminder.bill.user.email,
          subject: 'Reminder: Upcoming Bill Payment',
          template: 'reminder',
          context: {
            name: reminder.bill.user.name,
            bill: {
              description: reminder.bill.description,
              amount: reminder.bill.amount,
              dueDate: reminder.bill.dueDate,
            },
          },
        }),
      ),
    );

    const ids = reminders.map((r) => r.id);
    if (ids.length > 0) {
      await this.reminderModel.update(
        { status: 'sent' },
        { where: { id: { [Op.in]: ids } } },
      );
    }
  }
}
