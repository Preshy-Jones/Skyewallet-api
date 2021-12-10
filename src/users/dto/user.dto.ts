// export class FindStudentsResponseDto {
//   id: string;
//   name: string;
//   teacher: string;
// }

export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  paymentId: [string];
}

// export class StudentResponseDto {
//   id: string;
//   name: string;
//   teacher: string;
// }

export class UpdateUserDto {
  paymentId: string;
}
