import '@styles/header.scss';

import { useLocation, useNavigate } from 'react-router-dom';

import useI18n from '../../hooks/useI18n';
import { useRootState } from '../../hooks/useRootState';

export const Header = () => {
  const { i18n, t, ts } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang, () => {
      const paths = location.pathname.split('/');
      paths[1] = lang;
      navigate(paths.join('/'));
    });
  };

  const brandName = useRootState((state) => state.brandInfoReducer.brandName);
  const user = 'UserName';

  return (
    <header>
      <div>
        <span className="brandName">{brandName}</span>
        <select
          className="language"
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
        <span className="userName">{user}</span>
      </div>
    </header>
  );
};
