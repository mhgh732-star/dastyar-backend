import { IsArray, IsOptional, IsString } from 'class-validator';

export class AssignPermissionDto {
  @IsArray()
  @IsString({ each: true })
  permissionNames: string[];
}

export class OverridePermissionDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  permissionNames?: string[];
}

