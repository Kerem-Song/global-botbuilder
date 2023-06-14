import { setSesstionToken } from '@store/botInfoSlice';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import useHttp from '../useHttp';

export const useSessionTokenClient = () => {
  const queryClient = useQueryClient();
  const http = useHttp();
  const { botId } = useParams();
  const dispatch = useDispatch();
  const getSessionToken = () => {
    return useQuery(
      ['session-token', botId],
      () =>
        http
          .post('/bot/GetSessionToken', {
            userId: 'abcd',
            botId,
          })
          .then((res) => {
            dispatch(setSesstionToken(res.data.result));
            return res.data.result;
          }),
      // http.post('/bottest/initsamplegroup').then((res) => res.data.result),
      { refetchOnWindowFocus: false, refetchOnMount: true },
    );
  };

  const refetchSessionToken = (botId: string) => {
    queryClient.invalidateQueries(['session-token', botId]);
  };

  return {
    getSessionToken,
    refetchSessionToken,
  };
};
