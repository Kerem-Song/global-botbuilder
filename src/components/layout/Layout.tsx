import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { systemModalClose } from '@store/systemModalSlice';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';

export const Layout = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('common'.toUpperCase());
  const { pathname } = useLocation();
  nodeDefaultHelper.tc = t;
  arrowHelper.tc = t;
  useEffect(() => {
    return () => {
      dispatch(systemModalClose());
    };
  }, [pathname]);
  return (
    <>
      <Outlet />
    </>
  );
};
