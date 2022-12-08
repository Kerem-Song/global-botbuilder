import '@styles/header.scss';

import { Popper } from '@components';
import { useLocation, useNavigate } from 'react-router-dom';

import useI18n from '../../hooks/useI18n';
import { useRootState } from '../../hooks/useRootState';

export const Header = () => {
  const { i18n, t, ts } = useI18n();
  const location = useLocation();
  const language = i18n.language;

  const navigate = useNavigate();
  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang, () => {
      const paths = location.pathname.split('/');
      paths[1] = lang;
      navigate(paths.join('/'));
    });
  };

  const brandName = useRootState((state) => state.brandInfoReducer.brandName);
  const pageName = location.pathname.slice(4);

  const user = 'UserName';
  const languageMenus = [
    {
      id: `ko`,
      name: '한국어',
      select: '한',
    },
    {
      id: `ja`,
      name: '日本語',
      select: '日',
    },
    {
      id: `en`,
      name: 'English',
      select: 'Eng',
    },
    {
      id: `key`,
      name: 'Key',
      select: 'Key',
    },
  ];

  const langSelect = languageMenus.find((item) => item.id && item.id === language);

  return (
    <header>
      <div className="headerWapper">
        <div className="brandPage">
          <span className="brandName">{brandName}</span>
          <span className="pageName">{pageName}</span>
        </div>
        <div className="languageContainer">
          <Popper
            popperSelect={languageMenus}
            placement="bottom-end"
            offset={[-6, 5]}
            popup
            popupList
            onChange={(e) => {
              changeLanguageHandler(e.id);
            }}
          >
            <button className="language">{langSelect && langSelect.select}</button>
          </Popper>
        </div>
        <span className="userName">{user}</span>
      </div>
    </header>
  );
};
