import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomQueryService } from 'src/services/custom-query.service';
import { DateRangeDto } from 'src/shared/dto/date-range.dto';
import { getQueryDate } from 'src/utils/filter-dates.utils';
import { ConsultDto } from './dto/consult.dto';
import { FilterConsultDto } from './dto/filter-consult.dto';
import { QueryConsultDto } from './dto/query-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';
import { ConsultDocument } from './schemas/consult.schema';

@Injectable()
export class ConsultsService {
  constructor(
    @Inject(CustomQueryService) private readonly customQueryService: CustomQueryService,
    @InjectModel('consults') private readonly consultModel: Model<ConsultDocument>
  ) {}

  async findOne(id: string) {
    const consult = await this.consultModel.findById(id);
    if (!consult) throw new NotFoundException('No se ha encontrado la consulta');
    return consult;
  }

  async findByPatient(patientId: string) {
    const consults = await this.consultModel.find({ patient: patientId });
    return consults;
  }

  async lookUp(filterConsultDto: FilterConsultDto) {
    const consult = await this.consultModel.findOne(filterConsultDto);
    if (!consult) throw new NotFoundException('No se ha encontrado ningún resultado');
    return consult;
  }

  async filter(queryConsultDto: QueryConsultDto) {
    return await this.customQueryService.filter(queryConsultDto, this.consultModel);
  }

  async create(consultDto: ConsultDto) {
    const consult = await this.consultModel.create(consultDto);
    return consult;
  }

  async update(id: string, updateConsultDto: UpdateConsultDto) {
    const updatedConsult = await this.consultModel.findByIdAndUpdate(id, updateConsultDto, {
      new: true,
    });
    if (!updatedConsult) throw new NotFoundException('No se ha encontrado la consulta');
    return updatedConsult;
  }

  async remove(id: string) {
    const deletedConsutl = await this.consultModel.findByIdAndDelete(id);
    if (!deletedConsutl) throw new NotFoundException('No se ha encontrado la consulta');
    return deletedConsutl;
  }

  async removeByPatient(patientId: string) {
    const consults = await this.consultModel.find({ patient: patientId });
    consults.forEach(async (consult) => {
      const deletedConsult = await this.consultModel.findByIdAndDelete(consult._id);
    });
  }

  async getValues(id: string, key: string, dateRangeDto: DateRangeDto) {
    const consults = await this.consultModel.find(
      getQueryDate({ patient: id }, dateRangeDto, 'created_at')
    );
    return consults
      .filter((consult) => consult[key])
      .map((consult) => {
        return { date: consult.created_at, value: consult[key] };
      })
      .sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
  }
}
