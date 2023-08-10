import { icChatbotBuilder, icLnbHide, icLnbShow, icPartnersCenter } from '@assets/index';
import { Tooltip } from '@components';
import { useI18n, useRootState } from '@hooks';
import { useOutsideClick } from '@hooks/useOutsideClick';
import { menuModule } from '@modules/menuModule';
import { setSidebarClose, setSidebarStatus } from '@store/sidebarStatusSlice';
import classNames from 'classnames';
import { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

export const Aside = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState<string>();

  const { i18n, ts } = useI18n();
  const sidebarStatus = useRootState((state) => state.sideBarStatusReducer.isOpen);
  const brandId = useRootState((state) => state.brandInfoReducer.brandId);
  const handleSidebar = useCallback(() => dispatch(setSidebarStatus()), [dispatch]);
  const css = classNames({ 'aside-open': sidebarStatus });
  const sidebarRef = useRef<HTMLElement>(null);
  const partnersCenterUrl = `${
    import.meta.env.VITE_PARTNERS_CENTER_URL
  }/${brandId}/dashboard`;
  useOutsideClick(sidebarRef, () => {
    dispatch(setSidebarClose());
  });

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
        <NavLink to={`/${i18n.language}/${brandId}/dashboard`}>
          <div className="chatbotBuilderTitle" data-sidebar={sidebarStatus}>
            <div className="chatbotBuilderImg">
              <img src={icChatbotBuilder} alt="icChatbotBuilder" />
            </div>
            {sidebarStatus ? <span>Chatbot Builder</span> : null}
          </div>
        </NavLink>
      </div>

      <div className="subMenuWrapper">
        <nav className="subMenu">
          <ul>
            {menuModule.subMenu.map((item) => {
              console.log('@item.desc', item.desc);
              return (
                <Tooltip
                  key={item.id}
                  tooltip={ts(item.desc)}
                  placement="bottom-start"
                  offset={[59, -43]}
                  disable={sidebarStatus}
                >
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
                </Tooltip>
              );
            })}
            <Tooltip
              tooltip={ts('PARTNERS_CENTER')}
              placement="bottom-start"
              offset={[59, -43]}
              disable={sidebarStatus}
            >
              <a href={partnersCenterUrl}>
                <li className="partnerLnbBtn">
                  <span className="menuImg partnersCenterImg">
                    <img src={icPartnersCenter} alt="icPartnersCenter" />
                  </span>
                  {sidebarStatus && <span className="desc">{ts('PARTNERS_CENTER')}</span>}
                </li>
              </a>
            </Tooltip>
          </ul>
        </nav>
      </div>
    </aside>
  );
};
