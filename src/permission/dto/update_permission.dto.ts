import { ArrayNotEmpty, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

type UpdatePermissionType = {
    add: string[];
    remove: string;
};

export class UpdatePermissionDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @ArrayNotEmpty()
    @ValidateNested()
    permissions: UpdatePermissionType;
}
