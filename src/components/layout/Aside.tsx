import {
  icBrandNameSelected,
  icHelp,
  icHelpSelected,
  icLnbHide,
  icLnbShow,
} from '@assets/index';
import { useI18n, useRootState } from '@hooks';
import { useOutsideClick } from '@hooks/useOutsideClick';
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

  const subMenu = [getMenuItem(1, 'help', 'help', icHelp, icHelpSelected)];

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
            <div className="chatbotBuilderImg"></div>
            {sidebarStatus ? <span>Chatbot Builder</span> : null}
          </div>
        </NavLink>
      </div>

      <div className="subMenuWrapper">
        <nav className="subMenu">
          <ul>
            {subMenu.map((item) => {
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
            <a href={`https://partnerscenter.lunacode.dev/${brandId}/dashboard`}>
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
