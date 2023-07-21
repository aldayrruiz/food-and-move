import { UpdateRoutineDto } from '@modules/routines/dto/update-routine.dto';
import { QueryWeekRoutineDto } from '@modules/week-routines/dto/query-week-routine.dto';
import { WeekRoutineDto } from '@modules/week-routines/dto/week-routine.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DayOfWeek } from '@shared/enums/day-of-week';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { WeekRoutinesService } from './week-routines.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('week-routines')
@Controller('week-routines')
export class WeekRoutinesController {
  constructor(private readonly weekRoutineService: WeekRoutinesService) {}

  @Get('getRoutine')
  async getRoutine(@Query('weekRoutineId') weekRoutineId: string, @Query('day') day: DayOfWeek, @Query('routineId') routineId: string) {
    return await this.weekRoutineService.getRoutine(weekRoutineId, day, routineId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.weekRoutineService.findOne(id);
  }

  @Post()
  async create(@Body() weekRoutineDto: WeekRoutineDto) {
    return await this.weekRoutineService.create(weekRoutineDto);
  }

  @Post('addRoutine')
  async addRoutine(@Query('weekRoutineId') weekRoutineId: string, @Query('day') day: DayOfWeek, @Body() routineDto: UpdateRoutineDto) {
    return await this.weekRoutineService.addRoutine(weekRoutineId, day, routineDto);
  }

  @Post('filter')
  async filter(@Body() queryWeekRoutineDto: QueryWeekRoutineDto) {
    return await this.weekRoutineService.filter(queryWeekRoutineDto);
  }

  @Patch('updateRoutine')
  async updateRoutine(
    @Query('weekRoutineId') weekRoutineId: string,
    @Query('day') day: DayOfWeek,
    @Query('routineId') routineId: string,
    @Body() routineDto: UpdateRoutineDto
  ) {
    return await this.weekRoutineService.updateRoutine(weekRoutineId, day, routineId, routineDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() weekRoutineDto: UpdateRoutineDto) {
    return await this.weekRoutineService.update(id, weekRoutineDto);
  }

  @Delete('removeRoutine')
  async removeRoutine(@Query('weekRoutineId') weekRoutineId: string, @Query('day') day: DayOfWeek, @Query('routineId') routineId: string) {
    return await this.weekRoutineService.removeRoutine(weekRoutineId, day, routineId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.weekRoutineService.remove(id);
  }
}
