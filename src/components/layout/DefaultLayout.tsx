import { Outlet, useLocation, useMatches } from 'react-router-dom';

import { Aside } from './Aside';
import { Footer } from './Footer';
import { Header } from './Header';

export const DefaultLayout = () => {
  console.log('DefaultLayout');
  const location = useLocation();
  const matches = useMatches();

  if (matches.find((x) => x.pathname === location.pathname)?.handle) {
    return <Outlet />;
  }

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
