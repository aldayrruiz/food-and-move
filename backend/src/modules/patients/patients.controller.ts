import { LinkPatientDto } from '@modules/employees/dto/link-patient.dto';
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
  Post, Req,
  UploadedFile,
  UseGuards
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@shared/decorators/user.decorator';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Storage } from 'src/constants/uploads.constants';
import { FilterPatientDto } from './dto/filter-patient.dto';
import { PatientDto } from './dto/patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsService } from './patients.service';
import { Request } from 'express';
import {Role} from "@modules/auth/enums/role.enum";
import {Roles} from "@modules/auth/roles.decorator";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async findAll() {
    return await this.patientsService.findAll();
  }

  @Post('lookUp')
  async lookUp(@Body() filterPatientDto: FilterPatientDto) {
    return await this.patientsService.lookUp(filterPatientDto);
  }

  @Roles(Role.Employee)
  @Post('filter')
  async filter(@User() requester: any, @Body() queryPatientDto: QueryPatientDto) {
    return await this.patientsService.filter(requester, queryPatientDto);
  }

  @Get('filter-by-employee/:employeeId')
  async filterByEmployee(@Param('employeeId') id: string) {
    return await this.patientsService.filterByEmployee(id);
  }

  @Roles(Role.Admin)
  @Post('create')
  async create(@Body() patientDto: PatientDto) {
    return await this.patientsService.create(patientDto);
  }

  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return await this.patientsService.update(id, updatePatientDto);
  }

  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.patientsService.remove(id);
  }

  @Post('upload/:id')
  @UseInterceptors(FileInterceptor('file', Storage))
  async upload(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10000000 }), new FileTypeValidator({ fileType: 'image/' })],
      })
    )
    file: Express.Multer.File
  ) {
    return await this.patientsService.upload(id, file);
  }

  @Delete('remove-profile-image/:id')
  async removeProfileImage(@Param('id') id: string) {
    return await this.patientsService.removeProfileImage(id);
  }

  @Get('randomPassword')
  async randomPassword() {
    return await this.patientsService.randomPassword();
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: string) {
    return await this.patientsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post('linkEmployeePatient')
  async linkPatient(@Body() linkPatientDto: LinkPatientDto) {
    return await this.patientsService.linkEmployeePatient(linkPatientDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.Admin)
  @Post('unlinkEmployeePatient')
  async unlinkPatient(@Body() unlinkPatientDto: LinkPatientDto) {
    return await this.patientsService.unlinkEmployeePatient(unlinkPatientDto);
  }
}
