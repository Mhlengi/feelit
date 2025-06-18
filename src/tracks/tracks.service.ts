import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Track } from './entities/track.entity';
import { User } from '../users/entities/user.entity';
import { Album } from '../albums/entities/album.entity';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TracksService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Album)
    private albumRepository: Repository<Album>,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    try {
      const { userId, albumId, ...trackData } = createTrackDto;

      const artist = await this.userRepository.findOne({
        where: { id: userId },
      });
      if (!artist) {
        throw new NotFoundException(`Artist with ID ${userId} not found`);
      }

      const album = await this.albumRepository.findOne({
        where: { id: albumId },
      });
      if (!album) {
        throw new NotFoundException(`Album with ID ${albumId} not found`);
      }

      const newTrack = this.trackRepository.create({
        ...trackData,
        artist,
        album,
      });

      return await this.trackRepository.save(newTrack);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(): Promise<Track[]> {
    try {
      return await this.trackRepository.find({
        relations: ['artist', 'album'],
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findOne(id: number): Promise<Track> {
    try {
      const track = await this.trackRepository.findOne({
        where: { id },
        relations: ['artist', 'album'],
      });
      if (!track) {
        throw new NotFoundException(`Track with ID ${id} not found`);
      }
      return track;
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: number, updateTrackDto: UpdateTrackDto): Promise<Track> {
    try {
      const track = await this.findOne(id);

      // Update artist if provided
      if (updateTrackDto.userId) {
        const artist = await this.userRepository.findOne({
          where: { id: updateTrackDto.userId },
        });
        if (!artist) {
          throw new NotFoundException(`Artist with ID ${updateTrackDto.userId} not found`);
        }
        track.artist = artist;
      }

      // Update album if provided
      if (updateTrackDto.albumId) {
        const album = await this.albumRepository.findOne({
          where: { id: updateTrackDto.albumId },
        });
        if (!album) {
          throw new NotFoundException(`Album with ID ${updateTrackDto.albumId} not found`);
        }
        track.album = album;
      }

      // Apply other updates
      Object.assign(track, this.sanitizeUpdateDto(updateTrackDto));

      return await this.trackRepository.save(track);
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.trackRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Track with ID ${id} not found`);
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Filters out keys that shouldn't be updated if not present
   */
  private sanitizeUpdateDto(dto: UpdateTrackDto): Partial<UpdateTrackDto> {
    const { userId, albumId, ...rest } = dto;
    return Object.fromEntries(
      Object.entries(rest).filter(([_, value]) => value !== undefined && value !== null),
    );
  }

  private handleError(error: any): never {
    if (error instanceof NotFoundException || error instanceof BadRequestException) {
      throw error;
    }

    // Check for duplicate entry (Postgres error code '23505')
    if (error.code === '23505') {
      throw new BadRequestException(
        'A track with this name already exists for this artist and album.',
      );
    }

    console.error('Unexpected error in TracksService:', error);
    throw new InternalServerErrorException('An unexpected error occurred');
  }
}
