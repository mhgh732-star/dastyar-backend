import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../auth/entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(@InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>) {}

  searchByEmail(term: string) {
    return this.repository.find({
      where: { email: term },
    });
  }
}
