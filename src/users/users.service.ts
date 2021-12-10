import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { Model } from 'mongoose';
import { User } from './interfaces/User.interface';
import { InjectModel } from '@nestjs/mongoose';
import * as cc from 'coupon-code';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

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

    const newItem = new this.userModel(user);
    return await newItem.save();
  }

  async delete(id: string): Promise<User> {
    return await this.userModel.findByIdAndRemove(id);
  }

  async update(id: string): Promise<User> {
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
    if (paymentIdIndex === -1) {
      throw new MethodNotAllowedException();
    }
    userData.paymentId.splice(paymentIdIndex, 1);
    return await this.userModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async findByPaymentId(paymentId: string): Promise<User> {
    return await this.userModel.findOne({ paymentId: paymentId });
  }
}
