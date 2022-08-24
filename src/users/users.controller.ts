import { Controller, Post, Body, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { createUserValidator } from './validators/createUserValidator';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() { email, password }: CreateUserDto,
    @Res() response: Response,
  ) {
    const isValid = await createUserValidator.isValid({ email, password });

    if (!isValid)
      return response.status(400).json({ message: 'Bad validation' });

    const userExists = await this.usersService.findOneByEmail(email);

    if (userExists)
      return response.status(400).json({ message: 'User already exists' });

    await this.usersService.create({ email, password });

    return response.status(204).send();
  }
}
