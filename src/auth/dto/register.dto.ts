import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'Name is required' }) name: string;
  @IsEmail({}, { message: 'Invalid email' }) email: string;
  @IsString({ message: 'Password is required' }) password: string;
}
