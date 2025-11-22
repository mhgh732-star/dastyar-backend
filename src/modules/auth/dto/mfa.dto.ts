import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class EnableMfaDto {
  @IsOptional()
  @IsBoolean()
  sms?: boolean;
}

export class VerifyMfaDto {
  @IsString()
  @Length(4, 10)
  code: string;
}
