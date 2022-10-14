import { createBrowserRouter, Navigate } from 'react-router-dom';

import routes from '~react-pages';

import { DefaultLayout } from '../components/layout/DefaultLayout';
import { supportedLngs } from '../modules/constants';
import { LocaleNavigate } from './LocaleNavigate';

const finalRoutes = [
  {
    element: <DefaultLayout />,
    children: supportedLngs.map((lang) => {
      return {
        path: lang,
        children: [
          ...routes,
          { path: '', element: <Navigate to="/dashboard" replace={true} /> },
          { path: '*', element: <>404</>, handle: true },
        ],
      };
    }),
  },
  {
    path: '*',
    element: <LocaleNavigate />,
  },
];

export const Routers = createBrowserRouter(finalRoutes);
