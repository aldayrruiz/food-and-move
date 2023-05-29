import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { URL_PROFILE_IMAGE } from 'src/app/constants/app.constants';
import { EditProfileImageComponent } from './components/edit-profile-image/edit-profile-image.component';
import { InputProfileEvent } from './enums/input-profile-event';

@Component({
  selector: 'app-input-profile-image',
  templateUrl: './input-profile-image.component.html',
  styleUrls: ['./input-profile-image.component.css'],
})
export class InputProfileImageComponent implements OnInit {
  @Input() size = '100px';
  @Input() url: string = URL_PROFILE_IMAGE;

  @Output() onSelect = new EventEmitter<any>();
  @Output() onRecover = new EventEmitter<boolean>();
  @Output() onRemove = new EventEmitter<boolean>();

  imageSrc?: string;

  constructor(private readonly _bottomSheet: MatBottomSheet) {}

  ngOnInit(): void {}

  onClick(): void {
    const bottomSheetRef = this._bottomSheet.open(EditProfileImageComponent);
    bottomSheetRef.afterDismissed().subscribe((result) => {
      if (result.event == InputProfileEvent.Add) {
        const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
        fileUpload.click();
      } else if (result.event == InputProfileEvent.Remove) {
        this.onRemove.emit(true);
      } else if (result.event == InputProfileEvent.Recover) {
        this.onRecover.emit(true);
      }
    });
  }

  onSelectFile(event: any): void {
    this.onSelect.emit(event);
    event.target.value = null;
  }
}
