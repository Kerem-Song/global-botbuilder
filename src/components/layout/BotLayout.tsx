import { useSessionTokenClient } from '@hooks/client/sessionTokenClient';
import { setSesstionToken } from '@store/botbuilderSlice';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { Header } from './Header';

export const BotLayout = () => {
  const { token, isFetching } = useSessionTokenClient();

  const dispatch = useDispatch();
  if (isFetching) {
    return <></>;
  }

  dispatch(setSesstionToken(token));
  return (
    <>
      <Header isBotPage />
      <main>
        <Outlet />
      </main>
    </>
  );
};
