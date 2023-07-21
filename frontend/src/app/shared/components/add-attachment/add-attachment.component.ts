import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { AttachmentsService } from '@core/services/api/attachments.service';
import { LoaderService } from '@core/services/gui/loader.service';
import { SnackerService } from '@core/services/gui/snacker.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-attachment',
  templateUrl: './add-attachment.component.html',
  styleUrls: ['./add-attachment.component.css'],
})
export class AddAttachmentComponent implements OnInit {
  form!: FormGroup;
  selectedFile?: File;

  constructor(
    private readonly dialogRef: MatDialogRef<AddAttachmentComponent>,
    private readonly fb: FormBuilder,
    private readonly attachmentsService: AttachmentsService,
    private readonly loaderService: LoaderService,
    private readonly snackerService: SnackerService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      title: [null, [Validators.required]],
    });
  }

  get title(): string | null {
    return this.form.value.title;
  }

  exit(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any): void {
    this.selectedFile = <File>event.target.files[0];
  }

  addPDF(): void {
    if (!this.selectedFile) {
      this.snackerService.showError('Ningún archivo seleccionado');
      return;
    }
    if (!this.title) {
      this.snackerService.showError('Título obligatorio');
      return;
    }
    if (this.selectedFile.type !== 'application/pdf') {
      this.snackerService.showError('Archivo no permitido');
      return;
    }
    const fd = new FormData();
    fd.append('file', this.selectedFile!, this.selectedFile?.name);
    this.loaderService.isLoading.next(true);
    this.attachmentsService
      .create(this.title || '', fd)
      .pipe(finalize(() => this.loaderService.isLoading.next(false)))
      .subscribe(
        (res) => {
          this.exit();
          this.snackerService.showSuccessful('PDF agregado correctamente');
          this.dialogRef.close(res);
        },
        (err) => {
          console.log(err);
          this.snackerService.showError(err.error.message);
        }
      );
  }
}
