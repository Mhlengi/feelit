import { IsString, IsInt, IsArray } from 'class-validator';

export class CreatePlaylistDto {
  @IsString()
  name: string;

  @IsInt()
  creatorId: number;

  @IsArray()
  trackIds: number[];
}
