import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BillsService } from './bills.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pipe';
import { type CreateBillDto, createBillSchema } from './dto/create-bill.dto';
import { User } from 'src/common/decorators/user.decorator';
import { type IUser } from 'src/auth/auth.inferface';
import { UUIDParam } from 'src/common/decorators/uuid-param.dto';
import {
  type UpdateBillStatusDto,
  updateBillStatusSchema,
} from './dto/update-bill-status.dto';
import {
  type GetUserBillsDto,
  getUserBillsSchema,
} from './dto/get-user-bills.dto';

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

  @Get()
  @UseGuards(AuthGuard)
  getUserBills(
    @User() user: IUser,
    @Query(new ZodValidationPipe(getUserBillsSchema))
    searchParams: GetUserBillsDto,
  ) {
    return this.billsServices.getUserBills(user, searchParams);
  }

  @Patch('update-status/:billId')
  @UseGuards(AuthGuard)
  updateStatus(
    @UUIDParam('billId') billId: string,
    @Body(new ZodValidationPipe(updateBillStatusSchema))
    updateBillStatusDto: UpdateBillStatusDto,
    @User() user: IUser,
  ) {
    return this.billsServices.updateBillStatus(
      billId,
      updateBillStatusDto,
      user,
    );
  }
}
