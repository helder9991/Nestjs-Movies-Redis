import { HttpException, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcryptjs';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AuthUserDto } from './dto/auth-user.dto';
import { JwtService } from '@nestjs/jwt';

interface IAuth {
  token: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create({ email, password }: CreateUserDto): Promise<User> {
    const user = new User();

    Object.assign(user, {
      id: v4(),
      email,
      password: await hash(password, 8),
    });

    return await this.usersRepository.save(user);
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });

    return user;
  }

  async auth({ email, password }: AuthUserDto): Promise<IAuth> {
    const user = await this.usersRepository.findOneBy({ email });

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched)
      throw new HttpException('Login or password is invalid', 400);

    const token = this.jwtService.sign({
      sub: user.id,
    });

    return { token };
  }
}
