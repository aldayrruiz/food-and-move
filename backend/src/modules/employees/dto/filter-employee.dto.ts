import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';
import { EmployeeDto } from './employee.dto';

export class FilterEmployeeDto extends PartialType(EmployeeDto) {
  @ApiProperty()
  @IsObjectId()
  @IsOptional()
  _id: string;
}
