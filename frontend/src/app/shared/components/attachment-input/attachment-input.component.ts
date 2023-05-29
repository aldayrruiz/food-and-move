import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AttachmentModel } from '@core/models/attachment.model';
import { URL_ATTACHMENTS } from 'src/app/constants/app.constants';
import { AttachmentsDialogComponent } from '../attachments-dialog/attachments-dialog.component';

@Component({
  selector: 'app-attachment-input',
  templateUrl: './attachment-input.component.html',
  styleUrls: ['./attachment-input.component.css', '../../../../assets/styles/form-input.css'],
})
export class AttachmentInputComponent implements OnInit {
  @Input() attachment: AttachmentModel | null = null;

  @Output() setAttachment = new EventEmitter<AttachmentModel | null>();

  constructor(private readonly dialog: MatDialog) {}

  ngOnInit(): void {}

  importPDF(): void {
    const dialogRef = this.dialog.open(AttachmentsDialogComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe(
      (res) => {
        this.setAttachment.emit(res);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  deletePDF(): void {
    this.setAttachment.emit(null);
  }

  viewPDF(): void {
    window.open(URL_ATTACHMENTS + this.attachment?.filename);
  }
}
