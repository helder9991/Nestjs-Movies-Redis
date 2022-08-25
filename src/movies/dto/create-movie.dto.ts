import { ApiProperty } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    example: 'Senhor dos Aneis',
    description: 'Nome do filme',
  })
  name: string;

  @ApiProperty({
    example: `Numa terra fantástica e única, chamada Terra-Média, um hobbit 
    (seres de estatura entre 80 cm e 1,20 m, com pés peludos e bochechas um pouco avermelhadas) 
    recebe de presente de seu tio o Um Anel, um anel mágico e maligno que precisa ser destruído 
    antes que caia nas mãos do mal.`,
    description: 'Descrição do filme',
  })
  description: string;
}
