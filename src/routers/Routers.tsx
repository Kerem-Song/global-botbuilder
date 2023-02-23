import { DefaultLayout } from '@components';
import { BotLayout } from '@components/layout/BotLayout';
import { Layout } from '@components/layout/Layout';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { supportedLngs } from '../modules/constants';
import { AuthPage } from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';
import DataApiPage from '../pages/DataApiPage';
import DeploymentPage from '../pages/DeploymentPage';
import HelpPage from '../pages/HelpPage';
import HistoryPage from '../pages/HistoryPage';
import ScenarioPage from '../pages/ScenarioPage';
import SettingPage from '../pages/SettingPage';
import StatisticsPage from '../pages/StatisticsPage';
import UtteranceDetailPage from '../pages/UtteranceDetailPage';
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
              handle: true,
              children: [
                {
                  index: true,
                  element: <DashboardPage />,
                  errorElement: <>404</>,
                },
              ],
            },
            {
              path: ':botId',
              element: <BotLayout />,
              errorElement: <>404</>,
              children: [
                { path: 'scenario', element: <ScenarioPage /> },
                {
                  path: 'utterance',
                  children: [
                    {
                      path: '',
                      element: <UtterancePage />,
                    },
                    {
                      path: 'detail',
                      children: [
                        {
                          path: '',
                          element: <UtteranceDetailPage />,
                        },
                        {
                          path: ':utteranceId',
                          element: <UtteranceDetailPage />,
                        },
                      ],
                    },
                  ],
                },
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
  { path: 'auth', element: <AuthPage />, errorElement: <>404</> },
  {
    path: '*',
    element: <LocaleNavigate />,
  },
];

export const Routers = createBrowserRouter(finalRoutes);
