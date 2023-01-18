import '@styles/header.scss';

import { Popper } from '@components';
import { BotTester } from '@components/pages/scenario/BotTester/BotTester';
import { useModalOpen } from '@hooks';
import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import useI18n from '../../hooks/useI18n';
import { useRootState } from '../../hooks/useRootState';

export const Header: FC<{ isBotPage?: boolean }> = ({ isBotPage }) => {
  const { i18n, t, ts } = useI18n();
  const location = useLocation();
  const language = i18n.language;
  const { isOpen, handleIsOpen } = useModalOpen();

  const navigate = useNavigate();
  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang, () => {
      const paths = location.pathname.split('/');
      paths[1] = lang;
      navigate(paths.join('/'));
    });
  };

  const brandName = useRootState((state) => state.brandInfoReducer.brandName);
  const pageName = location.pathname.split('/').slice(-1)[0];

  useEffect(() => {
    handleIsOpen(false);
  }, [location]);

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
        <div className="rightNav">
          {isBotPage && (
            <button className="testerBtn" onClick={() => handleIsOpen(true)}>
              Test
            </button>
          )}
          <Popper
            popperSelect={languageMenus}
            placement="bottom-end"
            offset={[0, 5]}
            popup
            popupList
            onChange={(e) => {
              changeLanguageHandler(e.id);
            }}
          >
            <button className="languageBtn">{langSelect && langSelect.select}</button>
          </Popper>
          <span className="userName">{user}</span>
          <BotTester isOpen={isOpen} handleIsOpen={handleIsOpen} />
        </div>
      </div>
    </header>
  );
};
