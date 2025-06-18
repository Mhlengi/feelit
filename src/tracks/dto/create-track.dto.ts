import { IsString, IsNumber, IsOptional, IsUrl, IsInt } from 'class-validator';

export class CreateTrackDto {
  @IsString()
  name: string;

  @IsNumber()
  duration: number;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  @IsString()
  releaseDate?: string;

  @IsUrl()
  artwork: string;

  @IsUrl()
  audio: string;

  @IsInt()
  userId: number;

  @IsInt()
  albumId: number;
}
