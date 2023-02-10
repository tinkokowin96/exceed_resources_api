import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ToggleActiveDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsBoolean()
    active: boolean;
}
