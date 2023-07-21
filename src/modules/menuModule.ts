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
  icStatistics,
  icStatisticsSelected,
  icUtterance,
  icUtteranceSelected,
} from '@assets';

const getMenuItem = (
  id: number,
  url: string,
  name: string,
  icon: string,
  selectedIcon: string,
  role: number,
) => {
  return {
    id,
    url: url,
    name,
    icon,
    selectedIcon,
    alt: url.replace(/^./, url[0].toUpperCase()),
    desc: `${name.toUpperCase()}`,
    role,
  };
};

const menu = [
  getMenuItem(1, `scenario/start`, 'scenario', icScenario, icScenarioSelected, 2),
  getMenuItem(2, `utterance`, 'utterance', icUtterance, icUtteranceSelected, 2),
  getMenuItem(4, `deployment`, 'deployment', icDeploy, icDeploySelected, 16),
  getMenuItem(5, `history`, 'history', icHistory, icHistorySelected, 32),
  getMenuItem(6, `statistics`, 'statistics', icStatistics, icStatisticsSelected, 64),
  getMenuItem(7, `setting`, 'setting', icSetting, icSettingSelected, 256),
];

const subMenu = [getMenuItem(1, 'help', 'help', icHelp, icHelpSelected, 0)];

export const menuModule = { menu, subMenu };
