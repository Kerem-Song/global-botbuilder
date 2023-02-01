export interface IPagingItems<T> {
  items: T[];
  pagePerCount: number;
  currentPage: number;
  total: number;
  totalPage: number;
}
