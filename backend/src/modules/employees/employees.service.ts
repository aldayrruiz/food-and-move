import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomQueryService } from '@services/custom-query.service';
import { compare, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { newRandomPassword } from 'src/utils/utils';
import { FilesService } from '../files/files.service';
import { MailService } from '../mail/mail.service';
import { EmployeeDto } from './dto/employee.dto';
import { FilterEmployeeDto } from './dto/filter-employee.dto';
import { QueryEmployeeDto } from './dto/query-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeDocument } from './schema/employee.schema';

@Injectable()
export class EmployeesService {
  constructor(
    private readonly customQueryService: CustomQueryService,
    @Inject(FilesService) private readonly filesService: FilesService,
    @InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>,
    @Inject(MailService) private readonly mailService: MailService
  ) {}

  async findAll() {
    return this.employeeModel.find();
  }

  async findOne(id: string) {
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) throw new NotFoundException('No se ha encontrado al profesional');
    return employee;
  }

  async lookUp(filter: FilterEmployeeDto) {
    const employee = await this.employeeModel.findOne(filter);
    if (!employee) throw new NotFoundException('No se ha encontrado ningún resultado');
    return employee;
  }

  async filter(queryEmployeeDto: QueryEmployeeDto) {
    return await this.customQueryService.filter(queryEmployeeDto, this.employeeModel);
  }

  async create(employeeDto: EmployeeDto) {
    const { email } = employeeDto;
    const findEmployee = await this.employeeModel.findOne({ email });
    if (findEmployee) throw new NotFoundException('Ya existe un profesional con ese email');
    const password = newRandomPassword();
    const newPassword = await hash(password, 10);
    const employee = { ...employeeDto, password: newPassword };
    const createdEmployee = await this.employeeModel.create(employee);
    await this.mailService.sendWelcomeEmployee(employee, password);
    return createdEmployee;
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    if (Object.keys(updateEmployeeDto).indexOf('email') >= 0) {
      const prevEmployee = await this.findOne(id);
      if (prevEmployee.email != updateEmployeeDto.email) {
        const findUser = await this.lookUp({ email: updateEmployeeDto.email } as FilterEmployeeDto);
        if (findUser) throw new NotFoundException('Ya existe un usuario con ese email');
      }
    }
    const updatedEmployee = await this.employeeModel.findByIdAndUpdate(id, updateEmployeeDto, {
      new: true,
    });
    if (!updatedEmployee) throw new NotFoundException('No se ha encontrado al profesional');
    return updatedEmployee;
  }

  async updatePassword(employeeId: string, newPassword: string) {
    return this.employeeModel.findByIdAndUpdate(employeeId, { password: newPassword }, { new: true });
  }

  async remove(id: string) {
    const deletedEmployee = await this.employeeModel.findByIdAndDelete(id);
    if (!deletedEmployee) throw new NotFoundException('No se ha encontrado al profesional');
    return deletedEmployee;
  }

  async upload(id: string, file: Express.Multer.File) {
    await this.removeProfileImage(id, false);
    return this.employeeModel.findByIdAndUpdate(id, { profile_image: file.filename }, { new: true });
  }

  async removeProfileImage(id: string, updateEmployee = true) {
    const employee = await this.employeeModel.findById(id);
    await this.filesService.removeProfileImage(employee.profile_image);
    if (updateEmployee) await this.employeeModel.findByIdAndUpdate(id, { profile_image: undefined });
  }

  async login(email: string, password: string) {
    const user = await this.employeeModel.findOne({ email });
    if (!user) throw new NotFoundException('No se ha encontrado al usuario');
    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new NotFoundException('Contraseña incorrecta');
    return user;
  }
}
