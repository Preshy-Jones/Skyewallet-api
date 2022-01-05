import * as mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  credit: {
    type: Number,
    required: true,
  },
  debit: {
    type: Number,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
    required: true,
  },
});

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentId: {
      type: [String],
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    transactions: {
      type: [transactionSchema],
      required: true,
    },
  },
  { timestamps: true },
);

// const User = mongoose.model('User', UserSchema, 'users');

// module.exports = User;
