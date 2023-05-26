import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { Position, PositionSchema } from './schema/position.schema';
import { Permission, PermissionSchema } from 'src/permission/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Position.name, schema: PositionSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  controllers: [PositionController],
  providers: [PositionService],
})
export class PositionModule {}
