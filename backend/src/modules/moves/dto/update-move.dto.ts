import { PartialType } from '@nestjs/swagger';
import { MoveDto } from './move.dto';

export class UpdateMoveDto extends PartialType(MoveDto) {}
