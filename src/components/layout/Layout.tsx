import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
  const { t } = useTranslation('common');
  nodeDefaultHelper.tc = t;

  return (
    <>
      <Outlet />
    </>
  );
};
