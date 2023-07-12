import { FeedbackInput } from '@core/models/feedback/input.model';
import { FeedbackWhen } from '@core/models/feedback/when';

export interface FeedbackModel {
  _id: string;
  when: FeedbackWhen;
  howDoYouFeel: FeedbackInput;
  howHaveYouFeel: FeedbackInput;
  howIsItGoingTheDiet: FeedbackInput;
  howIsItGoingTheExercises: FeedbackInput;
  owner: string;
}
