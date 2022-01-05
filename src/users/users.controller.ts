import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './interfaces/User.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':email')
  findOne(@Param('email') email): Promise<User> {
    return this.usersService.findOne(email);
  }

  @Get('findById/:id')
  findOneById(@Param('id') id): Promise<User> {
    return this.usersService.findOneById(id);
  }

  @Get('findByPaymentId/:paymentId')
  findOneByPaymentId(@Param('paymentId') paymentId): Promise<User> {
    return this.usersService.findByPaymentId(paymentId);
  }

  @Post('register')
  create(@Body() CreateUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(CreateUserDto);
  }

  // @Get(':id/generate')
  // generatePaymentId(@Param('id') id): Promise<User> {
  //   return this.usersService.findOneById(id);
  // }
  // @Delete(':id')
  // delete(@Param('id') id): Promise<Item> {
  //   return this.itemsService.delete(id);
  // }

  // @Put(':id')
  // update(@Body() updateItemDto: CreateItemDto, @Param('id') id): Promise<Item> {
  //   return this.itemsService.update(id, updateItemDto);
  // }

  @Put(':id/generate')
  generatePaymentId(@Param('id') id: string): Promise<User> {
    return this.usersService.generatePaymentId(id);
  }
  @Put(':id/:paymentId/delete')
  deletePaymentId(
    @Param('id') id,
    @Param('paymentId') paymentId: string,
  ): Promise<User> {
    return this.usersService.deletePaymentId(id, paymentId);
  }

  @Put(':id/:paymentId/:amount/transfer')
  sendFunds(
    @Param('id') id,
    @Param('paymentId') paymentId: string,
    @Param('amount') amount: number,
  ) {
    return this.usersService.makeTransfer(id, paymentId, amount);
  }
}
