import { SystemModalContainer } from '@components/modal/SystemModalContainer';
import { useBotClient, useRootState } from '@hooks';
import { useSessionTokenClient } from '@hooks/client/sessionTokenClient';
import { Outlet, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { BotAside } from './BotAside';
import { Header } from './Header';

export const BotLayout = () => {
  console.log('BotLayout');
  const { botId } = useParams();

  const { getSessionToken } = useSessionTokenClient();
  const { getBotInfoQuery } = useBotClient();

  getSessionToken();
  getBotInfoQuery(botId!);

  const token = useRootState((state) => state.botInfoReducer.token);

  if (!token) {
    return <></>;
  }

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
