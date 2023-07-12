import { Body, Controller, Get, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { FeedbackService } from './feedback.service';

@UseGuards(JwtAuthGuard)
@ApiTags('foods')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Put()
  putFeedback(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.update(createFeedbackDto);
  }

  @Get('byPatientAndDay/:patientId')
  getFeedbackOfDay(@Param('patientId') patientId: string, @Query('createdAt') createdAt: string) {
    return this.feedbackService.getFeedbackOfDay(patientId, createdAt);
  }

  @Get('byPatientAndRange/:patientId')
  getFeedbackByRange(@Param('patientId') patientId: string, @Query('start') start: string, @Query('end') end: string) {
    return this.feedbackService.getFeedbackByRange(patientId, start, end);
  }
}
