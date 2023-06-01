import {
  icBrandNameSelected,
  icHelp,
  icHelpSelected,
  icLnbHide,
  icLnbShow,
} from '@assets/index';
import { useOutsideClick } from '@hooks/useOutsideClick';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import useI18n from '../../hooks/useI18n';
import { useRootState } from '../../hooks/useRootState';
import { setSidebarClose, setSidebarStatus } from '../../store/sidebarStatusSlice';

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
        <div className="partnerLnbHeader" data-sidebar={sidebarStatus}>
          <a href={`https://partnerscenter.lunacode.dev/${brandId}/dashboard`}>
            {sidebarStatus ? (
              <p className="headerName">{ts('PARTNERS_CENTER')}</p>
            ) : (
              <div>
                <img src={icBrandNameSelected} alt="icChatbot" />
              </div>
            )}
          </a>
        </div>
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
          </ul>
        </nav>
      </div>
    </aside>
  );
};
