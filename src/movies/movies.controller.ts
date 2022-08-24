import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Response } from 'express';
import {
  createMovieSchema,
  findOneMovieSchema,
  removeMovieSchema,
  updateMovieSchema,
} from './validators/movieSchema';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  async create(
    @Body() { name, description }: CreateMovieDto,
    @Res() response: Response,
  ) {
    const isValid = await createMovieSchema.isValid({ name, description });

    if (!isValid)
      return response.status(400).json({ message: 'Bad validation' });

    const movie = await this.moviesService.create({ name, description });

    return response.status(201).json(movie);
  }

  @Get()
  async findAll(@Res() response: Response) {
    const movies = await this.moviesService.findAll();

    return response.status(200).json({ movies });
  }

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

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response: Response) {
    const isValid = await removeMovieSchema.isValid({ id });

    if (!isValid)
      return response.status(400).json({ message: 'Bad validation' });

    await this.moviesService.remove(id);

    return response.status(204).send();
  }
}
