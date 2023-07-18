import { StaffType } from '@models';

export interface IAuthIssueRes {
  token: string;
  loginUserName: string;
  loginId: string;
  brandName: string;
  brandId: string;
  companyName: string;
  staffType: StaffType;
  role: number;
}
