import { FeedbackInput } from '@modules/feedback/dto/feedback-input.dto';
import { IsEnum, IsMongoId, IsOptional } from 'class-validator';

export class CreateFeedbackDto {
  @IsEnum(FeedbackInput)
  @IsOptional()
  howDoYouFeel?: FeedbackInput;

  @IsEnum(FeedbackInput)
  @IsOptional()
  howHaveYouFeel?: FeedbackInput;

  @IsEnum(FeedbackInput)
  @IsOptional()
  howIsItGoingTheDiet?: FeedbackInput;

  @IsEnum(FeedbackInput)
  @IsOptional()
  howIsItGoingTheExercises?: FeedbackInput;

  @IsMongoId()
  @IsOptional()
  owner: string;
}
