import { Type } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DEFAULT_LIMIT } from 'src/constants/app.constants';

class Search {
  @IsString()
  search: string;

  @IsArray()
  fields: string[];
}

class Paging {
  @IsNumber()
  page: number;

  @IsOptional()
  @IsNumber()
  limit: number = DEFAULT_LIMIT;
}

class Sorting {
  @IsString()
  field: string;

  @IsIn(['asc', 'desc', 'ascending', 'descending'])
  @IsOptional()
  direction: 'asc' | 'desc' | 'ascending' | 'descending' = 'asc';
}

export class CustomQueryDto {
  @Type(() => Search)
  @IsOptional()
  search: Search;

  @Type(() => Paging)
  @IsOptional()
  paging: Paging;

  @Type(() => Sorting)
  @ValidateNested({ each: true })
  @IsOptional()
  sorting: Sorting[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  populate: string[];
}
