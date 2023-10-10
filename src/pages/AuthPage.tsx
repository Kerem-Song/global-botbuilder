import { SystemModalContainer } from '@components/modal/SystemModalContainer';
import { useAuthClient } from '@hooks/client/authClient';
import { useQueryParams } from '@hooks/useQueryParams';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { ToastContainer } from 'react-toastify';

export const AuthPage = () => {
  const dispath = useDispatch();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { IssueTokenAsync } = useAuthClient();
  const queryParams = useQueryParams();
  const brandId = queryParams.get('brandid');
  const [navigateUrl, setNavigateUrl] = useState<string>();

  const handleAuth = async () => {
    if (!brandId) {
      return;
    }
    const res = await IssueTokenAsync({ brandId });
    if (res) {
      setNavigateUrl(`/${i18n.language}/${res.brandId}`);
    }
  };

  useEffect(() => {
    if (navigateUrl) {
      navigate(navigateUrl);
    }
  }, [navigateUrl]);

  useEffect(() => {
    handleAuth();
  }, [brandId]);

  return (
    <>
      <ToastContainer />
      <SystemModalContainer />
    </>
  );
};
