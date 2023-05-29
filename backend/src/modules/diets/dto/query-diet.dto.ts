import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CustomQueryDto } from 'src/shared/dto/custom-query.dto';
import { FilterDietDto } from './filter-diet.dto';

export class QueryDietDto extends CustomQueryDto {
  @ApiProperty()
  @Type(() => FilterDietDto)
  @ValidateNested({ each: true })
  @IsOptional()
  filter: FilterDietDto;
}
