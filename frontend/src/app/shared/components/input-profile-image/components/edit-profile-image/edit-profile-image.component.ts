import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { InputProfileEvent } from '../../enums/input-profile-event';

@Component({
  selector: 'app-edit-profile-image',
  templateUrl: './edit-profile-image.component.html',
  styleUrls: ['./edit-profile-image.component.css'],
})
export class EditProfileImageComponent implements OnInit {
  constructor(private readonly _bottomSheetRef: MatBottomSheetRef<EditProfileImageComponent>) {}

  ngOnInit(): void {}

  onAddPhoto(): void {
    this._bottomSheetRef.dismiss({ event: InputProfileEvent.Add });
  }

  onRemovePhoto(): void {
    this._bottomSheetRef.dismiss({ event: InputProfileEvent.Remove });
  }

  onRecoverPhoto(): void {
    this._bottomSheetRef.dismiss({ event: InputProfileEvent.Recover });
  }
}
