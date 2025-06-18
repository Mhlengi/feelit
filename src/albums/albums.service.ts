import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './entities/album.entity';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    try {
      const { name, releaseDate, artistId } = createAlbumDto;

      const artist = await this.userRepository.findOne({
        where: { id: artistId },
      });
      if (!artist) {
        throw new NotFoundException(`Artist with ID ${artistId} not found`);
      }

      const album = this.albumRepository.create({ name, releaseDate, artist });
      return await this.albumRepository.save(album);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findAll(): Promise<Album[]> {
    try {
      return await this.albumRepository.find({
        relations: ['artist', 'tracks'],
      });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findOne(id: number): Promise<Album> {
    try {
      const album = await this.albumRepository.findOne({
        where: { id },
        relations: ['artist', 'tracks'],
      });
      if (!album) {
        throw new NotFoundException(`Album with ID ${id} not found`);
      }
      return album;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async update(id: number, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    try {
      const album = await this.albumRepository.findOne({ where: { id } });
      if (!album) {
        throw new NotFoundException(`Album with ID ${id} not found`);
      }

      if (updateAlbumDto.artistId) {
        const artist = await this.userRepository.findOne({
          where: { id: updateAlbumDto.artistId },
        });
        if (!artist) {
          throw new NotFoundException(`User with ID ${updateAlbumDto.artistId} not found`);
        }
        album.artist = artist;
      }

      Object.assign(album, updateAlbumDto);
      return await this.albumRepository.save(album);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const album = await this.albumRepository.findOne({ where: { id } });
      if (!album) {
        throw new NotFoundException(`Album with ID ${id} not found`);
      }
      await this.albumRepository.remove(album);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): never {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }

    if (
      error.code === '23505' &&
      error.detail?.includes('artist') &&
      error.detail?.includes('name')
    ) {
      throw new ConflictException('An album with this name already exists for the selected artist');
    }

    console.error('Unexpected error:', error);

    throw new InternalServerErrorException('Something went wrong');
  }
}
