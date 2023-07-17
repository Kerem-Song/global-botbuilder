import { useRootState } from '@hooks';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { systemModalClose } from '@store/systemModalSlice';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';

export const Layout = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('COMMON');
  const { brandId } = useParams();
  const { pathname } = useLocation();
  const brandIdState = useRootState((state) => state.brandInfoReducer.brandId);
  nodeDefaultHelper.tc = t;
  arrowHelper.tc = t;

  useEffect(() => {
    return () => {
      dispatch(systemModalClose());
    };
  }, [pathname]);

  console.log(brandId, brandIdState);

  if (brandId !== brandIdState) {
    document.location.href = import.meta.env.VITE_PARTNERS_CENTER_URL;
    return <></>;
  }

  return (
    <>
      <Outlet />
    </>
  );
};
