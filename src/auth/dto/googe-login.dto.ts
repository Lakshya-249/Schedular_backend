import { IsEmail, IsOptional, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString({ message: 'Google ID is required' })
  googleId: string;

  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString({ message: 'Name is required' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Avatar URL is invalid' })
  avatarUrl?: string;
}
