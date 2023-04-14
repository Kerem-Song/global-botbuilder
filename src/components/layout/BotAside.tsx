import {
  icBrandName,
  icChatbot,
  icDeploy,
  icDeploySelected,
  icHelp,
  icHelpSelected,
  icHistory,
  icHistorySelected,
  icLine,
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
import { IPopperSelectItem, Popper } from '@components/navigation';
import { useBotClient } from '@hooks';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { initBotBuilder } from '@store/botbuilderSlice';
import { setSesstionToken } from '@store/botInfoSlice';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';

import useI18n from '../../hooks/useI18n';
import { useRootState } from '../../hooks/useRootState';
import { setSidebarClose, setSidebarStatus } from '../../store/sidebarStatusSlice';

export const BotAside = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { botId } = useParams();
  const [page, setPage] = useState<string>();

  const { i18n, t, ts } = useI18n();

  const sidebarStatus = useRootState((state) => state.sideBarStatusReducer.isOpen);
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const brandName = useRootState((state) => state.brandInfoReducer.brandName);
  const { getBotListQuery } = useBotClient();
  const handleSidebar = useCallback(() => dispatch(setSidebarStatus()), [dispatch]);
  const css = classNames({ 'aside-open': sidebarStatus });

  const { data } = getBotListQuery();

  useEffect(() => {
    const pageName = location.pathname.split('/').slice(-1)[0];
    setPage(pageName);
  }, [location.pathname]);

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
      name,
      icon,
      selectedIcon,
      alt: url.replace(/^./, url[0].toUpperCase()),
      desc: ts(`${name.toUpperCase()}`),
    };
  };

  const menu = [
    getMenuItem(1, `${botId}/scenario`, 'scenario', icScenario, icScenarioSelected),
    getMenuItem(2, `${botId}/utterance`, 'utterance', icUtterance, icUtteranceSelected),
    //getMenuItem(3, `${botId}/data-api`, 'data-api', icDataApi, icDataApiSelcted),
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

  const botList: IPopperSelectItem<{ action: (id: string) => void }>[] = [
    ...(data
      ? data.slice(0, 3).map((x) => {
          return {
            id: x.id,
            name: x.botName,
            select: x.botName,
            icon: icLine,
            data: {
              action: (id: string) => {
                if (botId === id) {
                  return;
                }
                navigate(`/${i18n.language}/${id}/scenario`);
                dispatch(setSesstionToken());
                dispatch(initBotBuilder());
              },
            },
          };
        })
      : []),
    {
      id: 'list',
      name: ts('LIST_ALL'),
      select: 'List',
      type: 'button',
      data: {
        action: (id: string) => {
          console.log(id);
          navigate(`/${i18n.language}/dashboard`);
          dispatch(setSesstionToken());
          dispatch(initBotBuilder());
        },
      },
    },
  ];

  const sidebarRef = useRef<HTMLElement>(null);

  useOutsideClick(sidebarRef, () => {
    dispatch(setSidebarClose());
  });

  // useEffect(() => {
  //   if (sidebarStatus) {
  //     outsideClick;
  //   }
  // }, [sidebarStatus]);

  return (
    <aside className={css} ref={sidebarRef}>
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

        <NavLink to={`/${i18n.language}/dashboard`}>
          <div className="brandName" data-sidebar={sidebarStatus}>
            {sidebarStatus ? (
              <p>
                {brandName} <span className="chatbotList">{ts(`CHATBOT_LIST`)}</span>
              </p>
            ) : (
              <div className="brandNameWrapper">
                <div className="brandNameImg" />
              </div>
            )}
          </div>
        </NavLink>
        <Popper
          placement="right-start"
          offset={[10, -10]}
          showBullet
          popup
          popupList
          popperSelect={botList}
          onChange={(e) => {
            e.data?.action(e.id);
          }}
          selectedId={botId}
        >
          <div className="lnbHeader" data-sidebar={sidebarStatus}>
            {sidebarStatus ? (
              <p className="headerName"> {botInfo?.botName}</p>
            ) : (
              <div>
                <img src={icChatbot} alt="icChatbot" />
              </div>
            )}
          </div>
        </Popper>

        <nav className="mainNav">
          <ul>
            {menu.map((item) => {
              return (
                <NavLink
                  key={item.id}
                  to={`${item.url}`}
                  onClick={() => {
                    setPage(item.name);
                    dispatch(setSidebarClose());
                  }}
                >
                  <li className={page === item.name ? 'selected' : ''}>
                    <span className="menuImg">
                      {page === item.name ? (
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
      </div>

      <div className="subMenuWrapper">
        <nav className="subMenu">
          <ul>
            {subMenu.map((item) => {
              return (
                <NavLink
                  key={item.id}
                  to={`${item.url}`}
                  onClick={() => {
                    setPage(item.url);
                    dispatch(setSidebarClose());
                  }}
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
