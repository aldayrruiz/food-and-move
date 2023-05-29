import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VideoStructure } from './interfaces/video-structure';

@Component({
  selector: 'app-videos-input',
  templateUrl: './videos-input.component.html',
  styleUrls: ['./videos-input.component.css', '../../../../assets/styles/form-input.css'],
})
export class VideosInputComponent implements OnInit {
  @Input() videos: Array<VideoStructure> = [];

  @Output() setVideos = new EventEmitter<Array<VideoStructure>>();

  constructor() {}

  ngOnInit(): void {}

  addVideo(url: string): void {
    const id =
      this.videos.length > 0
        ? Math.max(
            ...this.videos.map((video) => {
              return video.id;
            })
          ) + 1
        : 0;
    const video = { id, url };
    this.videos.push(video);
    this.setVideos.emit(this.videos);
  }

  removeVideo(id: number): void {
    this.videos = this.videos.filter((link) => {
      return link.id != id;
    });
    this.setVideos.emit(this.videos);
  }
}
