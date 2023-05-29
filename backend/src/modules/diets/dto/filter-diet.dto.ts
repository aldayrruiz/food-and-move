import { PartialType } from '@nestjs/swagger';
import { DietDto } from './diet.dto';

export class FilterDietDto extends PartialType(DietDto) {}
