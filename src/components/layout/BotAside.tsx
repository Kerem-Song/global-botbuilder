import {
  icBotProfile,
  icLine,
  icLnbHide,
  icLnbShow,
  icPartnersCenter,
} from '@assets/index';
import { Col, Row } from '@components';
import { IPopperSelectItem, Popper } from '@components/navigation';
import { Tooltip } from '@components/navigation/Tooltip';
import { useBotClient, useI18n, useRootState } from '@hooks';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { StaffType } from '@models';
import { menuModule } from '@modules/menuModule';
import { util } from '@modules/util';
import { initBotBuilder } from '@store/botbuilderSlice';
import { setSesstionToken } from '@store/botInfoSlice';
import { setSidebarClose, setSidebarStatus } from '@store/sidebarStatusSlice';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useLocation, useNavigate, useParams } from 'react-router-dom';

export const BotAside = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { botId } = useParams();
  const [page, setPage] = useState<string>();

  const { i18n, ts } = useI18n();

  const sidebarStatus = useRootState((state) => state.sideBarStatusReducer.isOpen);
  const botInfo = useRootState((state) => state.botInfoReducer.botInfo);
  const brandInfo = useRootState((state) => state.brandInfoReducer);
  const role = useRootState((state) => state.userInfoReducer.role);
  const staffType = useRootState((state) => state.userInfoReducer.staffType);
  const { getBotListQuery } = useBotClient();
  const handleSidebar = useCallback(() => dispatch(setSidebarStatus()), [dispatch]);
  const css = classNames({ 'aside-open': sidebarStatus });

  const { data } = getBotListQuery();

  useEffect(() => {
    const pageName = location.pathname.split('/').slice(-1)[0];
    setPage(pageName);
  }, [location.pathname]);

  console.log('role, staffType', role, staffType);

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

                navigate(
                  `/${i18n.language}/${brandInfo.brandId}/${id}/${util.getEnterBotPath(
                    staffType,
                    role,
                  )}`,
                );
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
          navigate(`/${i18n.language}/${brandInfo.brandId}/dashboard`);
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

  console.log('@url', botInfo?.iconUrl);

  return (
    <aside className={css} ref={sidebarRef}>
      <div className="mainMenuWrapper">
        <div className="expand" data-sidebar={sidebarStatus}>
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

        <NavLink to={`/${i18n.language}/${brandInfo.brandId}/dashboard`}>
          <div className="chatbotBuilderTitle" data-sidebar={sidebarStatus}>
            <div className="chatbotBuilderImg"></div>
            {sidebarStatus ? <span>Chatbot Builder</span> : null}
          </div>
        </NavLink>
        <Popper
          className="lnbHeaderBotNamePopper"
          placement="right-start"
          offset={[20, -10]}
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
            <div
              className={classNames('headerName')}
              role="presentation"
              onClick={(e) => (e.currentTarget.className = 'headerName selected')}
            >
              <div className="botProfileImg">
                {botInfo?.iconUrl ? (
                  <img src={botInfo.iconUrl} alt="icBotProfile" />
                ) : (
                  <img src={icBotProfile} alt="icBotProfile" className="altImg" />
                )}
              </div>{' '}
              {sidebarStatus ? (
                <div>
                  <p className="botName">{botInfo?.botName}</p>
                  <p className="brandName">{brandInfo.brandName}</p>{' '}
                </div>
              ) : null}
            </div>
          </div>
        </Popper>
        <nav className="mainNav" data-sidebar={sidebarStatus}>
          <ul>
            {menuModule.menu
              .filter((x) => util.checkRole(x.role, staffType, role))
              .map((item) => {
                return (
                  <Tooltip
                    key={item.id}
                    tooltip={ts(item.desc)}
                    placement="bottom-start"
                    offset={[10, 0]}
                    disable={sidebarStatus}
                  >
                    <NavLink
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
                        {<span className="desc">{ts(item.desc)}</span>}
                      </li>
                    </NavLink>
                  </Tooltip>
                );
              })}
          </ul>
        </nav>
      </div>
      <div className="subMenuWrapper" data-sidebar={sidebarStatus}>
        <nav className="subMenu">
          <ul>
            {menuModule.subMenu
              .filter(
                (x) =>
                  staffType === StaffType.Administrator ||
                  x.role === StaffType.Administrator ||
                  (role !== undefined && (x.role & role) === x.role),
              )
              .map((item) => {
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
                      {sidebarStatus && <span className="desc">{ts(item.desc)}</span>}
                    </li>
                  </NavLink>
                );
              })}
            <a
              href={`https://partnerscenter.lunacode.dev/${brandInfo.brandId}/dashboard`}
            >
              <li className="partnerLnbBtn">
                <span className="menuImg partnersCenterImg">
                  {/* <img src={icPartnersCenter} alt="icPartnersCenter"></img> */}
                </span>
                {sidebarStatus && <span className="desc">{ts('PARTNERS_CENTER')}</span>}
              </li>
            </a>
          </ul>
        </nav>
      </div>
    </aside>
  );
};
