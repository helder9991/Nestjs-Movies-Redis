import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({
    example: `user@mail.com.`,
    description: 'Email do usuário',
  })
  email: string;

  @ApiProperty({
    example: `12345678`,
    description: 'Senha do usuário (precisa ter no mínimo 8 dígitos)',
  })
  password: string;
}
