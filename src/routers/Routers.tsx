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
              handle: true,
            },
            { path: ':botId/scenario', element: <ScenarioPage /> },
            { path: ':botId/utterance', element: <UtterancePage /> },
            { path: ':botId/data-api', element: <DataApiPage /> },
            { path: ':botId/deployment', element: <DeploymentPage /> },
            { path: ':botId/history', element: <HistoryPage /> },
            { path: ':botId/statistics', element: <StatisticsPage /> },
            { path: 'help', element: <HelpPage /> },
            { path: ':botId/setting', element: <SettingPage /> },
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
