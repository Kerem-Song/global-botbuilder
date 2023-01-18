import { SystemModalContainer } from '@components/modal/SystemModalContainer';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { Aside } from './Aside';

export const Layout = () => {
  console.log('DefaultLayout');

  return (
    <>
      <Aside />
      <div id="layout">
        <Outlet />
      </div>
      <ToastContainer />
      <SystemModalContainer />
    </>
  );
};
