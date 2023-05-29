import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WeeklyCalendarType } from './enums/weekly-calendar-type';
import { Day } from './interfaces/day';

@Component({
  selector: 'app-weekly-calendar',
  templateUrl: './weekly-calendar.component.html',
  styleUrls: ['./weekly-calendar.component.css'],
})
export class WeeklyCalendarComponent implements OnInit {
  @Input() days: Day[] = [];
  @Input() type: WeeklyCalendarType = WeeklyCalendarType.Food;
  @Input() showDate: boolean = true;
  @Input() showRating: boolean = true;

  @Output() add = new EventEmitter<Day>();
  @Output() edit = new EventEmitter<{ day: Day; item: any }>();
  @Output() delete = new EventEmitter<{ day: Day; item: any }>();

  weeklyCalendarType = WeeklyCalendarType;

  constructor() {}

  ngOnInit(): void {}

  addItem(weekday: Day) {
    this.add.emit(weekday);
  }

  editItem(day: Day, item: any) {
    this.edit.emit({ day, item });
  }

  deleteItem(day: Day, item: any) {
    this.delete.emit({ day, item });
  }
}
