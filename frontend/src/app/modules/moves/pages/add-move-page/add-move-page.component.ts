import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AttachmentModel } from '@core/models/attachment.model';
import { MoveRequestModel } from '@core/models/move-request.model';
import { MoveModel } from '@core/models/move.model';
import { PatientModel } from '@core/models/patient.model';
import { RoutineModel } from '@core/models/routine.model';
import { AttachmentsService } from '@core/services/attachments.service';
import { LoaderService } from '@core/services/loader.service';
import { MovesService } from '@core/services/moves.service';
import { RouterService } from '@core/services/router.service';
import { SnackerService } from '@core/services/snacker.service';
import { ViewPatientService } from '@core/services/view-patient.service';
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
  styleUrls: ['./add-move-page.component.css', '../../../../../assets/styles/form.css'],
})
export class AddMovePageComponent implements OnInit {
  patient: PatientModel | null = null;

  date = new Date();

  form!: FormGroup;
  edit: boolean = false;
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
    private readonly fb: FormBuilder,
    private readonly movesService: MovesService,
    private readonly attachmentsService: AttachmentsService,
    private readonly optionalPipe: OptionalPipe,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService,
    private readonly routerService: RouterService,
    private readonly viewPatientService: ViewPatientService,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.viewPatientService.patient$.subscribe(
      (res) => {
        this.patient = res;
        const params = this.activatedRoute.snapshot.params;
        if (params['date']) this.date = getDateUTC(new Date(params['date']));
        if (params['id']) {
          this.edit = true;
          this.loaderService.isLoading.next(true);
          this.movesService
            .getMove(params['id'])
            .pipe(
              finalize(() => {
                this.loaderService.isLoading.next(false);
              })
            )
            .subscribe(
              (res) => {
                this.move = res;
                this.date = this.move.date;
                this.initForm();
              },
              (err) => {
                this.exit();
                this.snackerService.showError('Algo no ha sucedido como se esperaba');
              }
            );
        } else {
          this.initForm();
        }
      },
      (err) => {
        console.log(err);
        this.routerService.goToHome();
        this.snackerService.showError('No se ha encontrado al paciente');
      }
    );
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
    this.routerService.goToMoves(this.date);
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

  getMoveRequest(edit: boolean = false): MoveRequestModel {
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
}
