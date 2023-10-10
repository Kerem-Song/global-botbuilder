import useHttp from '@hooks/useHttp';
import { IHasResult } from '@models';
import { IAuthIssueReq } from '@models/interfaces/req/IAuthIssueReq';
import { IAuthIssueRes } from '@models/interfaces/res/IAuthIssueRes';
import { aesHelper } from '@modules/aesHelper';
import { setToken } from '@store/authSlice';
import { setBrandInfo } from '@store/brandInfoSlice';
import { setUserInfo } from '@store/userInfoSlice';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';

export const useAuthClient = () => {
  const http = useHttp();
  const dispath = useDispatch();
  const IssueTokenMutate = useMutation(async (args: IAuthIssueReq) => {
    const res = await http.post<IAuthIssueReq, AxiosResponse<IHasResult<string>>>(
      '/auth/Issue',
      args,
    );

    if (res) {
      const parsed: IAuthIssueRes = {
        ...aesHelper.decode(res.data.result),
        token: res.data.result,
      };

      dispath(setToken({ refreshToken: parsed.token }));
      dispath(setBrandInfo({ brandId: parsed.brandId, brandName: parsed.brandName }));
      dispath(
        setUserInfo({
          loginId: parsed.accountEmail,
          loginUserName: parsed.accountName,
          companyName: parsed.companyName,
          role: parsed.permission,
          staffType: parsed.staffType,
        }),
      );

      return parsed;
    }
  });
  return { IssueTokenAsync: IssueTokenMutate.mutateAsync };
};
