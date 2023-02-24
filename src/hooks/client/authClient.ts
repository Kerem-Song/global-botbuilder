import useHttp from '@hooks/useHttp';
import { IHasResult } from '@models';
import { IAuthIssueReq } from '@models/interfaces/req/IAuthIssueReq';
import { IAuthIssueRes } from '@models/interfaces/res/IAuthIssueRes';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';

export const useAuthClient = () => {
  const http = useHttp();
  const IssueTokenMutate = useMutation(async (args: IAuthIssueReq) => {
    const res = await http.post<IAuthIssueReq, AxiosResponse<IHasResult<IAuthIssueRes>>>(
      '/auth/Issue',
      args,
    );

    return res.data.result;
  });
  return { IssueTokenAsync: IssueTokenMutate.mutateAsync };
};
