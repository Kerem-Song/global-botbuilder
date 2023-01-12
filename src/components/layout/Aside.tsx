import {
  icChatbot,
  icDataApi,
  icDataApiSelcted,
  icDeploy,
  icDeploySelected,
  icHelp,
  icHelpSelected,
  icHistory,
  icHistorySelected,
  icLnbHide,
  icLnbShow,
  icScenario,
  icScenarioSelected,
  icSetting,
  icSettingSelected,
  icStatistics,
  icStatisticsSelected,
  icUtterance,
  icUtteranceSelected,
} from '@assets/index';
import classNames from 'classnames';
import { useState } from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Link, NavLink, useLocation, useMatches, useParams } from 'react-router-dom';

import useI18n from '../../hooks/useI18n';
import { useRootState } from '../../hooks/useRootState';
import { setSidebarStatus } from '../../store/sidebarStatusSlice';

export const Aside = () => {
  const location = useLocation();
  const { botId } = useParams();
  const [page, setPage] = useState<string>(location.pathname);

  const { i18n, t, ts } = useI18n();
  const matches = useMatches();
  const isDashboard = matches.find((x) => x.pathname === location.pathname)?.handle;

  const sidebarStatus = useRootState((state) => state.sideBarStatusReducer.isOpen);
  const dispatch = useDispatch();
  const handleSidebar = useCallback(() => dispatch(setSidebarStatus()), [dispatch]);
  const css = classNames({ 'aside-open': sidebarStatus });

  const getMenuItem = (
    id: number,
    url: string,
    name: string,
    icon: string,
    selectedIcon: string,
  ) => {
    return {
      id,
      url: `/${i18n.language}/${url}`,
      icon,
      selectedIcon,
      alt: url.replace(/^./, url[0].toUpperCase()),
      desc: ts(`${name.toUpperCase()}`),
    };
  };

  const menu = [
    getMenuItem(1, `${botId}/scenario`, 'scenario', icScenario, icScenarioSelected),
    getMenuItem(2, `${botId}/utterance`, 'utterance', icUtterance, icUtteranceSelected),
    getMenuItem(3, `${botId}/data-api`, 'data-api', icDataApi, icDataApiSelcted),
    getMenuItem(4, `${botId}/deployment`, 'deployment', icDeploy, icDeploySelected),
    getMenuItem(5, `${botId}/history`, 'history', icHistory, icHistorySelected),
    getMenuItem(
      6,
      `${botId}/statistics`,
      'statistics',
      icStatistics,
      icStatisticsSelected,
    ),
  ];

  const subMenu = [
    getMenuItem(1, 'help', 'help', icHelp, icHelpSelected),
    getMenuItem(2, `${botId}/setting`, 'setting', icSetting, icSettingSelected),
  ];

  const brandName = useRootState((state) => state.brandInfoReducer.brandName);

  return (
    <aside className={css}>
      <div className="mainMenuWrapper">
        <div className="expand">
          <button
            className="lnbBtn"
            onClick={handleSidebar}
            data-sidebarstatus={sidebarStatus}
          >
            {sidebarStatus ? (
              <img src={icLnbHide} alt="icLnbHide" />
            ) : (
              <img src={icLnbShow} alt="icLnbShow" />
            )}
          </button>
        </div>
        {isDashboard ? (
          <div className="partnerLnbHeader" data-sidebar={sidebarStatus}>
            <Link to="">
              {sidebarStatus ? (
                <p className="headerName">파트너스 센터</p>
              ) : (
                <div>
                  <img src={icChatbot} alt="icChatbot" />
                </div>
              )}
            </Link>
          </div>
        ) : (
          <div className="lnbHeader" data-sidebar={sidebarStatus}>
            <NavLink to="dashboard">
              {sidebarStatus ? (
                <p className="headerName"> {brandName} 챗봇 목록</p>
              ) : (
                <div>
                  <img src={icChatbot} alt="icChatbot" />
                </div>
              )}
            </NavLink>
          </div>
        )}

        {isDashboard ? (
          <></>
        ) : (
          <nav className="mainNav">
            <ul>
              {menu.map((item) => {
                return (
                  <NavLink
                    key={item.id}
                    to={`${item.url}`}
                    onClick={() => setPage(item.url)}
                  >
                    <li className={page === item.url ? 'selected' : ''}>
                      <span className="menuImg">
                        {page === item.url ? (
                          <img src={item.selectedIcon} alt={item.alt} />
                        ) : (
                          <img src={item.icon} alt={item.alt} />
                        )}
                      </span>
                      {<span className="desc">{item.desc}</span>}
                    </li>
                  </NavLink>
                );
              })}
            </ul>
          </nav>
        )}
      </div>

      <div className="subMenuWrapper">
        <nav className="subMenu">
          <ul>
            {(isDashboard ? subMenu.slice(0, 1) : subMenu).map((item) => {
              return (
                <NavLink
                  key={item.id}
                  to={`${item.url}`}
                  onClick={() => setPage(item.url)}
                >
                  <li className={page === item.url ? 'selected' : ''}>
                    <span className="menuImg">
                      {page === item.url ? (
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
