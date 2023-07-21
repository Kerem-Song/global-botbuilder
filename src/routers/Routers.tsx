import { DefaultLayout } from '@components';
import { BotLayout } from '@components/layout/BotLayout';
import { HistoryViewerLayout } from '@components/layout/HistoryViewerLayout';
import { Layout } from '@components/layout/Layout';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { supportedLngs } from '../modules/constants';
import { AuthPage } from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';
import DataApiPage from '../pages/DataApiPage';
import DeploymentPage from '../pages/DeploymentPage';
import HelpPage from '../pages/HelpPage';
import HistoryPage from '../pages/HistoryPage';
import { HistoryViewer } from '../pages/HistoryViewerPage';
import ScenarioPage from '../pages/ScenarioPage';
import SettingPage from '../pages/SettingPage';
import StatisticsPage from '../pages/StatisticsPage';
import UtteranceDetailPage from '../pages/UtteranceDetailPage';
import UtterancePage from '../pages/UtterancePage';
import { LocaleNavigate } from './LocaleNavigate';
import { ScenarioNavigate } from './ScenarioNavigate';

const finalRoutes = [
  ...supportedLngs.map((lang) => {
    return {
      path: lang,
      element: <Layout />,
      children: [
        {
          path: ':brandId',
          children: [
            {
              path: 'dashboard',
              element: <DefaultLayout />,
              handle: { title: 'DASHBOARD', role: 0 },
              children: [
                {
                  index: true,
                  element: <DashboardPage />,
                  handle: { title: 'DASHBOARD', role: 0 },
                  errorElement: <>404</>,
                },
              ],
            },
            {
              path: ':botId',
              element: <BotLayout />,
              errorElement: <>404</>,
              children: [
                {
                  path: 'scenario',
                  handle: { title: 'SCENARIO', role: 2 },
                  children: [
                    {
                      path: ':scenarioId',
                      element: <ScenarioPage />,
                      handle: { title: 'SCENARIO', role: 2 },
                    },
                    {
                      index: true,
                      element: <ScenarioNavigate />,
                      handle: { title: 'SCENARIO', role: 2 },
                      errorElement: <>404</>,
                    },
                  ],
                },
                {
                  path: 'utterance',
                  handle: { title: 'UTTERANCE', role: 2 },
                  children: [
                    {
                      path: '',
                      element: <UtterancePage />,
                      handle: { title: 'UTTERANCE', role: 2 },
                    },
                    {
                      path: 'detail',
                      children: [
                        {
                          path: '',
                          element: <UtteranceDetailPage />,
                          handle: { title: 'UTTERANCE', role: 2 },
                        },
                        {
                          path: ':intentId',
                          element: <UtteranceDetailPage />,
                          handle: { title: 'UTTERANCE', role: 2 },
                        },
                      ],
                    },
                  ],
                },
                {
                  path: 'data-api',
                  element: <DataApiPage />,
                  handle: { title: 'SKILL', role: 8 },
                },
                {
                  path: 'deployment',
                  element: <DeploymentPage />,
                  handle: { title: 'DEPLOYMENT', role: 16 },
                },
                {
                  path: 'history',
                  element: <HistoryPage />,
                  handle: { title: 'HISTORY', role: 32 },
                },
                {
                  path: 'statistics',
                  element: <StatisticsPage />,
                  handle: { title: 'STATISTICS', role: 64 },
                },
                {
                  path: 'chatrecord',
                  element: <StatisticsPage />,
                  handle: { title: 'CHATRECORD', role: 128 },
                },
                {
                  path: 'setting',
                  element: <SettingPage />,
                  handle: { title: 'SETTING', role: 256 },
                },
              ],
            },
            {
              path: ':botId',
              element: <HistoryViewerLayout />,
              errorElement: <>404?</>,
              children: [
                {
                  path: 'viewer/:historyId/:createByBrand/:actorEmail/:actorName',
                  element: <HistoryViewer />,
                  handle: { title: `` },
                },
              ],
            },
            { path: '', element: <Navigate to="dashboard" replace={true} /> },
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
