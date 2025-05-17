import { PaginateResults } from '../../shared/interfaces/paginated-results';
import { PublicEntityItem } from './public-tenders-item.model';
export interface PublicTenderListResults extends PaginateResults {
  rows: PublicEntityItem[];
}
