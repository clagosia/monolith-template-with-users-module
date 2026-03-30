import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HandleErrors } from '../common/decorators/handle-errors.decorator';
import {
  UserNotFoundError,
  UserOrEmailConflictError,
  UsernameConflictError,
  EmailConflictError,
} from '../common/errors';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  @HandleErrors([UserOrEmailConflictError])
  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new UserOrEmailConflictError();
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  @HandleErrors([])
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  @HandleErrors([UserNotFoundError])
  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new UserNotFoundError(`User with ID "${id}" not found`);
    }
    return user;
  }

  @HandleErrors([])
  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  @HandleErrors([])
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  @HandleErrors([UserNotFoundError, UsernameConflictError, EmailConflictError])
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existing = await this.findByUsername(updateUserDto.username);
      if (existing) {
        throw new UsernameConflictError();
      }
    }

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.findByEmail(updateUserDto.email);
      if (existing) {
        throw new EmailConflictError();
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  @HandleErrors([UserNotFoundError])
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
