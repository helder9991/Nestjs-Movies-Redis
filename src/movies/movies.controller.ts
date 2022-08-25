import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Inject,
  CACHE_MANAGER,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Response } from 'express';
import {
  createMovieSchema,
  findAllMovieSchema,
  findOneMovieSchema,
  removeMovieSchema,
  updateMovieSchema,
} from './validators/movieSchema';
import { Cache } from 'cache-manager';
import { JwtAuthGuard } from 'src/users/auth/jwt-auth-guard';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'O cadastro do filme foi realizado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O envio dos parametros está errado.',
  })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() { name, description }: CreateMovieDto,
    @Res() response: Response,
  ) {
    const isValid = await createMovieSchema.isValid({ name, description });

    if (!isValid)
      return response.status(400).json({ message: 'Bad validation' });

    await this.cacheManager.reset();

    const movie = await this.moviesService.create({ name, description });

    return response.status(201).json(movie);
  }

  @ApiResponse({
    status: 200,
    description: 'A listagem dos filmes foi devolvida com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O envio dos parametros está errado.',
  })
  @ApiQuery({
    name: 'page',
    description:
      'Utilizado para realizar a paginação, caso não seja enviado o valor é 1.',
    required: false,
  })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('page') page: number, @Res() response: Response) {
    page = page ? page : 1;

    const isValid = await findAllMovieSchema.isValid({ page });

    if (!isValid)
      return response.status(400).json({ message: 'Bad validation' });

    const hasCache = await this.cacheManager.get(`movies:findAll:${page}`);

    if (hasCache) return response.status(200).json(hasCache);

    const { movies, pageNumber, totalPages, totaRowCount } =
      await this.moviesService.findAll(page);

    await this.cacheManager.set(`movies:findAll:${page}`, {
      movies,
      pageNumber,
      totalPages,
      totaRowCount,
    });

    return response
      .status(200)
      .json({ movies, pageNumber, totalPages, totaRowCount });
  }

  @ApiResponse({
    status: 200,
    description: 'O filme solicitado foi devolvido com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      '1 - O envio dos parametros está errado. 2 - O filme não existe.',
  })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response: Response) {
    const isValid = await findOneMovieSchema.isValid({ id });

    if (!isValid)
      return response.status(400).json({ message: 'Bad validation' });

    const movie = await this.moviesService.findOne(id);

    if (!movie)
      return response.status(400).json({ message: 'Movie does not exists' });

    return response.status(200).json(movie);
  }

  @ApiResponse({
    status: 200,
    description: 'As informação do filme foi devolvida com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description:
      '1 - O envio dos parametros está errado. 2 - O filme não existe.',
  })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() { name, description }: UpdateMovieDto,
    @Res() response: Response,
  ) {
    const isValid = await updateMovieSchema.isValid({ id, name, description });

    if (!isValid)
      return response.status(400).json({ message: 'Bad validation' });

    let movie = await this.moviesService.findOne(id);

    if (!movie)
      return response.status(400).json({ message: 'Movie does not exists' });

    movie = await this.moviesService.update(id, { name, description });

    return response.status(200).json(movie);
  }

  @ApiResponse({
    status: 204,
    description: 'O filme foi apagado com sucesso.',
  })
  @ApiResponse({
    status: 400,
    description: 'O envio dos parametros está errado.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const isValid = await removeMovieSchema.isValid({ id });

    if (!isValid)
      return response.status(400).json({ message: 'Bad validation' });

    await this.moviesService.remove(id);
    await this.cacheManager.reset();

    return response.status(204).send();
  }
}
