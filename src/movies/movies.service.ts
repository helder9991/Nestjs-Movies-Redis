import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private moviesRepository: Repository<Movie>,
  ) {}

  async create({ name, description }: CreateMovieDto) {
    const movie = new Movie();

    Object.assign(movie, {
      id: v4(),
      name,
      description,
    });

    return await this.moviesRepository.save(movie);
  }

  async findAll() {
    const movies = await this.moviesRepository.find();

    return movies;
  }

  async findOne(id: string) {
    const movie = await this.moviesRepository.findOneBy({ id });

    return movie;
  }

  async update(id: string, { description, name }: UpdateMovieDto) {
    const movie = await this.moviesRepository.save({
      id,
      name,
      description,
    });

    return movie;
  }

  async remove(id: string) {
    const deleted = await this.moviesRepository.delete(id);

    if (deleted.affected === 0) return false;

    return true;
  }
}
