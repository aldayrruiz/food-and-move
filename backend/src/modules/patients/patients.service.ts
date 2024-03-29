import { HashingService } from '@modules/auth/services/hashing.service';
import { LinkPatientDto } from '@modules/employees/dto/link-patient.dto';
import { EmployeesService } from '@modules/employees/employees.service';
import { Injectable, NotFoundException } from '@nestjs/common';
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
import { Patient, PatientDocument } from './schemas/patient.schema';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name) private readonly patientModel: Model<PatientDocument>,
    private readonly filesService: FilesService,
    private readonly customQueryService: CustomQueryService,
    private readonly consultsService: ConsultsService,
    private readonly foodsService: FoodsService,
    private readonly movesService: MovesService,
    private readonly employeesService: EmployeesService,
    private readonly hashingService: HashingService
  ) {}

  async findAll() {
    return this.patientModel.find();
  }

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

  async filter(requester: any, queryPatientDto: QueryPatientDto) {
    const requesterId = requester._id;
    const employee = await this.employeesService.findOne(requesterId);
    if (employee.admin) return await this.customQueryService.filter(queryPatientDto, this.patientModel);
    queryPatientDto.filter.employees = { $elemMatch: { $eq: employee._id } };
    return await this.customQueryService.filter(queryPatientDto, this.patientModel);
  }

  async filterByEmployee(employeeId: string) {
    return this.patientModel.find({ employees: { $elemMatch: { $eq: employeeId } } });
  }

  async create(patientDto: PatientDto) {
    const { phone, password } = patientDto;
    const findPatient = await this.patientModel.findOne({ phone });
    if (findPatient) throw new NotFoundException('Ya existe un paciente con ese teléfono');
    return await this.patientModel.create({ ...patientDto, employees: [patientDto.owner] });
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    if (Object.keys(updatePatientDto).indexOf('phone') >= 0) {
      const prevPatient = await this.findById(id);
      if (prevPatient.phone != updatePatientDto.phone) {
        const findUser = await this.lookUp({ phone: updatePatientDto.phone } as FilterPatientDto);
        if (findUser) throw new NotFoundException('Ya existe un usuario con ese teléfono');
      }
    }
    if (updatePatientDto?.password) {
      updatePatientDto.password = await this.hashingService.hash(updatePatientDto.password);
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
    await this.movesService.clearMoves(deletedPatient._id);
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
    await this.patientModel.findByIdAndUpdate(patientId, { $pull: { employees: employee._id } }).exec();
  }
}
