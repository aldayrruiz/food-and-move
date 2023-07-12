import { FeedbackInput } from '@modules/feedback/dto/feedback-input.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type FeedbackDocument = Feedback & Document;

@Schema()
export class Feedback {
  @Prop({ enum: FeedbackInput })
  howDoYouFeel: FeedbackInput;

  @Prop({ enum: FeedbackInput })
  howHaveYouFeel: FeedbackInput;

  @Prop({ enum: FeedbackInput })
  howIsItGoingTheDiet: FeedbackInput;

  @Prop({ enum: FeedbackInput })
  howIsItGoingTheExercises: FeedbackInput;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true })
  owner: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
