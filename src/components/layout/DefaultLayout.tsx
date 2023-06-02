import { SystemModalContainer } from '@components/modal/SystemModalContainer';
import { useRootState } from '@hooks';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Aside } from './Aside';
import { Header } from './Header';

export const DefaultLayout = () => {
  console.log('DefaultLayout');
  const brandName = useRootState((state) => state.brandInfoReducer.brandName);
  return (
    <>
      <Aside />
      <div id="layout">
        <Header name={brandName} />
        <main>
          <Outlet />
        </main>
      </div>
      <ToastContainer />
      <SystemModalContainer />
    </>
  );
};
