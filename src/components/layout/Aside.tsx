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
  const menu = [
    {
      id: 1,
      url: `/${i18n.language}/dashboard`,
      icon: icHome,
      selectedListIcon: '',
      exact: true,
      alt: 'Home',
      desc: ts('HOME'),
    },
    {
      id: 2,
      url: `/${i18n.language}/scenario`,
      icon: icBotbuilder,
      selectedListIcon: '',
      alt: 'Scenario',
      desc: ts('SCENARIO'),
    },
    {
      id: 3,
      url: `/${i18n.language}/imgedit`,
      icon: icBotbuilder,
      selectedListIcon: '',
      alt: 'Image Editor',
      desc: ts('IMAGEEDITOR'),
    },
    {
      id: 4,
      url: `/${i18n.language}/utterance`,
      icon: icBotbuilder,
      selectedListIcon: '',
      alt: 'Utterance',
      desc: ts('UTTERANCE'),
    },
    {
      id: 5,
      url: `/${i18n.language}/skill`,
      icon: icBotbuilder,
      selectedListIcon: '',
      alt: 'Skill',
      desc: ts('SKILL'),
    },
    {
      id: 6,
      url: `/${i18n.language}/deployment`,
      icon: icBotbuilder,
      selectedListIcon: '',
      alt: 'Deployment',
      desc: ts('DEPLOYMENT'),
    },
    {
      id: 7,
      url: `/${i18n.language}/history`,
      icon: icBotbuilder,
      selectedListIcon: '',
      alt: 'History',
      desc: ts('HISTORY'),
    },
    {
      id: 8,
      url: `/${i18n.language}/statistics`,
      icon: icBotbuilder,
      selectedListIcon: '',
      alt: 'Statistics',
      desc: ts('STATISTICS'),
    },
  ];

  const subMenu = [
    {
      id: 1,
      url: `/${i18n.language}/help`,
      icon: icBotbuilder,
      selectedListIcon: '',
      alt: 'Help',
      desc: ts('HELP'),
    },
    {
      id: 2,
      url: `/${i18n.language}/help`,
      icon: icBotbuilder,
      selectedListIcon: '',
      alt: 'Setting',
      desc: ts('SETTING'),
    },
  ];

  const chatbotName = 'Chatbot Name';
  return (
    <aside className={css}>
      <div>
        <Hamburger onToggle={handleSidebar} isOpen={sidebarStatus} dark />
      </div>
      <div>
        <p className="chatbotName">{chatbotName}</p>
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
