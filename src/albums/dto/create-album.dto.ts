import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateAlbumDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  releaseDate?: Date;

  @IsInt()
  artistId: number;
}
