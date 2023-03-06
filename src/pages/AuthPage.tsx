import { useAuthClient } from '@hooks/client/authClient';
import { useQueryParams } from '@hooks/useQueryParams';
import { setToken } from '@store/authSlice';
import { setBrandInfo } from '@store/brandInfoSlice';
import { setUserInfo } from '@store/userInfSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate } from 'react-router';

export const AuthPage = () => {
  const dispath = useDispatch();
  const navigate = useNavigate();
  const { IssueTokenAsync } = useAuthClient();
  const queryParams = useQueryParams();
  const code = queryParams.get('code');
  const brandId = queryParams.get('brandId');

  const handleAuth = async () => {
    if (!brandId || !code) {
      return <></>;
    }
    const res = await IssueTokenAsync({ brandId, tokenCode: code });
    dispath(setToken({ refreshToken: res.token }));
    dispath(setBrandInfo({ brandId: res.brandId, brandName: res.brandName }));
    dispath(
      setUserInfo({
        loginId: res.loginId,
        loginUserName: res.loginUserName,
        companyName: res.companyName,
        role: res.role,
        starffType: res.staffType,
      }),
    );
    navigate('/');
  };

  useEffect(() => {
    handleAuth();
  }, [brandId, code]);

  return <></>;
};