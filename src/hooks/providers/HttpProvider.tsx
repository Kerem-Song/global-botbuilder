import useI18n from '@hooks/useI18n';
import { useRootState } from '@hooks/useRootState';
import { useSystemModal } from '@hooks/useSystemModal';
import { setToken } from '@store/authSlice';
import { updateRole } from '@store/userInfoSlice';
import axios, { AxiosInstance } from 'axios';
import { createContext, FC } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';

import { IHasChildren } from '../../models/interfaces/IHasChildren';

const manualExceptionCode = [7301, 7604, 7610, 7614, 7638];

export const HttpContext = createContext<AxiosInstance | undefined>(undefined);

export const HttpProvider: FC<IHasChildren> = ({ children }) => {
  const { error } = useSystemModal();
  const { i18n, tc } = useI18n();
  const dispatch = useDispatch();
  const [cookies, setCookie] = useCookies(['RT']);
  const brandInfo = useRootState((state) => state.brandInfoReducer);
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    //withCredentials: true,
  });
  console.log('import.meta. env', import.meta.env);
  const urlToDashbaord = `/${i18n.language}/${brandInfo.brandId}/dashboard`;

  instance.interceptors.request.use(
    function (config) {
      /**
       * todo : Authorization같은 공통 Request 처리
       */
      if (!config.headers) {
        config.headers = {};
      }

      config.headers.Authorization = cookies.RT;
      return config;
    },

    function (err) {
      return Promise.reject(err);
    },
  );

  instance.interceptors.response.use(
    async function (response) {
      console.log('@res data', response.data);
      if (response.data.newToken) {
        console.log('newToken', response.data);
        setCookie('RT', response.data.newToken);
        dispatch(setToken({ refreshToken: response.data.newToken }));
        dispatch(
          updateRole({ staffType: response.data.staffType, role: response.data.role }),
        );
      }
      if (!response.data.isSuccess) {
        if (response.data.exception) {
          if (response.data.exception.errorCode === 7653) {
            error({
              title: tc(`HTTP_PROVIDER_NO_BOT_ERROR_TITLE`),
              description: tc(`HTTP_PROVIDER_DELETE_BOT_ERROR_DESC`),
            }).then(() => {
              document.location.href = urlToDashbaord;
            });
            return Promise.reject(new Error(response.data.exception.message));
          }
          const requestData = response.config.data;
          if (requestData) {
            const requestObj = JSON.parse(requestData);
            if (
              requestObj?.customErrorCode?.includes(response.data.exception.errorCode)
            ) {
              return response;
            }
          }
        }

        if (
          response.data.exception &&
          !manualExceptionCode.includes(response.data.exception.errorCode)
        ) {
          await error({
            title: 'error',
            description: (
              <span style={{ whiteSpace: 'pre-line' }}>
                {response.data.exception.message}
              </span>
            ),
          });
          return Promise.reject(new Error(response.data.exception.message));
        }
      }
      return response;
    },
    function (err) {
      /**
       * todo : 인증 실패 같은 공통 Exception 처리
       */
      const requestData = err.response.config.data;
      if (requestData) {
        const requestObj = JSON.parse(requestData);
        if (
          requestObj?.customErrorCode?.includes(err.response.data.exception.errorCode)
        ) {
          return err.response;
        }
      }
      if (err.response.status === 403 || err.response.status === 401) {
        if (err.response.data.exception.errorCode === 7659) {
          if (err.response.data.exception.staffRole === '0') {
            error({
              title: tc(`HTTP_PROVIDER_NO_BOT_ERROR_TITLE`),
              description: tc(`HTTP_PROVIDER_BOT_BUILDER_ERROR_DESC`),
            }).then(() => {
              console.log('logout');
              dispatch(setToken({ refreshToken: 'logout' }));
              const clientPrev = encodeURI(`${brandInfo.brandId}`);
              console.log(clientPrev);
              window.location.href = `${
                import.meta.env.VITE_LOGIN_URL
              }?clientPrev=${clientPrev}&clientType=${import.meta.env.VITE_CLIENT_TYPE}`;
            });
          } else {
            error({
              title: tc(`PAGE_PROVIDER_AUTH_ERROR_TITLE`),
              description: tc(`PAGE_PROVIDER_AUTH_ERROR_DESC`),
            }).then(() => {
              document.location.href = urlToDashbaord;
            });
          }
        } else {
          document.location.href = import.meta.env.VITE_PARTNERS_CENTER_URL;
        }
      }

      if (err.response.data.exception && err.response.data.exception.errorCode === 7656) {
        error({
          title: tc(`HTTP_PROVIDER_NO_BOT_ERROR_TITLE`),
          description: tc(`HTTP_PROVIDER_NO_BOT_ERROR_DESC`),
        }).then(() => {
          document.location.href = urlToDashbaord;
        });
      }
      return Promise.reject(err);
    },
  );

  return <HttpContext.Provider value={instance}>{children}</HttpContext.Provider>;
};
