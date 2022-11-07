import '@styles/aside.scss';

import classNames from 'classnames';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import icBotbuilder from '../../assets/ic_botbuilder.png';
import icHome from '../../assets/ic_home.png';
import useI18n from '../../hooks/useI18n';
import { useRootState } from '../../hooks/useRootState';
import { setSidebarStatus } from '../../store/sidebarStatusSlice';
import Hamburger from '../general/Hamburger';

export const Aside = () => {
  const { i18n, t, ts } = useI18n();

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
    getMenuItem(1, 'dashboard', icHome, ''),
    getMenuItem(2, 'scenario', icBotbuilder, ''),
    getMenuItem(3, 'utterance', icBotbuilder, ''),
    getMenuItem(4, 'skill', icBotbuilder, ''),
    getMenuItem(5, 'deployment', icBotbuilder, ''),
    getMenuItem(6, 'history', icBotbuilder, ''),
    getMenuItem(7, 'statistics', icBotbuilder, ''),
  ];

  const subMenu = [
    getMenuItem(1, 'help', icBotbuilder, ''),
    getMenuItem(2, 'setting', icBotbuilder, ''),
  ];

  const brandName = useRootState((state) => state.brandInfoReducer.brandName);
  const chatbotName = sidebarStatus ? brandName : brandName.slice(0, 1);

  return (
    <aside className={css}>
      <div>
        <Hamburger onToggle={handleSidebar} isOpen={sidebarStatus} dark />
      </div>
      <div>
        <p className={`chatbotName ${css}`}>{chatbotName}</p>
      </div>
      <nav className="nav">
        <ul>
          {menu.map((item) => {
            return (
              <NavLink key={item.id} to={`${item.url}`}>
                <li className="">
                  <span className="menuImg">
                    <img src={item.icon} alt={item.alt} />
                  </span>
                  <span className="desc">{item.desc}</span>
                </li>
              </NavLink>
            );
          })}
        </ul>
      </nav>
      <nav className="subMenu">
        <ul>
          {subMenu.map((item) => {
            return (
              <NavLink key={item.id} to={`${item.url}`}>
                <li className="">
                  <span className="subMenuImg">
                    <img src={item.icon} alt={item.alt} />
                  </span>
                  <span className="desc">{item.desc}</span>
                </li>
              </NavLink>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
