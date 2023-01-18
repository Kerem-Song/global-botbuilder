import { DefaultLayout } from '@components';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { supportedLngs } from '../modules/constants';
import DashboardPage from '../pages/DashboardPage';
import DataApiPage from '../pages/DataApiPage';
import DeploymentPage from '../pages/DeploymentPage';
import HelpPage from '../pages/HelpPage';
import HistoryPage from '../pages/HistoryPage';
import ScenarioPage from '../pages/scenario';
import SettingPage from '../pages/SettingPage';
import StatisticsPage from '../pages/StatisticsPage';
import UtterancePage from '../pages/UtterancePage';
import { LocaleNavigate } from './LocaleNavigate';

const finalRoutes = [
  ...supportedLngs.map((lang) => {
    return {
      path: lang,
      children: [
        {
          element: <DefaultLayout />,
          children: [
            {
              path: 'dashboard',
              element: <DashboardPage />,
              errorElement: <>404</>,
              handle: true,
            },
            {
              path: ':botId',
              errorElement: <>404</>,
              children: [
                {
                  path: 'scenario',
                  element: <ScenarioPage />,
                },
                { path: 'utterance', element: <UtterancePage /> },
                { path: 'data-api', element: <DataApiPage /> },
                { path: 'deployment', element: <DeploymentPage /> },
                { path: 'history', element: <HistoryPage /> },
                { path: 'statistics', element: <StatisticsPage /> },
                { path: 'setting', element: <SettingPage /> },
              ],
            },
            { path: 'help', element: <HelpPage />, errorElement: <>404</> },
            { path: '', element: <Navigate to="/dashboard" replace={true} /> },
          ],
        },
        { path: '*', element: <>404</>, handle: true },
      ],
    };
  }),
  {
    path: '*',
    element: <LocaleNavigate />,
  },
];

export const Routers = createBrowserRouter(finalRoutes);
