import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePermissionDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    permissionId: string;
}
