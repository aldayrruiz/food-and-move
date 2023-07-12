import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConsultModel } from '@core/models/consult/consult.model';

@Component({
  selector: 'app-info-consult',
  templateUrl: './info-consult.component.html',
  styleUrls: ['./info-consult.component.css', '../../../../../assets/styles/info-dialog.css'],
})
export class InfoConsultComponent implements OnInit {
  constructor(
    private readonly dialogRef: MatDialogRef<InfoConsultComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly consult: ConsultModel
  ) {}

  ngOnInit(): void {}
}
