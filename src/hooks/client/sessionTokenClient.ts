import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import useHttp from '../useHttp';

export const useSessionTokenClient = () => {
  const http = useHttp();
  const { botId } = useParams();
  const getSessionToken = useQuery(
    ['session-token', botId],
    () =>
      http
        .post('/bot/GetSessionToken', {
          userId: 'abcd',
          botId,
        })
        .then((res) => res.data.result),
    { refetchOnWindowFocus: false, refetchOnMount: true },
  );

  return {
    token: getSessionToken.data,
    isFetching: getSessionToken.isFetching,
  };
};
