import { Controller, Post, Body, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { authUserSchema, createUserSchema } from './validators/userSchema';
import { Response } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/')
  async create(
    @Body() { email, password }: CreateUserDto,
    @Res() response: Response,
  ) {
    const isValid = await createUserSchema.isValid({ email, password });

    if (!isValid)
      return response.status(400).json({ message: 'Bad validation' });

    const userExists = await this.usersService.findOneByEmail(email);

    if (userExists)
      return response.status(400).json({ message: 'User already exists' });

    await this.usersService.create({ email, password });

    return response.status(201).send();
  }

  @Post('/auth')
  async authenticate(
    @Body() { email, password }: CreateUserDto,
    @Res() response: Response,
  ) {
    const isValid = await authUserSchema.isValid({ email, password });

    if (!isValid)
      return response.status(400).json({ message: 'Bad validation' });

    const token = await this.usersService.auth({ email, password });

    return response.status(200).json(token);
  }
}
