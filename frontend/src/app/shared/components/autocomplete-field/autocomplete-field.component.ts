import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

export interface ObjectField {
  id: string;
  value: string;
}

@Component({
  selector: 'app-autocomplete-field',
  templateUrl: './autocomplete-field.component.html',
  styleUrls: ['./autocomplete-field.component.css'],
})
export class AutocompleteFieldComponent implements OnInit {
  @Input() objectFields!: ObjectField[];
  @Input() placeholder!: string;
  @Input() label!: string;

  filteredOptions!: Observable<ObjectField[]>;
  control: FormControl<any> = new FormControl('');

  ngOnInit() {
    this.initFilteredOptions();
  }

  getValue(): ObjectField {
    return this.control.value;
  }

  update() {
    this.initFilteredOptions();
  }

  displayFn(obj: ObjectField): string {
    return obj && obj.value ? obj.value : '';
  }

  private filter(value: string): ObjectField[] {
    const filterValue = value.toLowerCase();
    return this.objectFields.filter((option) => option.value.toLowerCase().includes(filterValue));
  }

  private initFilteredOptions() {
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map((value: any) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this.filter(name as string) : this.objectFields.slice();
      })
    );
  }
}
