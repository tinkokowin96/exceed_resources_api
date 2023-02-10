import { SetMetadata } from '@nestjs/common';
import { EAddon } from '../utils/enumn';

export type AllowedAddon = Array<keyof typeof EAddon>;
export const Addon = (addons: AllowedAddon) => SetMetadata('addons', addons);
