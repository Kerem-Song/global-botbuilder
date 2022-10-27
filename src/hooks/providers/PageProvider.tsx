import { i18n } from 'i18next';
import { createContext, FC } from 'react';
import { TFunction, useTranslation } from 'react-i18next';

import { IPageProps } from '../../models/interfaces/IPageProps';

export const PageContext = createContext<
  | {
      pageName: string;
      t: TFunction<string, undefined>;
      tc: TFunction<string, undefined>;
      ts: TFunction<string, undefined>;
      i18n: i18n;
    }
  | undefined
>(undefined);

export const PageProvider: FC<IPageProps> = ({ pageName, children }) => {
  const { t } = useTranslation(pageName);
  const { t: tc, i18n } = useTranslation('common');
  const { t: ts } = useTranslation('sidebar');
  return (
    <PageContext.Provider value={{ t, tc, ts, i18n, pageName }}>
      {children}
    </PageContext.Provider>
  );
};
