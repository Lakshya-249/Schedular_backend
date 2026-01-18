import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './schema/user.schema';
import { Repository } from 'typeorm';

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
}
