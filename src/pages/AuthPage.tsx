import { SystemModalContainer } from '@components/modal/SystemModalContainer';
import { useAuthClient } from '@hooks/client/authClient';
import { useQueryParams } from '@hooks/useQueryParams';
import { setToken } from '@store/authSlice';
import { setBrandInfo } from '@store/brandInfoSlice';
import { setUserInfo } from '@store/userInfoSlice';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';

export const AuthPage = () => {
  const dispath = useDispatch();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [cookies, setCookie, removeCookie] = useCookies(['RT', 'BRAND']);
  const { IssueTokenAsync } = useAuthClient();
  const queryParams = useQueryParams();
  const code = queryParams.get('code');
  const returnInfo = queryParams.get('state');

  const handleAuth = async () => {
    if (!returnInfo || !code) {
      return <></>;
    }

    const [brandId, returnUrl] = decodeURI(returnInfo).split('|');

    const res = await IssueTokenAsync({ brandId, tokenCode: code });
    //dispath(setToken({ refreshToken: res.token }));
    setCookie('RT', res.token);
    setCookie('BRAND', brandId);
    dispath(setBrandInfo({ brandId: res.brandId, brandName: res.brandName }));
    dispath(
      setUserInfo({
        loginId: res.loginId,
        loginUserName: res.loginUserName,
        companyName: res.companyName,
        role: res.role,
        staffType: res.staffType,
      }),
    );
    console.log('navigate', `/${i18n.language}/${res.brandId}`);
    // navigate(`/${i18n.language}/${res.brandId}`);
    if (returnUrl) {
      navigate(returnUrl);
    } else {
      navigate(`/${i18n.language}/${res.brandId}`);
    }
  };

  useEffect(() => {
    handleAuth();
  }, [returnInfo, code]);

  return (
    <>
      <ToastContainer />
      <SystemModalContainer />
    </>
  );
};
