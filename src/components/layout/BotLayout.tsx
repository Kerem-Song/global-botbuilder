import { SystemModalContainer } from '@components/modal/SystemModalContainer';
import { useRootState } from '@hooks';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { BotAside } from './BotAside';
import { Header } from './Header';

export const BotLayout = () => {
  console.log('BotLayout');
  const token = useRootState((state) => state.botBuilderReducer.token);
  return (
    <>
      <>
        <BotAside />
        <div id="layout">
          <Header isBotPage />
          <main>{token ? <Outlet /> : <></>}</main>
        </div>
        <ToastContainer />
        <SystemModalContainer />
      </>
    </>
  );
};
