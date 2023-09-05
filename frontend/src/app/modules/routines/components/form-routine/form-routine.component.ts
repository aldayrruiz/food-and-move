import { TitleCasePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AttachmentModel } from '@core/models/attachment/attachment.model';
import { RoutineRequestModel } from '@core/models/routine/routine-request.model';
import { RoutineModel } from '@core/models/routine/routine.model';
import { AttachmentsService } from '@core/services/api/attachments.service';
import { RoutinesService } from '@core/services/api/routines.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { ImportType } from '@shared/components/import-dialog/enums/import-type';
import { ImportDialogComponent } from '@shared/components/import-dialog/import-dialog.component';
import { LinkStructure } from '@shared/components/links-input/interfaces/link-structure';
import { VideoStructure } from '@shared/components/videos-input/interfaces/video-structure';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-form-routine',
  templateUrl: './form-routine.component.html',
  styleUrls: ['./form-routine.component.css', '../../../../../assets/styles/form.css'],
})
export class FormRoutineComponent implements OnInit {
  @Input() routine!: RoutineModel;
  @Input() edit = false;
  @Input() showImportRoutine = false;

  form!: FormGroup;
  links: Array<LinkStructure> = [];
  videos: Array<VideoStructure> = [];
  attachment: AttachmentModel | null = null;

  buttonClear = {
    title: false,
    description: false,
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly fb: FormBuilder,
    private readonly routinesService: RoutinesService,
    private readonly attachmentsService: AttachmentsService,
    private readonly optionalPipe: OptionalPipe,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService,
    private readonly routerService: RouterService,
    private readonly dialog: MatDialog,
    private readonly titleCasePipe: TitleCasePipe
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      title: [this.edit ? this.routine!.title : null, [Validators.required]],
      description: [this.edit ? this.routine!.description : null],
    });
    if (this.edit) {
      this.links =
        this.routine!.links.map((url, id) => {
          return { id, url };
        }) || [];
      this.videos =
        this.routine!.videos.map((url, id) => {
          return { id, url };
        }) || [];
      if (this.routine?.attachment) {
        this.loaderService.isLoading.next(true);
        this.attachmentsService
          .getAttachment(this.routine!.attachment)
          .pipe(finalize(() => this.loaderService.isLoading.next(false)))
          .subscribe(
            (res) => {
              this.attachment = res;
            },
            (err) => {
              this.attachment = null;
              console.log(err);
            }
          );
      } else {
        this.attachment = null;
      }
    }
  }

  get title(): string | null {
    return this.form.value.title;
  }

  get description(): string | null {
    return this.form.value.description;
  }

  clearField(field: string): void {
    this.form.value[field] = null;
    this.form.reset(this.form.value);
  }

  exit(): void {
    this.routerService.goToRoutines();
  }

  getRoutineRequest(edit = false): RoutineRequestModel {
    const request = {
      title: this.title,
      description: this.description,
      links: this.links.map((link) => link.url),
      videos: this.videos.map((video) => video.url),
      attachment: this.attachment ? this.attachment._id : null,
    };
    return edit ? request : this.optionalPipe.transform(request);
  }

  importRoutine() {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '800px',
      data: { type: ImportType.Routine, showCustom: this.edit },
    });

    dialogRef.afterClosed().subscribe({
      next: (res) => {
        const routine = res as RoutineModel;
        this.form.setValue({
          title: routine.title,
          description: routine.description ?? '',
        });
        this.links =
          routine.links.map((url, id) => {
            return { id, url };
          }) || [];
        this.videos =
          routine.videos.map((url, id) => {
            return { id, url };
          }) || [];

        if (routine.attachment) {
          this.loaderService.isLoading.next(true);
          this.attachmentsService
            .getAttachment(routine.attachment)
            .pipe(finalize(() => this.loaderService.isLoading.next(false)))
            .subscribe({
              next: (res) => {
                this.attachment = res;
              },
              error: (err) => {
                this.attachment = null;
                console.log(err);
              },
            });
        } else {
          this.attachment = null;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  changeToTitleCase(event: any) {
    event.target.value = this.titleCasePipe.transform(event.target.value);
  }
}
