import { icUser } from '@assets';
import { Button, IPopperItem, Popper } from '@components';
import { BotTesterComponent } from '@components/pages/scenario/bot-tester/BotTesterComponent';
import { useI18n, useRootState } from '@hooks';
import { IHandle } from '@models/interfaces/IHandle';
import { setToken } from '@store/authSlice';
import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useMatches, useNavigate } from 'react-router-dom';

export const Header: FC<{ isBotPage?: boolean; name: string }> = ({
  isBotPage,
  name,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const matches = useMatches();
  const { i18n, ts, tc, t } = useI18n('botTest');
  const navigate = useNavigate();
  const [isTesterOpen, setIsTesterOpen] = useState(false);

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
  const brandInfo = useRootState((state) => state.brandInfoReducer);
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
          dispatch(setToken({ refreshToken: 'logout' }));
          const clientPrev = encodeURI(`${brandInfo.brandId}`);
          window.location.href = `${
            import.meta.env.VITE_LOGIN_URL
          }?clientPrev=${clientPrev}&clientType=${import.meta.env.VITE_CLIENT_TYPE}`;
        },
      },
    },
  ];

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

  return (
    <header>
      <div className="headerWapper">
        <div className="brandPage">
          <span className="brandName">{name}</span>
          <span className="pageName">{pageName}</span>
        </div>
        <div className="rightNav">
          {isBotPage && (
            <Button type="primary" small onClick={() => setIsTesterOpen(true)}>
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
              if (e.data?.action) {
                e.data.action();
              }
            }}
          >
            <Button shape="ghost" icon={icUser} className="userName">
              {userInfo.loginUserName}
            </Button>
          </Popper>
          <BotTesterComponent
            isTesterOpen={isTesterOpen}
            setIsTesterOpen={setIsTesterOpen}
          />
        </div>
      </div>
    </header>
  );
};
