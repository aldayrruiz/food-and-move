import { FoodDto } from '@modules/foods/dto/food.dto';
import { Recipe } from '@modules/recipes/schemas/recipe.schema';
import { Routine } from '@modules/routines/schemas/routine.schema';
import { WeekRoutine } from '@modules/week-routines/schemas/week-routine.schema';
import { WeekRoutinesService } from '@modules/week-routines/week-routines.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateRangeDto } from '@shared/dto/date-range.dto';
import { Model } from 'mongoose';
import { getQueryDate } from 'src/utils/filter-dates.utils';
import { addDay, getDateRange } from '../../utils/date-utils';
import { FindMoveDto } from './dto/find-move.dto';
import { MoveDto } from './dto/move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { Move, MoveDocument } from './schemas/move.schemas';

@Injectable()
export class MovesService {
  constructor(
    @InjectModel(Move.name) private readonly moveModel: Model<MoveDocument>,
    private readonly weekRoutinesService: WeekRoutinesService
  ) {}

  async create(moveDto: MoveDto) {
    return await this.moveModel.create(moveDto);
  }

  async findAll() {
    return this.moveModel.find({});
  }

  async findOne(id: string) {
    const move = await this.moveModel.findById(id);
    if (!move) throw new NotFoundException('No se ha encontrado el ejercicio');
    return move;
  }

  async find(findMoveDto: FindMoveDto) {
    return this.moveModel.find(findMoveDto);
  }

  async findByPatient(idPatient: string, dateRangeDto: DateRangeDto) {
    return this.moveModel.find(getQueryDate({ patient: idPatient }, dateRangeDto, 'date'));
  }

  async update(id: string, updateMoveDto: UpdateMoveDto) {
    const updatedMove = await this.moveModel.findByIdAndUpdate(id, updateMoveDto, { new: true });
    if (!updatedMove) throw new NotFoundException('No se ha encontrado el ejercicio');
    return updatedMove;
  }

  async remove(id: string) {
    const deletedMove = await this.moveModel.findByIdAndDelete(id);
    if (!deletedMove) throw new NotFoundException('No se ha encontrado el ejercicio');
    return deletedMove;
  }

  async importWeekRoutine(weekRoutineId: string, patientId: string, date: Date) {
    const weekRoutine = await this.weekRoutinesService.findOne(weekRoutineId);
    const dateRange: { startDate: Date; endDate: Date } = getDateRange(date);

    for (let i = 0; i < 7; i++) {
      const day: Date = addDay(dateRange.startDate, i);
      const recipes: Recipe[] = this.getRoutinesFromWeekRoutineByIndexDay(weekRoutine, i);
      await this.createMovesForPatient(recipes, patientId, day);
    }
    return await this.findByPatient(patientId, dateRange);
  }

  async clearMoves(patientId: string, dateRangeDto?: DateRangeDto) {
    if (!dateRangeDto) {
      return this.moveModel.deleteMany({ patient: patientId });
    }

    const moves = await this.findByPatient(patientId, dateRangeDto);
    for (const move of moves) {
      await this.remove(move._id);
    }
  }

  async lastMovesAssigned(patientId: string, limitDate: string) {
    const lastFoodAssigned = await this.moveModel
      .findOne({
        patient: patientId,
        date: { $lt: limitDate },
      })
      .sort({ date: -1 })
      .exec();
    const range = getDateRange(lastFoodAssigned.date);
    return await this.findByPatient(patientId, range);
  }

  private getRoutinesFromWeekRoutineByIndexDay(weekRoutine: WeekRoutine, indexDay: number): Recipe[] {
    const recipesByIndex = {
      0: weekRoutine.monday,
      1: weekRoutine.tuesday,
      2: weekRoutine.wednesday,
      3: weekRoutine.thursday,
      4: weekRoutine.friday,
      5: weekRoutine.saturday,
      6: weekRoutine.sunday,
    };
    return recipesByIndex[indexDay];
  }

  async createMovesForPatient(routines: Routine[], patientId: string, date: Date) {
    if (routines.length == 0) return;
    for (const routine of routines) {
      // Do not use "...recipe" because it is a mongoose object (not dto)
      const food = {
        title: routine.title,
        description: routine.description,
        links: routine.links,
        videos: routine.videos,
        attachment: routine.attachment,
        patient: patientId,
        comments: '',
        date,
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await this.create(food as FoodDto);
    }
  }
}
