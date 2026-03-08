import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BillsService } from './bills.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { type CreateBillDto, createBillSchema } from './dto/create-bill.dto';
import { User } from 'src/common/decorators/user.decorator';
import { type IUser } from 'src/auth/auth.inferface';

@Controller('bills')
export class BillsController {
  constructor(private billsServices: BillsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createBill(
    @Body(new ZodValidationPipe(createBillSchema)) createBillDto: CreateBillDto,
    @User() user: IUser,
  ) {
    return this.billsServices.createOne(createBillDto, user);
  }
}
