import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AttachmentModel } from '@core/models/attachment/attachment.model';
import { RecipeModel } from '@core/models/recipe/recipe.model';
import { AttachmentsService } from '@core/services/attachments.service';
import { LoaderService } from '@core/services/loader.service';
import { finalize } from 'rxjs';
import { URL_ATTACHMENTS } from 'src/app/constants/app.constants';

@Component({
  selector: 'app-info-recipe',
  templateUrl: './info-recipe.component.html',
  styleUrls: ['./info-recipe.component.css', '../../../../../assets/styles/info-dialog.css'],
})
export class InfoRecipeComponent implements OnInit {
  attachment: AttachmentModel | null = null;

  constructor(
    private readonly dialogRef: MatDialogRef<InfoRecipeComponent>,
    @Inject(MAT_DIALOG_DATA) public readonly recipe: RecipeModel,
    private readonly attachmentsService: AttachmentsService,
    private readonly loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    if (this.recipe.attachment) {
      this.loaderService.isLoading.next(true);
      this.attachmentsService
        .getAttachment(this.recipe.attachment)
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
