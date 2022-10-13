import classNames from 'classnames';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useI18n from '../../hooks/useI18n';

export const Aside = () => {
  const { i18n } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState<boolean>();
  const css = classNames({ 'aside-open': isOpen });
  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
  };

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
        <button onClick={handleToggleOpen}>TG</button>
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
    </aside>
  );
};
