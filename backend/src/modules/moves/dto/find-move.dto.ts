import { PartialType } from '@nestjs/swagger';
import { MoveDto } from './move.dto';

export class FindMoveDto extends PartialType(MoveDto) {}
