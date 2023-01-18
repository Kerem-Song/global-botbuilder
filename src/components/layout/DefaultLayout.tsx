import { SystemModalContainer } from '@components/modal/SystemModalContainer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Aside } from './Aside';
import { Header } from './Header';

export const DefaultLayout = () => {
  console.log('DefaultLayout');

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};
