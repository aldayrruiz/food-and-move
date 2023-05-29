import { ColumnType } from '@shared/components/table/enums/column-type';

export interface TableStructure {
  index: number;
  field: string;
  header: string;
  sort: boolean;
  type?: ColumnType;
}
