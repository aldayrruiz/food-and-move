import { PartialType } from '@nestjs/swagger';
import { DietDto } from './diet.dto';

export class UpdateDietDto extends PartialType(DietDto) {}
