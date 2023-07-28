import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DateRangeDto } from '@shared/dto/date-range.dto';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { FindMoveDto } from './dto/find-move.dto';
import { MoveDto } from './dto/move.dto';
import { UpdateMoveDto } from './dto/update-move.dto';
import { MovesService } from './moves.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('moves')
@Controller('moves')
export class MovesController {
  constructor(private readonly movesService: MovesService) {}

  @Post()
  async create(@Body() moveDto: MoveDto) {
    return await this.movesService.create(moveDto);
  }

  @Get('findAll')
  async findAll() {
    return await this.movesService.findAll();
  }

  @Get('lastAssigned/:patientId')
  async lastMovesAssigned(@Param('patientId') patientId: string, @Query('limitDate') limitDate: string) {
    return await this.movesService.lastMovesAssigned(patientId, limitDate);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.movesService.findOne(id);
  }

  @Post('find')
  async find(@Body() findMoveDto: FindMoveDto) {
    return await this.movesService.find(findMoveDto);
  }

  @Post('findByPatient/:id')
  async findByPatient(@Param('id') id: string, @Body() dateRangeDto: DateRangeDto) {
    return await this.movesService.findByPatient(id, dateRangeDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateMoveDto: UpdateMoveDto) {
    return await this.movesService.update(id, updateMoveDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.movesService.remove(id);
  }

  @Post('clearMoves/:patientId')
  async clearMoves(@Param('patientId') patientId: string, @Body() dateRangeDto: DateRangeDto) {
    return await this.movesService.clearMoves(patientId, dateRangeDto);
  }

  @Post('importWeekRoutine')
  async importWeekRoutine(@Query('weekRoutineId') weekRoutineId, @Query('patientId') patientId, @Query('date') date: Date) {
    return await this.movesService.importWeekRoutine(weekRoutineId, patientId, date);
  }
}
