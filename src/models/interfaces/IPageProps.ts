import { IHasChildren } from './IHasChildren';

export interface IPageProps extends IHasChildren {
  pageName: string;
  isReadOnly?: boolean;
}
