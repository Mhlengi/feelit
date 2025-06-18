import { Module } from '@nestjs/common';
import { TracksService } from './tracks.service';
import { TracksController } from './tracks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entities/track.entity';
import { User } from '../users/entities/user.entity';
import { Album } from '../albums/entities/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Track, User, Album])],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
