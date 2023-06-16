import { SystemModalContainer } from '@components/modal/SystemModalContainer';
import { useBotClient, useRootState } from '@hooks';
import { useSessionTokenClient } from '@hooks/client/sessionTokenClient';
import { initBotBuilder } from '@store/botbuilderSlice';
import { setBotInfo, setSesstionToken } from '@store/botInfoSlice';
import { setBotSettingInfo } from '@store/botSettingInfoSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { BotAside } from './BotAside';
import { Header } from './Header';

export const BotLayout = () => {
  console.log('BotLayout');
  const { botId } = useParams();
  const botName = useRootState((state) => state.botInfoReducer.botInfo?.botName);
  const dispatch = useDispatch();

  const { getSessionToken } = useSessionTokenClient();
  const { getBotInfoQuery, getBotSettingInfoQuery } = useBotClient();

  getSessionToken();
  getBotInfoQuery(botId!);
  getBotSettingInfoQuery(botId!);

  useEffect(() => {
    return () => {
      dispatch(setSesstionToken());
      dispatch(initBotBuilder());
      dispatch(setBotInfo());
      dispatch(setBotSettingInfo());
    };
  }, []);

  return (
    <>
      <>
        <BotAside />
        <div id="layout">
          <Header isBotPage name={botName || ''} />
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
