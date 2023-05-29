import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PositionController } from './position.controller';
import { PositionService } from './position.service';
import { Position, PositionSchema } from './schema/position.schema';
import { PermissionModule } from 'src/permission/permission.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Position.name, schema: PositionSchema }]), PermissionModule],
  controllers: [PositionController],
  providers: [PositionService],
  exports: [PositionService],
})
export class PositionModule {}
