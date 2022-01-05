export interface User {
  id?: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  paymentId: [string];
  balance: number;
  transactions: [Object];
}

export interface Users {
  User: object;
  Recipient: object;
}
