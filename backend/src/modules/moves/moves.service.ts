import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DateRangeDto } from '@shared/dto/date-range.dto';
import { Model } from 'mongoose';
import { getQueryDate } from 'src/utils/filter-dates.utils';
import { FindMoveDto } from './dto/find-move.dto';
import { MoveDto } from './dto/move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { MoveDocument } from './schemas/move.schemas';

@Injectable()
export class MovesService {
  constructor(@InjectModel('moves') private readonly moveModel: Model<MoveDocument>) {}

  async create(moveDto: MoveDto) {
    const move = await this.moveModel.create(moveDto);
    return move;
  }

  async findAll() {
    const moves = await this.moveModel.find({});
    return moves;
  }

  async findOne(id: string) {
    const move = await this.moveModel.findById(id);
    if (!move) throw new NotFoundException('No se ha encontrado el ejercicio');
    return move;
  }

  async find(findMoveDto: FindMoveDto) {
    const moves = await this.moveModel.find(findMoveDto);
    return moves;
  }

  async findByPatient(idPatient: string, dateRangeDto: DateRangeDto) {
    const foods = await this.moveModel.find(getQueryDate({ patient: idPatient }, dateRangeDto, 'date'));
    return foods;
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

  async removeByPatient(idPatient: string) {
    const moves = await this.moveModel.find({ patient: idPatient });
    moves.forEach(async (move) => {
      await this.moveModel.findByIdAndRemove(move._id);
    });
  }
}
