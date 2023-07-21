import { UpdateRoutineDto } from '@modules/routines/dto/update-routine.dto';
import { QueryWeekRoutineDto } from '@modules/week-routines/dto/query-week-routine.dto';
import { WeekRoutineDto } from '@modules/week-routines/dto/week-routine.dto';
import { WeekRoutine, WeekRoutineDocument } from '@modules/week-routines/schemas/week-routine.schema';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomQueryService } from '@services/custom-query.service';
import { DayOfWeek } from '@shared/enums/day-of-week';
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

  async getRoutine(weekRoutineId: string, day: DayOfWeek, routineId: string) {
    const weekRoutine = await this.weekRoutineModel.findById(weekRoutineId);
    if (!weekRoutine) throw new NotFoundException('No se ha encontrado la rutina semanal');
    const dayItems = this.getDayItems(day, weekRoutine);
    const index = dayItems.findIndex((routine) => routine._id == routineId);
    if (index === -1) throw new NotFoundException('No se ha encontrado la rutina');
    return dayItems[index];
  }

  async addRoutine(weekRoutineId: string, day: DayOfWeek, routineDto: UpdateRoutineDto) {
    const diet = await this.weekRoutineModel.findById(weekRoutineId);
    if (!diet) throw new NotFoundException('No se ha encontrado la rutina semanal');
    const dayItems = this.getDayItems(day, diet);
    dayItems.push(routineDto);
    const update = this.getUpdateDayItems(day, dayItems);
    return this.weekRoutineModel.findByIdAndUpdate(weekRoutineId, update, { new: true });
  }

  async updateRoutine(weekRoutineId: string, day: DayOfWeek, routineId: string, updateRoutine: UpdateRoutineDto) {
    const weekRoutine = await this.weekRoutineModel.findById(weekRoutineId);
    if (!weekRoutine) throw new NotFoundException('No se ha encontrado la rutina semanal');
    const dayItems = this.getDayItems(day, weekRoutine);
    const index = dayItems.findIndex((routine) => routine._id == routineId);
    if (index === -1) throw new NotFoundException('No se ha encontrado la rutina');
    dayItems[index] = { ...dayItems[index], ...updateRoutine };
    const update = this.getUpdateDayItems(day, dayItems);
    return this.weekRoutineModel.findByIdAndUpdate(weekRoutineId, update, { new: true });
  }

  async removeRoutine(weekRoutineId: string, day: DayOfWeek, routineId: string) {
    const weekRoutine = await this.weekRoutineModel.findById(weekRoutineId);
    if (!weekRoutine) throw new NotFoundException('No se ha encontrado la rutina semanal');
    const dayItems = this.getDayItems(day, weekRoutine);
    const index = dayItems.findIndex((routine) => routine._id == routineId);
    if (index !== -1) {
      dayItems.splice(index, 1);
      const update = this.getUpdateDayItems(day, dayItems);
      return this.weekRoutineModel.findByIdAndUpdate(weekRoutineId, update, { new: true });
    } else {
      return weekRoutine;
    }
  }

  private getDayItems(day: DayOfWeek, weekRoutine: any) {
    switch (day) {
      case DayOfWeek.Lunes:
        return weekRoutine.monday;
      case DayOfWeek.Martes:
        return weekRoutine.tuesday;
      case DayOfWeek.Miercoles:
        return weekRoutine.wednesday;
      case DayOfWeek.Jueves:
        return weekRoutine.thursday;
      case DayOfWeek.Viernes:
        return weekRoutine.friday;
      case DayOfWeek.Sabado:
        return weekRoutine.saturday;
      case DayOfWeek.Domingo:
        return weekRoutine.sunday;
      default:
        return [];
    }
  }

  private getUpdateDayItems(day: DayOfWeek, items: any) {
    switch (day) {
      case DayOfWeek.Lunes:
        return { monday: items };
      case DayOfWeek.Martes:
        return { tuesday: items };
      case DayOfWeek.Miercoles:
        return { wednesday: items };
      case DayOfWeek.Jueves:
        return { thursday: items };
      case DayOfWeek.Viernes:
        return { friday: items };
      case DayOfWeek.Sabado:
        return { saturday: items };
      case DayOfWeek.Domingo:
        return { sunday: items };
      default:
        return {};
    }
  }
}
