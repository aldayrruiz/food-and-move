import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from '@shared/dto/change-password.dto';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Storage } from 'src/constants/uploads.constants';
import { MAX_SIZE_IMAGE } from '../../constants/uploads.constants';
import { EmployeeDto } from './dto/employee.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';

@ApiTags('employees')
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.employeesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.employeesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('lookUp')
  async lookUp(@Body() filterEmployeeDto: FilterEmployeeDto) {
    return await this.employeesService.lookUp(filterEmployeeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('filter')
  async filter(@Body() queryEmployee: QueryEmployeeDto) {
    return await this.employeesService.filter(queryEmployee);
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() employeeDto: EmployeeDto) {
    return await this.employeesService.create(employeeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return await this.employeesService.update(id, updateEmployeeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.employeesService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file', Storage))
  async upload(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: MAX_SIZE_IMAGE }), new FileTypeValidator({ fileType: 'image/*' })],
      })
    )
    file: Express.Multer.File
  ) {
    return await this.employeesService.upload(id, file);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove-profile-image/:id')
  async removeProfileImage(@Param('id') id: string) {
    return await this.employeesService.removeProfileImage(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password/:id')
  async changePassword(@Param('id') id: string, @Body() changePasswordDto: ChangePasswordDto) {
    return await this.employeesService.changePassword(id, changePasswordDto);
  }

  @Get('forgotPassword/:email')
  async forgotPassword(@Param('email') email: string) {
    return await this.employeesService.forgotPassword(email);
  }

  @Post('recoverPassword')
  async recoverPassword(@Body() recoverPasswordDto: RecoverPasswordDto) {
    return await this.employeesService.recoverPassword(recoverPasswordDto.token, recoverPasswordDto.password);
  }
}
