import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LinkStructure } from './interfaces/link-structure';

@Component({
  selector: 'app-links-input',
  templateUrl: './links-input.component.html',
  styleUrls: ['./links-input.component.css', '../../../../assets/styles/form-input.css'],
})
export class LinksInputComponent implements OnInit {
  @Input() links: Array<LinkStructure> = [];

  @Output() setLinks = new EventEmitter<Array<LinkStructure>>();

  constructor() {}

  ngOnInit(): void {}

  addLink(url: string): void {
    const id =
      this.links.length > 0
        ? Math.max(
            ...this.links.map((link) => {
              return link.id;
            })
          ) + 1
        : 0;
    const link = { id, url };
    this.links.push(link);
    this.setLinks.emit(this.links);
  }

  removeLink(id: number): void {
    this.links = this.links.filter((link) => {
      return link.id != id;
    });
    this.setLinks.emit(this.links);
  }
}
