import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist.dto';
import { User } from '../users/entities/user.entity';
import { Playlist } from './entities/playlist.entity';
import { Track } from '../tracks/entities/track.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PlaylistsService {
  constructor(
    @InjectRepository(Playlist)
    private playlistRepository: Repository<Playlist>,

    @InjectRepository(Track)
    private trackRepository: Repository<Track>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createPlaylistDto: CreatePlaylistDto): Promise<Playlist> {
    try {
      const { name, creatorId, trackIds } = createPlaylistDto;

      const creator = await this.userRepository.findOne({
        where: { id: creatorId },
      });
      if (!creator) {
        throw new NotFoundException('Creator not found');
      }

      // Check for duplicate playlist name per creator
      const existing = await this.playlistRepository.findOne({
        where: {
          name,
          creator: { id: creatorId },
        },
        relations: ['creator'],
      });

      if (existing) {
        throw new ConflictException('Playlist with the same name already exists for this user.');
      }

      const tracks = await this.trackRepository.findByIds(trackIds || []);
      const playtime = tracks.reduce((total, track) => total + track.duration, 0);

      const playlist = this.playlistRepository.create({
        name,
        creator,
        tracks,
        playtime,
      });

      return await this.playlistRepository.save(playlist);
    } catch (error) {
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException('Failed to create playlist', error.message);
      }
      throw new InternalServerErrorException('Failed to create playlist');
    }
  }

  async findAll(): Promise<Playlist[]> {
    try {
      return await this.playlistRepository.find({
        relations: ['creator', 'tracks'],
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new InternalServerErrorException('Failed to retrieve playlists', error.message);
      }
      throw new InternalServerErrorException('Failed to retrieve playlists');
    }
  }

  async findOne(id: number): Promise<Playlist> {
    try {
      const playlist = await this.playlistRepository.findOne({
        where: { id },
        relations: ['creator', 'tracks'],
      });

      if (!playlist) {
        throw new NotFoundException(`Playlist #${id} not found`);
      }

      return playlist;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException('Failed to retrieve playlist', error.message);
      }
      throw new InternalServerErrorException('Failed to retrieve playlist');
    }
  }

  async update(id: number, updateData: Partial<CreatePlaylistDto>): Promise<Playlist> {
    try {
      const playlist = await this.findOne(id);

      // Check for duplicate name under same creator (excluding current playlist)
      if (updateData.name && updateData.name !== playlist.name) {
        const existing = await this.playlistRepository.findOne({
          where: {
            name: updateData.name,
            creator: { id: playlist.creator.id },
          },
          relations: ['creator'],
        });

        if (existing && existing.id !== playlist.id) {
          throw new ConflictException(
            'Another playlist with the same name already exists for this user.',
          );
        }

        playlist.name = updateData.name;
      }

      if (updateData.trackIds) {
        const tracks = await this.trackRepository.findByIds(updateData.trackIds);
        playlist.tracks = tracks;
        playlist.playtime = tracks.reduce((total, track) => total + track.duration, 0);
      }

      return await this.playlistRepository.save(playlist);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException('Failed to update playlist', error.message);
      }
      throw new InternalServerErrorException('Failed to update playlist');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const playlist = await this.findOne(id);
      await this.playlistRepository.remove(playlist);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Error) {
        throw new InternalServerErrorException('Failed to delete playlist', error.message);
      }
      throw new InternalServerErrorException('Failed to delete playlist');
    }
  }
}
