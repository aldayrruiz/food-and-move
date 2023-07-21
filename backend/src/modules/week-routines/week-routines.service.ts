import { UpdateRoutineDto } from '@modules/routines/dto/update-routine.dto';
import { QueryWeekRoutineDto } from '@modules/week-routines/dto/query-week-routine.dto';
import { WeekRoutineDto } from '@modules/week-routines/dto/week-routine.dto';
import { WeekRoutine, WeekRoutineDocument } from '@modules/week-routines/schemas/week-routine.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomQueryService } from '@services/custom-query.service';
import { Model } from 'mongoose';

@Injectable()
export class WeekRoutinesService {
  constructor(
    @InjectModel(WeekRoutine.name) private readonly weekRoutineModel: Model<WeekRoutineDocument>,
    private readonly customQueryService: CustomQueryService
  ) {}

  async findOne(id: string) {
    const weekRoutine = await this.weekRoutineModel.findById(id);
    return weekRoutine;
  }

  async create(weekRoutineDto: WeekRoutineDto) {
    const weekRoutine = await this.weekRoutineModel.create(weekRoutineDto);
    return weekRoutine;
  }

  async filter(queryWeekRoutineDto: QueryWeekRoutineDto) {
    return await this.customQueryService.filter(queryWeekRoutineDto, this.weekRoutineModel);
  }

  async update(id: string, weekRoutineDto: UpdateRoutineDto) {
    const updatedWeekRoutine = await this.weekRoutineModel.findByIdAndUpdate(id, weekRoutineDto, { new: true });
    return updatedWeekRoutine;
  }

  async remove(id: string) {
    const deletedWeekRoutine = await this.weekRoutineModel.findByIdAndDelete(id);
    return deletedWeekRoutine;
  }
}
