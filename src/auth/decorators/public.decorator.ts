import { SetMetadata } from '@nestjs/common';

export const Public_Key = 'isPublic';

export const Public = () => SetMetadata(Public_Key, true);
