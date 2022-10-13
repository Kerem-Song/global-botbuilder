import { Outlet } from 'react-router-dom';

import { Aside } from './Aside';
import { Footer } from './Footer';
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
        <Footer />
      </div>
    </>
  );
};
