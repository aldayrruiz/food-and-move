import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { FilterRoutineDto } from './dto/filter-routine.dto';
import { QueryRoutineDto } from './dto/query-routine.dto';
import { RoutineDto } from './dto/routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { RoutinesService } from './routines.service';
import {Roles} from "@modules/auth/roles.decorator";
import {Role} from "@modules/auth/enums/role.enum";

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('routines')
@Controller('routines')
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.routinesService.findOne(id);
  }

  @Post('lookUp')
  async lookUp(@Body() filterRoutineDto: FilterRoutineDto) {
    return await this.routinesService.lookUp(filterRoutineDto);
  }

  @Post('filter')
  async filter(@Body() queryRoutineDto: QueryRoutineDto) {
    return await this.routinesService.filter(queryRoutineDto);
  }

  @Roles(Role.Admin)
  @Post('create')
  async create(@Body() routineDto: RoutineDto) {
    return await this.routinesService.create(routineDto);
  }

  @Roles(Role.Admin)
  @Patch('update/:id')
  async update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return await this.routinesService.update(id, updateRoutineDto);
  }

  @Roles(Role.Admin)
  @Delete('remove/:id')
  async remove(@Param('id') id: string) {
    return await this.routinesService.remove(id);
  }
}
