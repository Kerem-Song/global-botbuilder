import { useRootState } from '@hooks/useRootState';
import { useSystemModal } from '@hooks/useSystemModal';
import { IHandle } from '@models/interfaces/IHandle';
import { i18n } from 'i18next';
import { createContext, FC, useState } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { Navigate, NavigateOptions, To, useMatches, useNavigate } from 'react-router';

import { IPageProps } from '../../models/interfaces/IPageProps';

export const PageContext = createContext<
  | {
      pageName: string;
      isReadOnly?: boolean;
      t: TFunction<string, undefined>;
      tc: TFunction<string, undefined>;
      ts: TFunction<string, undefined>;
      i18n: i18n;
      navigate: (to: To, options?: NavigateOptions) => void;
      setNavigateUrl: (value: string) => void;
    }
  | undefined
>(undefined);

export const PageProvider: FC<IPageProps> = ({ pageName, isReadOnly, children }) => {
  const { t } = useTranslation(pageName);
  const { t: tc, i18n } = useTranslation('common');
  const { t: ts } = useTranslation('sidebar');
  const [navigateUrl, setNavigateUrl] = useState<string>();
  const { error } = useSystemModal();
  const navigate = useNavigate();
  const matches = useMatches();
  const userInfo = useRootState((state) => state.userInfoReducer);
  const role = userInfo.role || 0;
  const localeNavigate = (to: To, options?: NavigateOptions) => {
    if (typeof to === 'string') {
      navigate(`/${i18n.language}${to}`, options);
      return;
    }

    navigate(
      { pathname: `/${i18n.language}${to.pathname}`, hash: to.hash, search: to.search },
      options,
    );
  };

  const handle = matches.find((m) => m.pathname === location.pathname)?.handle as IHandle;

  console.log(userInfo.staffType, handle?.role, role);
  if (userInfo.staffType !== 0 && handle?.role && (role & handle.role) !== handle.role) {
    error({ title: '권한', description: '메뉴 권한이 없습니다.' }).then(() => {
      localeNavigate('/dashboard');
    });
    return <></>;
  }
  return (
    <PageContext.Provider
      value={{
        t,
        tc,
        ts,
        i18n,
        pageName,
        isReadOnly,
        navigate: localeNavigate,
        setNavigateUrl,
      }}
    >
      {navigateUrl ? (
        <Navigate to={`/${i18n.language}${navigateUrl}`} />
      ) : (
        <>{children}</>
      )}
    </PageContext.Provider>
  );
};
