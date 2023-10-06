import { StaffType } from '@models';

export interface IAuthIssueRes {
  token: string;
  accountName: string;
  accountEmail: string;
  brandName: string;
  brandId: string;
  companyName: string;
  staffType: StaffType;
  permission: number;
}
