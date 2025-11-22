import { IsString } from 'class-validator';

export class UpsertSystemSettingDto {
  @IsString()
  key: string;

  @IsString()
  value: string;
}
