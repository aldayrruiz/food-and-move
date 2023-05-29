import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DEFAULT_LIMIT } from 'src/constants/app.constants';

class Search {
  @ApiProperty()
  @IsString()
  search: string;

  @ApiProperty()
  @IsArray()
  fields: string[];
}

class Paging {
  @ApiProperty()
  @IsNumber()
  page: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  limit: number = DEFAULT_LIMIT;
}

class Sorting {
  @ApiProperty()
  @IsString()
  field: string;

  @ApiProperty()
  @IsIn(['asc', 'desc', 'ascending', 'descending'])
  @IsOptional()
  direction: 'asc' | 'desc' | 'ascending' | 'descending' = 'asc';
}

export class CustomQueryDto {
  @ApiProperty()
  @Type(() => Search)
  @IsOptional()
  search: Search;

  @ApiProperty()
  @Type(() => Paging)
  @IsOptional()
  paging: Paging;

  @ApiProperty()
  @Type(() => Sorting)
  @ValidateNested({ each: true })
  @IsOptional()
  sorting: Sorting[];
}
