import { Component, OnInit } from '@angular/core';
import {
  DateRange,
  DefaultMatCalendarRangeStrategy,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { FeedbackModel } from '@core/models/feedback/feedback.model';
import { FeedbackInput } from '@core/models/feedback/input.model';
import { PatientModel } from '@core/models/patient/patient.model';
import { FeedbackService } from '@core/services/feedback.service';
import { PatientsService } from '@core/services/patients.service';
import { addDay, getDateUTC } from '@core/utils/date-utils';
import { differenceInCalendarDays, format, isSameDay } from 'date-fns';

@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.component.html',
  styleUrls: ['./feedback-page.component.css', '../../../../../assets/styles/form.css'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: DefaultMatCalendarRangeStrategy,
    },
  ],
})
export class FeedbackPageComponent implements OnInit {
  patient!: PatientModel;
  // Feedback by day
  created_at: Date = getDateUTC(new Date());
  feedback?: FeedbackModel;

  // Feedback by range
  dateRange: DateRange<Date> = new DateRange<Date>(new Date(), new Date());
  feedbacks: FeedbackModel[] = [];

  // Stats
  goodAnsweredPercentage!: number;
  neutralAnsweredPercentage!: number;
  badAnsweredPercentage!: number;
  notAnsweredPercentage!: number;

  constructor(
    private readonly patientsService: PatientsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly feedbackService: FeedbackService
  ) {}

  ngOnInit(): void {
    this.initPatient();
  }

  getIconByFeedbackInput(input: FeedbackInput | undefined) {
    if (!input) return 'assets/images/glad.png';
    const iconsMap = {
      GOOD: 'assets/images/glad.png',
      NEUTRAL: 'assets/images/normal.png',
      BAD: 'assets/images/sad.png',
    };
    return iconsMap[input];
  }

  onSelectedDateRangeChanged(date: Date | null): void {
    if (!date) return;
    if (date > new Date()) return;

    if (this.dateRange?.start && date >= this.dateRange.start && !this.dateRange.end) {
      // User pick the end date.
      this.dateRange = new DateRange(this.dateRange.start, date);
      this.feedback = undefined;
    } else {
      // User first pick the start date.
      this.dateRange = new DateRange(date, null);
    }

    // Start and end date are the same day so .
    if (
      this.dateRange?.start &&
      this.dateRange?.end &&
      isSameDay(this.dateRange.start, this.dateRange.end)
    ) {
      this.fetchFeedbacksByDay(format(date, 'yyyy-MM-dd'));
    }

    // Start and end date exists, so we fetch feedbacks by range.
    if (this.dateRange?.start && this.dateRange?.end) {
      const start = format(this.dateRange.start, 'yyyy-MM-dd');
      const end = format(addDay(this.dateRange.end, 1), 'yyyy-MM-dd');
      this.fetchFeedbacksByRange(start, end);
    }
  }

  private fetchFeedbacksByRange(start: string, end: string) {
    this.feedbackService.getFeedbackByRange(this.patient._id, start, end).subscribe({
      next: (feedbacks) => {
        this.feedbacks = feedbacks;
        this.calculateStats();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private fetchFeedbacksByDay(date: string) {
    this.feedbackService.getFeedbackByDay(this.patient._id, date).subscribe({
      next: (feedback) => {
        this.feedback = feedback;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  private calculateStats() {
    const start = this.dateRange.start || new Date();
    const end = this.dateRange.end || new Date();
    const days = differenceInCalendarDays(end, start) + 1; // +1 because we count the start day.
    const questionsAskedPerDay = 4;
    const totalQuestionsAsked = days * questionsAskedPerDay;
    const { mapper, totalQuestionsAnswered } = this.getTotalQuestionsAnswered();
    const totalQuestionNotAnswered = totalQuestionsAsked - totalQuestionsAnswered;
    this.goodAnsweredPercentage = (mapper.GOOD / totalQuestionsAsked) * 100;
    this.neutralAnsweredPercentage = (mapper.NEUTRAL / totalQuestionsAsked) * 100;
    this.badAnsweredPercentage = (mapper.BAD / totalQuestionsAsked) * 100;
    this.notAnsweredPercentage = (totalQuestionNotAnswered / totalQuestionsAsked) * 100;
    console.log(mapper);
  }

  private getTotalQuestionsAnswered() {
    let totalQuestionsAnswered = 0;
    const mapper = { GOOD: 0, NEUTRAL: 0, BAD: 0 };
    this.feedbacks.forEach((feedback) => {
      if (this.sumFeedbackInputToMapper(mapper, feedback.howDoYouFeel)) {
        totalQuestionsAnswered += 1;
      }
      if (this.sumFeedbackInputToMapper(mapper, feedback.howHaveYouFeel)) {
        totalQuestionsAnswered += 1;
      }
      if (this.sumFeedbackInputToMapper(mapper, feedback.howIsItGoingTheDiet)) {
        totalQuestionsAnswered += 1;
      }
      if (this.sumFeedbackInputToMapper(mapper, feedback.howIsItGoingTheExercises)) {
        totalQuestionsAnswered += 1;
      }
    });
    return { mapper, totalQuestionsAnswered };
  }

  sumFeedbackInputToMapper(mapper: any, feedbackInput: FeedbackInput | undefined) {
    if (!feedbackInput) return false;
    mapper[feedbackInput] += 1;
    return true;
  }

  private initPatient() {
    this.activatedRoute.data.subscribe({
      next: (data) => {
        this.patient = data['patient'];
      },
    });
  }
}
