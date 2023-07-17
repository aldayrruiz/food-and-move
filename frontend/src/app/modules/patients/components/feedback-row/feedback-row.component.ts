import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { FeedbackModel } from '@core/models/feedback/feedback.model';
import { FeedbackInput } from '@core/models/feedback/input.model';
import { eachDayOfInterval } from 'date-fns';

@Component({
  selector: 'app-feedback-row',
  templateUrl: './feedback-row.component.html',
  styleUrls: ['./feedback-row.component.css', '../../../../../assets/styles/form.css'],
})
export class FeedbackRowComponent implements OnInit, OnChanges {
  @Input() text!: string;
  @Input() feedbacks!: FeedbackModel[];
  @Input() dateRange!: DateRange<Date>;
  @Input() fieldInput!: string;
  goodAnsweredPercentage!: number;
  neutralAnsweredPercentage!: number;
  badAnsweredPercentage!: number;
  notAnsweredPercentage!: number;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.initPercentages();
  }

  initPercentages() {
    if (!this.dateRange?.start || !this.dateRange?.end) return;
    const days = eachDayOfInterval({
      start: new Date(this.dateRange.start),
      end: this.dateRange.end,
    });
    const daysAnswered = this.feedbacks.length;
    // @ts-ignore
    const good = this.feedbacks.filter((f) => f[this.fieldInput] === FeedbackInput.GOOD).length;
    console.log(good);
    // @ts-ignore
    const neutral = this.feedbacks.filter(
      // @ts-ignore
      (f) => f[this.fieldInput] === FeedbackInput.NEUTRAL
    ).length;
    // @ts-ignore
    const bad = this.feedbacks.filter((f) => f[this.fieldInput] === FeedbackInput.BAD).length;
    // @ts-ignore
    const notAnswered = this.feedbacks.filter((f) => !f[this.fieldInput]).length;
    this.goodAnsweredPercentage = Math.round((good / days.length) * 100);
    this.neutralAnsweredPercentage = Math.round((neutral / days.length) * 100);
    this.badAnsweredPercentage = Math.round((bad / days.length) * 100);
    const daysNotAnswered = days.length - daysAnswered;
    this.notAnsweredPercentage = Math.round(((notAnswered + daysNotAnswered) / days.length) * 100);
  }
}
