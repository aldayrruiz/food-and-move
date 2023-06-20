import { LinkPatientDto } from '@modules/employees/dto/link-patient.dto';
import { EmployeesService } from '@modules/employees/employees.service';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConsultsService } from 'src/modules/consults/consults.service';
import { FoodsService } from 'src/modules/foods/foods.service';
import { MovesService } from 'src/modules/moves/moves.service';
import { CustomQueryService } from 'src/services/custom-query.service';
import { newRandomPassword } from 'src/utils/utils';
import { FilesService } from '../files/files.service';
import { FilterPatientDto } from './dto/filter-patient.dto';
import { PatientDto } from './dto/patient.dto';
import { QueryPatientDto } from './dto/query-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PatientDocument } from './schemas/patient.schema';

@Injectable()
export class PatientsService {
  constructor(
    @Inject(FilesService) private readonly filesService: FilesService,
    @Inject(CustomQueryService) private readonly customQueryService: CustomQueryService,
    @Inject(ConsultsService) private readonly consultsService: ConsultsService,
    @Inject(FoodsService) private readonly foodsService: FoodsService,
    @Inject(MovesService) private readonly movesService: MovesService,
    @InjectModel('patients') private readonly patientModel: Model<PatientDocument>,
    private readonly employeesService: EmployeesService
  ) {}

  async findById(id: string) {
    const patient = await this.patientModel.findById(id);
    if (!patient) throw new NotFoundException('No se ha encontrado al paciente');
    return patient;
  }

  async lookUp(filter: FilterPatientDto) {
    const patient = await this.patientModel.findOne(filter);
    if (!patient) throw new NotFoundException('No se ha encontrado ningún resultado');
    return patient;
  }

  async filter(queryPatientDto: QueryPatientDto) {
    return await this.customQueryService.filter(queryPatientDto, this.patientModel);
  }

  async create(patientDto: PatientDto) {
    const { phone, password } = patientDto;
    const findPatient = await this.patientModel.findOne({ phone });
    if (findPatient) throw new NotFoundException('Ya existe un paciente con ese teléfono');
    const createdPatient = await this.patientModel.create(patientDto);
    return createdPatient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    if (Object.keys(updatePatientDto).indexOf('phone') >= 0) {
      const prevPatient = await this.findById(id);
      if (prevPatient.phone != updatePatientDto.phone) {
        const findUser = await this.lookUp({ phone: updatePatientDto.phone } as FilterPatientDto);
        if (findUser) throw new NotFoundException('Ya existe un usuario con ese teléfono');
      }
    }
    const updatedPatient = await this.patientModel.findByIdAndUpdate(id, updatePatientDto, {
      new: true,
    });
    if (!updatedPatient) throw new NotFoundException('No se ha encontrado al paciente');
    return updatedPatient;
  }

  async remove(id: string) {
    const deletedPatient = await this.patientModel.findByIdAndDelete(id);
    if (!deletedPatient) throw new NotFoundException('No se ha encontrado al paciente');
    await this.consultsService.removeByPatient(deletedPatient._id);
    await this.foodsService.removeByPatient(deletedPatient._id);
    await this.movesService.removeByPatient(deletedPatient._id);
    return deletedPatient;
  }

  async upload(id: string, file: Express.Multer.File) {
    await this.removeProfileImage(id, false);
    return await this.patientModel.findByIdAndUpdate(id, { profile_image: file.filename }, { new: true });
  }

  async removeProfileImage(id: string, updatePatient = true) {
    const patient = await this.patientModel.findById(id);
    await this.filesService.removeProfileImage(patient.profile_image);
    if (updatePatient) await this.patientModel.findByIdAndUpdate(id, { profile_image: undefined });
  }

  async login(phone: string, password: string) {
    const user = await this.patientModel.findOne({ phone });
    if (!user) throw new NotFoundException('No se ha encontrado al usuario');
    const isMatch = password === user.password;
    if (!isMatch) throw new NotFoundException('Contraseña incorrecta');
    return user;
  }

  async randomPassword() {
    const password = newRandomPassword();
    return { password };
  }

  async linkEmployeePatient(linkPatientDto: LinkPatientDto) {
    const { patientId, employeeId } = linkPatientDto;
    const employee = await this.employeesService.findOne(employeeId);
    const patient = await this.findById(patientId);
    const indexOfEmployee = patient.employees.indexOf(employee._id);
    if (indexOfEmployee >= 0) {
      // Already linked
      return;
    }
    patient.employees.push(employee._id);
    await patient.save();
  }

  async unlinkEmployeePatient(unlinkPatientDto: LinkPatientDto) {
    const { patientId, employeeId } = unlinkPatientDto;
    const employee = await this.employeesService.findOne(employeeId);
    const patient = await this.findById(patientId);
    const indexOfEmployee = patient.employees.indexOf(employee._id);
    if (indexOfEmployee < 0) {
      // Not linked
      return;
    }
    patient.employees.splice(indexOfEmployee, 1);
    await patient.save();
  }
}
