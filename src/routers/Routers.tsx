import { DefaultLayout } from '@components';
import { BotLayout } from '@components/layout/BotLayout';
import { HistoryViewerLayout } from '@components/layout/HistoryViewerLayout';
import { Layout } from '@components/layout/Layout';
import { Role } from '@models';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import { supportedLngs } from '../modules/constants';
import { AuthPage } from '../pages/AuthPage';
import DashboardPage from '../pages/DashboardPage';
import DataApiPage from '../pages/DataApiPage';
import DeploymentPage from '../pages/DeploymentPage';
import HelpPage from '../pages/HelpPage';
import HistoryPage from '../pages/HistoryPage';
import { HistoryViewer } from '../pages/HistoryViewerPage';
import IntentDetailPage from '../pages/IntentDetailPage';
import IntentPage from '../pages/IntentPage';
import ScenarioPage from '../pages/ScenarioPage';
import SettingPage from '../pages/SettingPage';
import StatisticsPage from '../pages/StatisticsPage';
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
              handle: { title: 'DASHBOARD', role: Role.None },
              children: [
                {
                  index: true,
                  element: <DashboardPage />,
                  handle: { title: 'DASHBOARD', role: Role.None },
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
                  handle: { title: 'SCENARIO', role: Role.Scenario },
                  children: [
                    {
                      path: ':scenarioId',
                      element: <ScenarioPage />,
                      handle: { title: 'SCENARIO', role: Role.Scenario },
                    },
                    {
                      index: true,
                      element: <ScenarioNavigate />,
                      handle: { title: 'SCENARIO', role: Role.Scenario },
                      errorElement: <>404</>,
                    },
                  ],
                },
                {
                  path: 'intent',
                  handle: { title: 'INTENT', role: Role.Scenario },
                  children: [
                    {
                      path: '',
                      element: <IntentPage />,
                      handle: { title: 'INTENT', role: Role.Scenario },
                    },
                    {
                      path: 'detail',
                      children: [
                        {
                          path: '',
                          element: <IntentDetailPage />,
                          handle: { title: 'INTENT', role: Role.Scenario },
                        },
                        {
                          path: ':intentId',
                          element: <IntentDetailPage />,
                          handle: { title: 'INTENT', role: Role.Scenario },
                        },
                      ],
                    },
                  ],
                },
                {
                  path: 'data-api',
                  element: <DataApiPage />,
                  handle: { title: 'SKILL', role: Role.Skill },
                },
                {
                  path: 'deployment',
                  element: <DeploymentPage />,
                  handle: { title: 'DEPLOYMENT', role: Role.Deploy },
                },
                {
                  path: 'history',
                  element: <HistoryPage />,
                  handle: { title: 'HISTORY', role: Role.History },
                },
                {
                  path: 'statistics',
                  element: <StatisticsPage />,
                  handle: { title: 'STATISTICS', role: Role.Statistics },
                },
                {
                  path: 'chatrecord',
                  element: <StatisticsPage />,
                  handle: { title: 'CHATRECORD', role: Role.ChatRecord },
                },
                {
                  path: 'setting',
                  element: <SettingPage />,
                  handle: { title: 'SETTING', role: Role.Setting },
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
                  handle: { title: `HISTORY VIEWER`, role: Role.History },
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
