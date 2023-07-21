import { UpdateRoutineDto } from '@modules/routines/dto/update-routine.dto';
import { QueryWeekRoutineDto } from '@modules/week-routines/dto/query-week-routine.dto';
import { WeekRoutineDto } from '@modules/week-routines/dto/week-routine.dto';
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { WeekRoutinesService } from './week-routines.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('week-routines')
@Controller('week-routines')
export class WeekRoutinesController {
  constructor(private readonly weekRoutineService: WeekRoutinesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.weekRoutineService.findOne(id);
  }

  @Post()
  async create(@Body() weekRoutineDto: WeekRoutineDto) {
    console.log(weekRoutineDto);
    return await this.weekRoutineService.create(weekRoutineDto);
  }

  @Post('filter')
  async filter(@Body() queryWeekRoutineDto: QueryWeekRoutineDto) {
    return await this.weekRoutineService.filter(queryWeekRoutineDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() weekRoutineDto: UpdateRoutineDto) {
    return await this.weekRoutineService.update(id, weekRoutineDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.weekRoutineService.remove(id);
  }
}
