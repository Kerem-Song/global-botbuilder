import { useRootState } from '@hooks';
import { useAuthClient } from '@hooks/client/authClient';
import { arrowHelper } from '@modules/arrowHelper';
import { nodeDefaultHelper } from '@modules/nodeDefaultHelper';
import { setBrandId } from '@store/brandInfoSlice';
import { systemModalClose } from '@store/systemModalSlice';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation, useParams } from 'react-router-dom';

export const Layout = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('COMMON');
  const location = useLocation();
  const { brandId } = useParams();
  const { pathname } = useLocation();
  const auth = useRootState((state) => state.authReducer);
  const { IssueTokenAsync } = useAuthClient();

  const reAuthHandler = async () => {
    if (!brandId) {
      return;
    }
    await IssueTokenAsync({ brandId });
  };

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
      if (!auth.refreshToken) {
        reAuthHandler();
      }
    }
  }, [brandId, auth.refreshToken]);

  if (!auth.refreshToken) {
    // const clientPrev = encodeURI(`${brandId}|${location.pathname}`);
    // document.location.href = `${
    //   import.meta.env.VITE_LOGIN_URL
    // }?clientPrev=${clientPrev}&clientType=${import.meta.env.VITE_CLIENT_TYPE}`;
    return <></>;
  }

  return (
    <>
      <Outlet />
    </>
  );
};
