import { SystemModalContainer } from '@components/modal/SystemModalContainer';
import { useBotClient } from '@hooks';
import { useSessionTokenClient } from '@hooks/client/sessionTokenClient';
import { initBotBuilder } from '@store/botbuilderSlice';
import { setSesstionToken } from '@store/botInfoSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { BotAside } from './BotAside';
import { Header } from './Header';

export const BotLayout = () => {
  console.log('BotLayout');
  const { botId } = useParams();
  const dispatch = useDispatch();

  const { getSessionToken } = useSessionTokenClient();
  const { getBotInfoQuery } = useBotClient();

  getSessionToken();
  getBotInfoQuery(botId!);

  useEffect(() => {
    return () => {
      dispatch(setSesstionToken());
      dispatch(initBotBuilder());
    };
  }, []);

  return (
    <>
      <>
        <BotAside />
        <div id="layout">
          <Header isBotPage />
          <main>
            <Outlet />
          </main>
        </div>
        <ToastContainer />
        <SystemModalContainer />
      </>
    </>
  );
};
