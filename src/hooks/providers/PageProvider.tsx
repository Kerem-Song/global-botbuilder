import { useRootState } from '@hooks/useRootState';
import { useSystemModal } from '@hooks/useSystemModal';
import { IHandle } from '@models/interfaces/IHandle';
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
  const role = userInfo.role || 0;
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

  const handle = matches.find((m) => m.pathname === location.pathname)?.handle as IHandle;

  console.log(userInfo.staffType, handle?.role, role);

  const isNotAuth =
    userInfo.staffType !== 0 && handle?.role && (role & handle.role) !== handle.role;

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
