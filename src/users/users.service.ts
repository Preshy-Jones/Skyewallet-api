import {
  Injectable,
  MethodNotAllowedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { User, Users } from './interfaces/User.interface';
import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import * as cc from 'coupon-code';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @InjectConnection() private connection: Connection,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async findOneById(id: string): Promise<User> {
    return await this.userModel.findOne({ _id: id });
  }

  async findOne(email: string): Promise<User> {
    return await this.userModel.findOne({ email: email });
  }

  async create(user: User): Promise<User> {
    user['paymentId'] = [cc.generate({ parts: 1, partLen: 7 })];
    user['balance'] = 5000;
    const newItem = new this.userModel(user);
    return await newItem.save();
  }

  async delete(id: string): Promise<User> {
    return await this.userModel.findByIdAndRemove(id);
  }

  async makeTransfer(
    id: string,
    paymentId: string,
    amount: number,
  ): Promise<Users> {
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      const opts = { session, new: true };

      var today = new Date();
      var date =
        today.getFullYear() +
        '-' +
        (today.getMonth() + 1) +
        '-' +
        today.getDate();
      var time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
      const preUser = await this.userModel.findOne({ _id: id });
      const preRecipient = await this.userModel.findOne({
        paymentId: paymentId,
      });
      const newUserBalance = Number(preUser.balance) - Number(amount);
      preUser.transactions.push({
        date: date,
        time: time,
        credit: '',
        debit: amount,
        balance: newUserBalance,
        remarks: `Debit transaction to ${preRecipient.name}`,
      });

      const user = await this.userModel.findOneAndUpdate(
        { _id: id },
        { $inc: { balance: -amount }, transactions: preUser.transactions },
        opts,
      );
      if (user.balance < 0) {
        // If A would have negative balance, fail and abort the transaction
        // `session.abortTransaction()` will undo the above `findOneAndUpdate()`
        // throw new HttpException(
        //   {
        //     status: HttpStatus.FORBIDDEN,
        //     error: 'This is a custom message',
        //   },
        //   HttpStatus.FORBIDDEN,
        // );
        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: 'Insufficient funds',
          },
          HttpStatus.FORBIDDEN,
        );
        // throw new Error('Insufficient funds: ' + (preUser.balance + amount));
      }

      const newRecipientBalance: number =
        Number(amount) + Number(preRecipient.balance);
      preRecipient.transactions.push({
        date: date,
        time: time,
        credit: amount,
        debit: '',
        balance: newRecipientBalance,
        remarks: `Credit transaction from ${preUser.name}`,
      });
      const recipient = await this.userModel.findOneAndUpdate(
        { paymentId: paymentId },
        { $inc: { balance: amount }, transactions: preRecipient.transactions },
        opts,
      );

      await session.commitTransaction();
      session.endSession();
      return { User: user, Recipient: recipient };
    } catch (error) {
      // If an error occurred, abort the whole transaction and
      // undo any changes that might have happened
      await session.abortTransaction();
      session.endSession();
      throw error; // Rethrow so calling function sees error
    }
  }

  async generatePaymentId(id: string): Promise<User> {
    const newPaymentId = cc.generate({ parts: 1, partLen: 7 });
    const userData = await this.userModel.findOne({ _id: id });
    if (userData.paymentId.length >= 5) {
      throw new MethodNotAllowedException();
    }
    userData.paymentId.push(newPaymentId);

    return await this.userModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async deletePaymentId(id: string, paymentId: string): Promise<User> {
    const userData = await this.userModel.findOne({ _id: id });
    const paymentIdIndex = userData.paymentId.indexOf(paymentId);
    if (paymentIdIndex === -1 || userData.paymentId.length <= 1) {
      throw new MethodNotAllowedException();
    }
    userData.paymentId.splice(paymentIdIndex, 1);
    return await this.userModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async findByPaymentId(paymentId: string): Promise<User> {
    const user = await this.userModel.findOne({ paymentId: paymentId });
    if (user) {
      return user;
    } else {
      throw new NotFoundException();
    }
  }
}
