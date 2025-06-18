import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Album } from '../../albums/entities/album.entity';

@Entity()
@Unique(['name', 'artist', 'album'])
export class Track {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.tracks, { eager: true })
  artist: User;

  @Column()
  duration: number;

  @Column({ nullable: true })
  genre?: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  releaseDate?: string;

  @Column()
  artwork: string;

  @Column()
  audio: string;

  @ManyToOne(() => Album, (album) => album.tracks, { onDelete: 'CASCADE' })
  album: Album;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
