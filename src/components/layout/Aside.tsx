import '../../styles/aside.scss';

import classNames from 'classnames';
import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import icBotbuilder from '../../assets/ic_botbuilder.png';
import icHome from '../../assets/ic_home.png';
import useI18n from '../../hooks/useI18n';
import Hamburger from '../general/Hamburger';

export const Aside = () => {
  const { i18n, t, ts } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>(true);
  const css = classNames({ 'aside-open': isOpen });
  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };
  const menu = [
    {
      id: 1,
      url: '/dashboard',
      icon: icHome,
      selectedListIcon: '',
      exact: true,
      alt: 'Home',
      desc: ts('HOME'),
    },
    {
      id: 2,
      url: '/scenario',
      icon: icBotbuilder,
      selectedListIcon: '',
      alt: 'Chatbot builder',
      desc: ts('BOTBUILDER'),
    },
  ];

  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang, () => {
      const paths = location.pathname.split('/');
      paths[1] = lang;
      navigate(paths.join('/'));
    });
  };

  return (
    <aside className={css}>
      <div>
        <Hamburger onToggle={handleToggleOpen} isOpen={isOpen} dark />
      </div>
      <select
        value={i18n.language}
        onChange={(e) => {
          changeLanguageHandler(e.target.value);
        }}
      >
        <option value="ko">한국어</option>
        <option value="en">ENGLISH</option>
        <option value="ja">日本語</option>
        <option value="key">키확인</option>
      </select>
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
    </aside>
  );
};
