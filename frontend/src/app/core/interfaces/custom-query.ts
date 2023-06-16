import { Paging } from './paging';
import { Search } from './search';
import { Sorting } from './sorting';

export interface CustomQuery {
  search?: Search;
  paging?: Paging;
  sorting?: Sorting[];
  filter?: any;
  populate?: string[];
}
