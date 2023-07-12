import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttachmentModel } from '@core/models/attachment/attachment.model';
import { RoutineModel } from '@core/models/routine/routine.model';
import { AttachmentsService } from '@core/services/attachments.service';
import { LoaderService } from '@core/services/loader.service';
import { finalize } from 'rxjs';
import { URL_ATTACHMENTS } from 'src/app/constants/app.constants';

@Component({
  selector: 'app-info-routine',
  templateUrl: './info-routine.component.html',
  styleUrls: ['./info-routine.component.css', '../../../../../assets/styles/info-dialog.css'],
})
export class InfoRoutineComponent implements OnInit {
  attachment: AttachmentModel | null = null;

  constructor(
    private readonly dialogRef: MatDialogRef<InfoRoutineComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly routine: RoutineModel,
    private readonly attachmentsService: AttachmentsService,
    private readonly loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    if (this.routine.attachment) {
      this.loaderService.isLoading.next(true);
      this.attachmentsService
        .getAttachment(this.routine.attachment)
        .pipe(finalize(() => this.loaderService.isLoading.next(false)))
        .subscribe(
          (res) => {
            this.attachment = res;
          },
          (err) => {
            console.log(err);
          }
        );
    }
  }

  getAttachmentUrl(): string {
    return URL_ATTACHMENTS + this.attachment?.filename;
  }
}
