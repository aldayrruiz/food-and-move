import { Food, FoodDocument } from '@modules/foods/schemas/food.schema';
import { Move, MoveDocument } from '@modules/moves/schemas/move.schemas';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateRangeDto } from '@shared/dto/date-range.dto';
import { nextMonday, previousSunday } from 'date-fns';
import { Model } from 'mongoose';
import { CustomQueryService } from 'src/services/custom-query.service';
import { getQueryDate } from 'src/utils/filter-dates.utils';
import { ConsultDto } from './dto/consult.dto';
import { FilterConsultDto } from './dto/filter-consult.dto';
import { QueryConsultDto } from './dto/query-consult.dto';
import { UpdateConsultDto } from './dto/update-consult.dto';
import { Consult, ConsultDocument } from './schemas/consult.schema';

@Injectable()
export class ConsultsService {
  constructor(
    @InjectModel(Consult.name) private readonly consultModel: Model<ConsultDocument>,
    @InjectModel(Food.name) private readonly foodModel: Model<FoodDocument>,
    @InjectModel(Move.name) private readonly moveModel: Model<MoveDocument>,
    private readonly customQueryService: CustomQueryService
  ) {}

  async findOne(id: string) {
    const consult = await this.consultModel.findById(id);
    if (!consult) throw new NotFoundException('No se ha encontrado la consulta');
    return consult;
  }

  async findByPatient(patientId: string) {
    return this.consultModel.find({ patient: patientId });
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
    // Find consult
    const consult = await this.consultModel.findById(id);
    if (!consult) throw new NotFoundException('No se ha encontrado la consulta');
    // Remove dependencies
    await this.removeFoodsAssignedToConsult(consult);
    await this.removeMovesAssignedToConsult(consult);
    // Delete consult
    return this.consultModel.findByIdAndDelete(id);
  }

  async removeByPatient(patientId: string) {
    const consults = await this.consultModel.find({ patient: patientId });
    for (const consult of consults) {
      await this.remove(consult._id);
    }
  }

  async getValues(id: string, key: string, dateRangeDto: DateRangeDto) {
    const consults = await this.consultModel.find(getQueryDate({ patient: id }, dateRangeDto, 'created_at'));
    return consults
      .filter((consult) => consult[key])
      .map((consult) => {
        return { date: consult.created_at, value: consult[key] };
      })
      .sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0));
  }

  getLastConsult(patientId: string, employeeId: string) {
    return this.consultModel.findOne({ patient: patientId, employee: employeeId }).sort({ created_at: -1 });
  }

  private async removeFoodsAssignedToConsult(consult: ConsultDocument) {
    const patient = consult.patient;
    const { previousConsult, nextConsult } = await this.getBetweenConsults(consult);
    const deleteStart = previousConsult?.created_at ? nextMonday(previousConsult?.created_at) : undefined;
    const deleteEnd = nextConsult?.created_at ? previousSunday(nextConsult?.created_at) : undefined;
    if (deleteStart && deleteEnd) {
      await this.foodModel.deleteMany({ patient, date: { $gte: deleteStart, $lte: deleteEnd } });
      return;
    }
    if (deleteStart) {
      await this.foodModel.deleteMany({ patient, date: { $gte: deleteStart } });
      return;
    }
    if (deleteEnd) {
      await this.foodModel.deleteMany({ patient, date: { $lte: deleteEnd } });
      return;
    }
    if (!previousConsult && !nextConsult) {
      await this.foodModel.deleteMany({ patient });
    }
  }

  private async removeMovesAssignedToConsult(consult: ConsultDocument) {
    const patient = consult.patient;
    const { previousConsult, nextConsult } = await this.getBetweenConsults(consult);
    const deleteStart = previousConsult?.created_at ? nextMonday(previousConsult?.created_at) : null;
    const deleteEnd = nextConsult?.created_at ? previousSunday(nextConsult?.created_at) : null;
    if (deleteStart && deleteEnd) {
      await this.moveModel.deleteMany({ patient, date: { $gte: deleteStart, $lte: deleteEnd } });
      return;
    }
    if (deleteStart) {
      await this.moveModel.deleteMany({ patient, date: { $gte: deleteStart } });
      return;
    }
    if (deleteEnd) {
      await this.moveModel.deleteMany({ patient, date: { $lte: deleteEnd } });
      return;
    }
    if (!previousConsult && !nextConsult) {
      await this.moveModel.deleteMany({ patient });
      return;
    }
  }

  private async getBetweenConsults(consult: ConsultDocument) {
    const patient = consult.patient;
    const previousConsult = await this.consultModel
      .findOne({ patient, created_at: { $lt: consult.created_at } })
      .sort({ created_at: -1 })
      .exec();
    const nextConsult = await this.consultModel
      .findOne({ patient, created_at: { $gt: consult.created_at } })
      .sort({ created_at: 1 })
      .exec();
    return { previousConsult, nextConsult };
  }
}
