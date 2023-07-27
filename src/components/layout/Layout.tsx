import { useRootState } from '@hooks';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { setBrandId } from '@store/brandInfoSlice';
import { systemModalClose } from '@store/systemModalSlice';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom';

export const Layout = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('COMMON');
  const location = useLocation();
  const { brandId } = useParams();
  const { pathname } = useLocation();
  const brandIdState = useRootState((state) => state.brandInfoReducer.brandId);
  const [cookies] = useCookies(['RT', 'BRAND']);
  nodeDefaultHelper.tc = t;
  arrowHelper.tc = t;

  useEffect(() => {
    return () => {
      dispatch(systemModalClose());
    };
  }, [pathname]);

  useEffect(() => {
    if (brandId) {
      dispatch(setBrandId(brandId));
    }
  }, [brandId]);
  console.log(brandId, cookies.BRAND);

  if (!cookies.RT) {
    const clientPrev = encodeURI(`${brandId}|${location.pathname}`);
    document.location.href = `${
      import.meta.env.VITE_LOGIN_URL
    }?clientPrev=${clientPrev}&clientType=${import.meta.env.VITE_CLIENT_TYPE}`;
    return <></>;
  }

  if (brandId !== cookies.BRAND) {
    document.location.href = import.meta.env.VITE_PARTNERS_CENTER_URL;
    return <></>;
  }

  return (
    <>
      <Outlet />
    </>
  );
};
