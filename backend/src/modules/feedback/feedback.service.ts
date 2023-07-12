import { Feedback, FeedbackDocument } from '@modules/feedback/schemas/feedback.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<FeedbackDocument>) {}

  async update(createFeedbackDto: CreateFeedbackDto) {
    // Find feedback if created today
    const date = new Date();
    const feedback = await this.feedbackModel
      .findOne({
        owner: createFeedbackDto.owner,
        createdAt: {
          $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
          $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
        },
      })
      .exec();
    if (feedback) {
      await this.feedbackModel.findOneAndUpdate({ _id: feedback._id }, createFeedbackDto);
      return;
    }
    return await this.feedbackModel.create(createFeedbackDto);
  }

  async getFeedbackOfDay(patientId: string, createdAt: string) {
    const date = new Date(createdAt);
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    return await this.feedbackModel
      .findOne({
        owner: patientId,
        createdAt: { $gte: startOfDay.toISOString(), $lt: endOfDay.toISOString() },
      })
      .exec();
  }

  getFeedbackByRange(patientId: string, start: string, end: string) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return this.feedbackModel.find({
      owner: patientId,
      createdAt: { $gte: startDate.toISOString(), $lt: endDate.toISOString() },
    });
  }
}
