import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomQueryService } from 'src/services/custom-query.service';
import { FilterRoutineDto } from './dto/filter-routine.dto';
import { QueryRoutineDto } from './dto/query-routine.dto';
import { RoutineDto } from './dto/routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { RoutineDocument } from './schemas/routine.schemas';

@Injectable()
export class RoutinesService {
  constructor(
    @Inject(CustomQueryService) private readonly customQueryService: CustomQueryService,
    @InjectModel('routines') private readonly routineModel: Model<RoutineDocument>
  ) {}

  async findOne(id: string) {
    const routine = await this.routineModel.findById(id);
    if (!routine) throw new NotFoundException('No se ha encontrado la rutina');
    return routine;
  }

  async lookUp(filter: FilterRoutineDto) {
    const routine = await this.routineModel.findOne(filter);
    if (!routine) throw new NotFoundException('No se ha encontrado ningún resultado');
    return routine;
  }

  async filter(queryRoutineDto: QueryRoutineDto) {
    return await this.customQueryService.filter(queryRoutineDto, this.routineModel);
  }

  async create(routineDto: RoutineDto) {
    const routine = await this.routineModel.create(routineDto);
    return routine;
  }

  async update(id: string, updateRoutineDto: UpdateRoutineDto) {
    const updatedRoutine = await this.routineModel.findByIdAndUpdate(id, updateRoutineDto, {
      new: true,
    });
    if (!updateRoutineDto) throw new NotFoundException('No se ha encontrado la rutina');
    return updatedRoutine;
  }

  async remove(id: string) {
    const deletedRoutine = await this.routineModel.findByIdAndDelete(id);
    if (!deletedRoutine) throw new NotFoundException('No se ha encontrado la rutina');
    return deletedRoutine;
  }
}
