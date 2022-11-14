import { Outlet } from 'react-router-dom';

import { Aside } from './Aside';
import { Header } from './Header';

export const DefaultLayout = () => {
  console.log('DefaultLayout');

  return (
    <>
      <Aside />
      <div id="layout">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};
