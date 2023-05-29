import { Component, Input, OnInit } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { TimeData } from './interfaces/time-data.interface';
import { GraphicColor } from './types/types';

@Component({
  selector: 'app-graphic',
  templateUrl: './graphic.component.html',
  styleUrls: ['./graphic.component.css'],
})
export class GraphicComponent implements OnInit {
  @Input() timeData?: TimeData;
  @Input() color: GraphicColor = [0, 0, 0];
  @Input() loading: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  backgroundColor(): string {
    return 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',0.2)';
  }

  borderColor(): string {
    return 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ')';
  }

  pointHoverBorderColor(): string {
    return 'rgba(' + this.color[0] + ',' + this.color[1] + ',' + this.color[2] + ',0.8)';
  }

  get lineChartData() {
    return {
      datasets: [
        {
          data: this.timeData?.data,
          label: this.timeData?.label,
          backgroundColor: this.backgroundColor(),
          borderColor: this.borderColor(),
          pointBackgroundColor: this.backgroundColor(),
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: this.pointHoverBorderColor(),
          fill: 'origin',
        },
      ],
    };
  }

  lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          tooltipFormat: 'DD T',
          unit: 'day',
        },
      },
    },
    animation: false,
    plugins: {
      legend: { display: true },
    },
  };

  lineChartType: ChartType = 'line';
}
