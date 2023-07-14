import { icUser } from '@assets';
import { Button, IPopperItem, Popper } from '@components';
import { BotTesterComponent } from '@components/pages/scenario/bot-tester/BotTesterComponent';
import { useModalOpen } from '@hooks';
import { IHandle } from '@models/interfaces/IHandle';
import { setToken } from '@store/authSlice';
import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useMatches, useNavigate } from 'react-router-dom';

import useI18n from '../../hooks/useI18n';
import { useRootState } from '../../hooks/useRootState';

export const Header: FC<{ isBotPage?: boolean; name: string }> = ({
  isBotPage,
  name,
}) => {
  const { tc } = useI18n();
  const dispatch = useDispatch();
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
  const userInfo = useRootState((state) => state.userInfoReducer);
  const userInfoMenus: IPopperItem<{ action: () => void }>[] = [
    {
      id: 'info',
      name: 'cs_kimsuky',
      type: 'children',
      children: (
        <div className="luna-userInfo-container">
          <div className="userInfoTitle">
            <p className="username">{userInfo.loginUserName}</p>
          </div>
          <div className="userBrandInfo">
            <p className="userBrandName">{userInfo.companyName}</p>
            <p className="userAccount">{userInfo.loginId}</p>
          </div>
        </div>
      ),
    },
    {
      id: 'logout',
      name: tc('LOGOUT'),
      type: 'button',
      data: {
        action: () => {
          console.log('logout');
          dispatch(setToken({ refreshToken: undefined }));
          window.location.href =
            'https://auth.lunacode.dev/oauth/signin?flag=logout&clientPrev=null&clientType=3';
        },
      },
    },
  ];
  const location = useLocation();
  const matches = useMatches();
  const { i18n, ts } = useI18n();
  const { t } = useI18n('botTest');
  const navigate = useNavigate();

  const changeLanguageHandler = (lang: string) => {
    i18n.changeLanguage(lang, () => {
      const paths = location.pathname.split('/');
      paths[1] = lang;
      navigate(paths.join('/'));
    });
  };

  const language = i18n.language;

  const handle = matches.find((m) => m.pathname === location.pathname)?.handle as IHandle;
  const pageName = ts(handle.title) || location.pathname.split('/').slice(-1)[0];
  const langSelect = languageMenus.find((item) => item.id && item.id === language);

  const { isOpen, handleIsOpen } = useModalOpen();

  useEffect(() => {
    handleIsOpen(false);
  }, [location]);

  return (
    <header>
      <div className="headerWapper">
        <div className="brandPage">
          <span className="brandName">{name}</span>
          <span className="pageName">{pageName}</span>
        </div>
        <div className="rightNav">
          {isBotPage && (
            <Button type="primary" small onClick={() => handleIsOpen(true)}>
              {t('BOT_TESTER')}
            </Button>
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
            selectedId={language}
          >
            <button className="languageBtn">{langSelect && langSelect.select}</button>
          </Popper>
          <Popper
            className="userInfoMenus"
            placement="bottom-end"
            offset={[0, 5]}
            popperItems={userInfoMenus}
            onChange={(e) => {
              console.log(e);
              if (e.data?.action) {
                e.data.action();
              }
            }}
          >
            <Button shape="ghost" icon={icUser} className="userName">
              {userInfo.loginUserName}
            </Button>
          </Popper>
          <BotTesterComponent isOpen={isOpen} handleIsOpen={handleIsOpen} />
        </div>
      </div>
    </header>
  );
};
