import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AttachmentModel } from '@core/models/attachment/attachment.model';
import { MoveRequestModel } from '@core/models/move/move-request.model';
import { MoveModel } from '@core/models/move/move.model';
import { PatientModel } from '@core/models/patient/patient.model';
import { RoutineModel } from '@core/models/routine/routine.model';
import { AttachmentsService } from '@core/services/api/attachments.service';
import { MovesService } from '@core/services/api/moves.service';
import { PatientsService } from '@core/services/api/patients.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { RouterService } from '@core/services/router.service';
import { getDateUTC } from '@core/utils/date-utils';
import { ImportType } from '@shared/components/import-dialog/enums/import-type';
import { ImportDialogComponent } from '@shared/components/import-dialog/import-dialog.component';
import { LinkStructure } from '@shared/components/links-input/interfaces/link-structure';
import { VideoStructure } from '@shared/components/videos-input/interfaces/video-structure';
import { OptionalPipe } from '@shared/pipes/optional.pipe';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-move-page',
  templateUrl: './add-move-page.component.html',
  styleUrls: ['./add-move-page.component.css', '../../../../../../assets/styles/form.css'],
})
export class AddMovePageComponent implements OnInit {
  patient!: PatientModel;

  date = new Date();

  form!: FormGroup;
  edit = false;
  move: MoveModel | null = null;

  links: Array<LinkStructure> = [];
  videos: Array<VideoStructure> = [];
  attachment: AttachmentModel | null = null;

  buttonClear = {
    title: false,
    description: false,
    comments: false,
  };

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly patientsService: PatientsService,
    private readonly fb: FormBuilder,
    private readonly movesService: MovesService,
    private readonly attachmentsService: AttachmentsService,
    private readonly optionalPipe: OptionalPipe,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService,
    private readonly routerService: RouterService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loaderService.isLoading.next(true);
    this.initDate();
    this.initPatient();
    this.initMove();
    this.initForm();
    this.loaderService.isLoading.next(false);
  }

  initForm(): void {
    this.form = this.fb.group({
      title: [this.edit ? this.move!.title : null, [Validators.required]],
      description: [this.edit ? this.move!.description : null],
      comments: [this.edit ? this.move!.comments : null],
    });
    if (this.edit) {
      this.links =
        this.move!.links.map((url, id) => {
          return { id, url };
        }) || [];
      this.videos =
        this.move!.videos.map((url, id) => {
          return { id, url };
        }) || [];
      if (this.move?.attachment) {
        this.loaderService.isLoading.next(true);
        this.attachmentsService
          .getAttachment(this.move!.attachment)
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

  get comments(): string | null {
    return this.form.value.comments;
  }

  clearField(field: string): void {
    this.form.value[field] = null;
    this.form.reset(this.form.value);
  }

  exit(): void {
    this.routerService.goToMoves(this.patient._id, this.date);
  }

  importRoutine(): void {
    const dialogRef = this.dialog.open(ImportDialogComponent, {
      width: '800px',
      data: ImportType.Routine,
    });
    dialogRef.afterClosed().subscribe(
      (res) => {
        if (res) {
          const routine = res as RoutineModel;
          this.form.setValue({
            title: routine.title,
            description: routine.description ? routine.description : '',
            comments: this.comments,
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
      },
      (err) => {
        console.log(err);
      }
    );
  }

  addMove(): void {
    this.loaderService.isLoading.next(true);
    const move = this.getMoveRequest();
    this.movesService
      .createMove(move)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      )
      .subscribe(
        (res) => {
          this.exit();
          this.snackerService.showSuccessful('Ejercicio creado con éxito');
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }

  editMove(): void {
    this.loaderService.isLoading.next(true);
    const move = this.getMoveRequest(true);
    this.movesService
      .updateMove(this.move!._id, move)
      .pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      )
      .subscribe(
        (res) => {
          this.exit();
          this.snackerService.showSuccessful('Ejercicio editada con éxito');
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }

  getMoveRequest(edit = false): MoveRequestModel {
    const request = {
      patient: this.patient?._id,
      date: this.date,
      title: this.title,
      description: this.description,
      comments: this.comments,
      links: this.links.map((link) => link.url),
      videos: this.videos.map((video) => video.url),
      attachment: this.attachment ? this.attachment._id : null,
    };
    return edit ? request : this.optionalPipe.transform(request);
  }

  private initPatient(): void {
    const patientId = this.activatedRoute.snapshot.params['patientId'];
    this.patientsService.getPatient(patientId).subscribe({
      next: (patient) => {
        this.patient = patient;
      },
    });
  }

  private initDate(): void {
    const date = this.activatedRoute.snapshot.params['date'];
    if (date) {
      this.date = getDateUTC(new Date(date));
    }
  }

  private initMove() {
    const moveId = this.activatedRoute.snapshot.params['moveId'];
    if (!moveId) {
      return;
    }
    this.edit = true;
    this.movesService.getMove(moveId).subscribe((res) => {
      this.move = res;
      this.date = this.move.date;
    });
  }
}
