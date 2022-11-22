import {
  icChatbot,
  icDataApi,
  icDataApiSelcted,
  icDeploy,
  icDeploySelected,
  icHelp,
  icHelpSelected,
  icHide,
  icHistory,
  icHistorySelected,
  icLnbHide,
  icLnbShow,
  icScenario,
  icScenarioSelected,
  icSetting,
  icSettingSelected,
  icShow,
  icStatistics,
  icStatisticsSelected,
  icUtterance,
  icUtteranceSelected,
} from '@assets/index';
import classNames from 'classnames';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useLocation, useMatches } from 'react-router-dom';

import useI18n from '../../hooks/useI18n';
import { useRootState } from '../../hooks/useRootState';
import { setSidebarStatus } from '../../store/sidebarStatusSlice';
import { Divider } from './Divider';

export const Aside = () => {
  const { i18n, t, ts } = useI18n();
  const matches = useMatches();
  const location = useLocation();
  const isDashboard = matches.find((x) => x.pathname === location.pathname)?.handle;

  const sidebarStatus = useRootState((state) => state.sideBarStatusReducer.isOpen);
  const dispatch = useDispatch();
  const handleSidebar = useCallback(() => dispatch(setSidebarStatus()), [dispatch]);
  const css = classNames({ 'aside-open': sidebarStatus });

  const getMenuItem = (id: number, url: string, icon: string, selectedIcon: string) => {
    return {
      id,
      url: `/${i18n.language}/${url}`,
      icon,
      selectedIcon,
      alt: url.replace(/^./, url[0].toUpperCase()),
      desc: ts(`${url.toUpperCase()}`),
    };
  };

  const menu = [
    getMenuItem(1, 'scenario', icScenario, icScenarioSelected),
    getMenuItem(2, 'utterance', icUtterance, icUtteranceSelected),
    getMenuItem(3, 'skill', icDataApi, icDataApiSelcted),
    getMenuItem(4, 'deployment', icDeploy, icDeploySelected),
    getMenuItem(5, 'history', icHistory, icHistorySelected),
    getMenuItem(6, 'statistics', icStatistics, icStatisticsSelected),
  ];

  const subMenu = [
    getMenuItem(1, 'help', icHelp, icHelpSelected),
    getMenuItem(2, 'setting', icSetting, icSettingSelected),
  ];

  const brandName = useRootState((state) => state.brandInfoReducer.brandName);

  return (
    <aside className={css}>
      <div className="mainMenuWrapper">
        <button
          className="lnbBtn"
          onClick={handleSidebar}
          data-sidebarStatus={sidebarStatus}
        >
          {/* {sidebarStatus ? (
            <img src={icLnbShow} alt="icLnbShow" />
          ) : (
            <img src={icLnbHide} alt="icLnbHide" />
          )} */}
        </button>
        {isDashboard ? (
          <div>
            <a>
              &lt;
              {sidebarStatus ? <p>파트너스 센터</p> : <p>파</p>}
            </a>
          </div>
        ) : (
          <div style={{ padding: '10px' }}>
            <NavLink to="dashboard">
              &lt;{sidebarStatus && <span> {brandName} 챗봇 목록</span>}
            </NavLink>
          </div>
        )}

        <div>{/* <p className={classNames('chatbotName', css)}>{chatbotName}</p> */}</div>
        <Divider />
        {isDashboard ? (
          <></>
        ) : (
          <nav className="nav">
            <ul>
              {menu.map((item) => {
                return (
                  <NavLink key={item.id} to={`${item.url}`}>
                    <li className="">
                      <span className="menuImg">
                        {sidebarStatus ? (
                          <img src={item.selectedIcon} alt={item.alt} />
                        ) : (
                          <img src={item.icon} alt={item.alt} />
                        )}
                      </span>
                      {sidebarStatus && <span className="desc">{item.desc}</span>}
                    </li>
                  </NavLink>
                );
              })}
            </ul>
          </nav>
        )}
      </div>
      {/* <div style={{ flex: 'auto' }}></div> */}
      <div className="subMenuWrapper">
        <nav className="subMenu">
          <ul>
            {subMenu.map((item) => {
              return (
                <NavLink key={item.id} to={`${item.url}`}>
                  <li className="">
                    <span className="subMenuImg">
                      {sidebarStatus ? (
                        <img src={item.selectedIcon} alt={item.alt} />
                      ) : (
                        <img src={item.icon} alt={item.alt} />
                      )}
                    </span>
                    {sidebarStatus && <span className="desc">{item.desc}</span>}
                  </li>
                </NavLink>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
};
