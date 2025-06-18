import {
  Column,
  Entity,
  ManyToOne,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { Track } from '../../tracks/entities/track.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
@Unique(['name', 'creator'])
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', default: 0 })
  playtime: number; // total duration in seconds

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.playlists, { onDelete: 'CASCADE' })
  creator: User;

  @ManyToMany(() => Track)
  @JoinTable()
  tracks: Track[];
}
