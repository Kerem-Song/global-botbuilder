import { setSesstionToken } from '@store/botbuilderSlice';
import { useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import useHttp from '../useHttp';

export const useSessionTokenClient = () => {
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

  return {
    getSessionToken,
  };
};
