import { useRootState } from '@hooks/useRootState';
import { useSystemModal } from '@hooks/useSystemModal';
import { Role, StaffType } from '@models';
import { IHandle } from '@models/interfaces/IHandle';
import { util } from '@modules/util';
import { i18n } from 'i18next';
import { createContext, FC, useEffect, useState } from 'react';
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
      enterBot: (botId: string) => void;
    }
  | undefined
>(undefined);

export const PageProvider: FC<IPageProps> = ({ pageName, isReadOnly, children }) => {
  const { t } = useTranslation(pageName.toUpperCase());
  const { t: tc, i18n } = useTranslation('common'.toUpperCase());
  const { t: ts } = useTranslation('sidebar'.toUpperCase());
  const [navigateUrl, setNavigateUrl] = useState<string>();
  const { error } = useSystemModal();
  const navigate = useNavigate();
  const matches = useMatches();
  const userInfo = useRootState((state) => state.userInfoReducer);
  const brandInfo = useRootState((state) => state.brandInfoReducer);
  const role = userInfo.role || Role.None;
  const localeNavigate = (to: To, options?: NavigateOptions) => {
    if (typeof to === 'string') {
      navigate(`/${i18n.language}/${brandInfo.brandId}${to}`, options);
      return;
    }

    navigate(
      {
        pathname: `/${i18n.language}/${brandInfo.brandId}${to.pathname}`,
        hash: to.hash,
        search: to.search,
      },
      options,
    );
  };

  const enterBot = (botId: string) => {
    const path = util.getEnterBotPath(userInfo.staffType, userInfo.role);
    localeNavigate(`/${botId}/${path}`);
  };

  const handle = matches.find((m) => m.pathname === location.pathname)?.handle as IHandle;

  const isNotAuth =
    userInfo.staffType !== StaffType.Administrator &&
    handle?.role &&
    (role & handle.role) !== handle.role;

  useEffect(() => {
    if (isNotAuth) {
      error({
        title: tc(`PAGE_PROVIDER_AUTH_ERROR_TITLE`),
        description: tc(`PAGE_PROVIDER_AUTH_ERROR_DESC`),
      }).then(() => {
        localeNavigate('/dashboard');
      });
    }
  }, [isNotAuth]);

  if (isNotAuth) {
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
        enterBot,
      }}
    >
      {navigateUrl ? (
        <Navigate to={`/${i18n.language}/${brandInfo.brandId}${navigateUrl}`} />
      ) : (
        <>{children}</>
      )}
    </PageContext.Provider>
  );
};
