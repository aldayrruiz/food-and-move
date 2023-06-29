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
  Post,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { Storage } from 'src/constants/uploads.constants';
import { FilterPatientDto } from './dto/filter-patient.dto';
import { PatientDto } from './dto/patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientsService } from './patients.service';

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

  @Post('filter')
  async filter(@Body() queryPatientDto: QueryPatientDto) {
    return await this.patientsService.filter(queryPatientDto);
  }

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
  async findOne(@Param('id') id: string) {
    return await this.patientsService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('linkEmployeePatient')
  async linkPatient(@Body() linkPatientDto: LinkPatientDto) {
    return await this.patientsService.linkEmployeePatient(linkPatientDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unlinkEmployeePatient')
  async unlinkPatient(@Body() unlinkPatientDto: LinkPatientDto) {
    return await this.patientsService.unlinkEmployeePatient(unlinkPatientDto);
  }
}
