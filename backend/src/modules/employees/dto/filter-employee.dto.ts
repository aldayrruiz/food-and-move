import { EmployeeDto } from '@modules/employees/dto/employee.dto';
import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class FilterEmployeeDto extends PartialType(EmployeeDto) {
  @IsObjectId()
  @IsOptional()
  _id?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  email?: string;
}
