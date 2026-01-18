import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './schema/user.schema';
import { Repository } from 'typeorm';
import bcrypt from 'node_modules/bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repo: Repository<UserEntity>,
  ) {}

  async findOrCreateFromGoogle(profile: {
    googleId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }) {
    let user = await this.repo.findOne({
      where: { googleId: profile.googleId },
    });

    if (!user) {
      user = this.repo.create(profile);
      await this.repo.save(user);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.repo.findOneBy({ email });
  }

  async findById(id: string) {
    return this.repo.findOneBy({ id });
  }

  async registerUser(profile: {
    email: string;
    password: string;
    name: string;
  }) {
    const salt = await bcrypt.genSalt(10);
    profile.password = await bcrypt.hash(profile.password, salt);
    const user = this.repo.create({
      email: profile.email,
      password: profile.password,
      name: profile.name,
    });
    return this.repo.save(user);
  }
}
