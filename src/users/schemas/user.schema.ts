import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
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
});

// const User = mongoose.model('User', UserSchema, 'users');

// module.exports = User;
