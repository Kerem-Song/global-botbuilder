import { i18n } from 'i18next';
import { createContext, FC } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import { NavigateFunction, NavigateOptions, To, useNavigate } from 'react-router';

import { IPageProps } from '../../models/interfaces/IPageProps';

export const PageContext = createContext<
  | {
      pageName: string;
      t: TFunction<string, undefined>;
      tc: TFunction<string, undefined>;
      ts: TFunction<string, undefined>;
      i18n: i18n;
      navigate: (to: To, options?: NavigateOptions) => void;
    }
  | undefined
>(undefined);

export const PageProvider: FC<IPageProps> = ({ pageName, children }) => {
  const { t } = useTranslation(pageName);
  const { t: tc, i18n } = useTranslation('common');
  const { t: ts } = useTranslation('sidebar');
  const navigate = useNavigate();
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
  return (
    <PageContext.Provider value={{ t, tc, ts, i18n, pageName, navigate: localeNavigate }}>
      {children}
    </PageContext.Provider>
  );
};
