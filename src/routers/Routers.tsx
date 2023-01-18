import { DefaultLayout } from '@components';
import { BotLayout } from '@components/layout/BotLayout';
import { Layout } from '@components/layout/Layout';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { supportedLngs } from '../modules/constants';
import DashboardPage from '../pages/DashboardPage';
import DataApiPage from '../pages/DataApiPage';
import DeploymentPage from '../pages/DeploymentPage';
import HelpPage from '../pages/HelpPage';
import HistoryPage from '../pages/HistoryPage';
import ScenarioPage from '../pages/ScenarioPage';
import SettingPage from '../pages/SettingPage';
import StatisticsPage from '../pages/StatisticsPage';
import UtterancePage from '../pages/UtterancePage';
import { LocaleNavigate } from './LocaleNavigate';

const finalRoutes = [
  ...supportedLngs.map((lang) => {
    return {
      path: lang,
      element: <Layout />,
      children: [
        {
          children: [
            {
              path: 'dashboard',
              element: <DefaultLayout />,
              children: [
                {
                  index: true,
                  element: <DashboardPage />,
                  errorElement: <>404</>,
                  handle: true,
                },
              ],
            },
            {
              path: ':botId',
              element: <BotLayout />,
              errorElement: <>404</>,
              children: [
                { path: 'scenario', element: <ScenarioPage /> },
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
