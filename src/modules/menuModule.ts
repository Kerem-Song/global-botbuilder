import {
  icDeploy,
  icDeploySelected,
  icHelp,
  icHelpSelected,
  icHistory,
  icHistorySelected,
  icScenario,
  icScenarioSelected,
  icSetting,
  icSettingSelected,
  icUtterance,
  icUtteranceSelected,
} from '@assets';
import { Role } from '@models';

const getMenuItem = (
  id: number,
  url: string,
  name: string,
  icon: string,
  selectedIcon: string,
  role: Role,
) => {
  return {
    id,
    url: url,
    name,
    icon,
    selectedIcon,
    alt: name,
    desc: `${name.toUpperCase()}`,
    role,
  };
};

const menu = [
  getMenuItem(
    1,
    `scenario/start`,
    'scenario',
    icScenario,
    icScenarioSelected,
    Role.Scenario,
  ),
  getMenuItem(2, `intent`, 'intent', icUtterance, icUtteranceSelected, Role.Scenario),
  getMenuItem(4, `deployment`, 'deployment', icDeploy, icDeploySelected, Role.Deploy),
  getMenuItem(5, `history`, 'history', icHistory, icHistorySelected, Role.History),
  // getMenuItem(
  //   6,
  //   `statistics`,
  //   'statistics',
  //   icStatistics,
  //   icStatisticsSelected,
  //   Role.Statistics,
  // ),
  getMenuItem(7, `setting`, 'setting', icSetting, icSettingSelected, Role.Setting),
];

const subMenu = [
  getMenuItem(
    1,
    import.meta.env.VITE_HELP_URL,
    'help',
    icHelp,
    icHelpSelected,
    Role.None,
  ),
];

export const menuModule = { menu, subMenu };
