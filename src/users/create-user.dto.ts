export class CreateUserDto {
  fullName: string;
  phone?: string;
  email: string;
  companyID?: number;
  password: string;
}
