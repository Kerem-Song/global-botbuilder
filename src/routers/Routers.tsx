import { createBrowserRouter, Navigate } from 'react-router-dom';

import { DefaultLayout } from '../components/layout/DefaultLayout';
import { supportedLngs } from '../modules/constants';
import DashboardPage from '../pages/dashboard';
import ImageEditorPage from '../pages/imgedit';
import ScenarioPage from '../pages/scenario';
import TestPage from '../pages/test';
import { LocaleNavigate } from './LocaleNavigate';

const finalRoutes = [
  {
    element: <DefaultLayout />,
    children: supportedLngs.map((lang) => {
      return {
        path: lang,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'scenario', element: <ScenarioPage /> },
          { path: 'test', element: <TestPage /> },
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
