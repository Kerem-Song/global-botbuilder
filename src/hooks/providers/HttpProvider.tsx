import { useErrorExecuter } from '@hooks/useErrorExecuter';
import useI18n from '@hooks/useI18n';
import { useRootState } from '@hooks/useRootState';
import { useSystemModal } from '@hooks/useSystemModal';
import { errorCodes, ErrorType, ErrorValueType } from '@models/types/errorCodes';
import { setToken } from '@store/authSlice';
import { updateRole } from '@store/userInfoSlice';
import axios, { AxiosInstance } from 'axios';
import { createContext, FC } from 'react';
import { useDispatch } from 'react-redux';

import { IHasChildren } from '../../models/interfaces/IHasChildren';

const manualExceptionCode = [7301, 7604, 7610, 7614, 7638];

export const HttpContext = createContext<AxiosInstance | undefined>(undefined);

export const HttpProvider: FC<IHasChildren> = ({ children }) => {
  const { error } = useSystemModal();
  const { i18n, tc } = useI18n();
  const dispatch = useDispatch();
  const brandInfo = useRootState((state) => state.brandInfoReducer);
  const { refreshToken } = useRootState((state) => state.authReducer);
  const errorExecuter = useErrorExecuter();
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
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
      config.headers.Authorization = refreshToken;
      return config;
    },

    function (err) {
      return Promise.reject(err);
    },
  );

  instance.interceptors.response.use(
    async function (response) {
      if (response.data.newToken) {
        console.log('newToken', response.data);
        dispatch(setToken({ refreshToken: response.data.newToken }));
        dispatch(
          updateRole({ staffType: response.data.staffType, role: response.data.role }),
        );
      }
      if (!response.data.isSuccess) {
        if (response.data.exception) {
          if (response.data.exception.errorCode === 7401) {
            // 7401 -> 해당 봇 메뉴에 대한 권한은 있으나, 봇이 존재하지 않을 경우
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
            if (typeof requestData === 'string') {
              const requestObj = JSON.parse(requestData);
              if (
                requestObj?.customErrorCode?.includes(response.data.exception.errorCode)
              ) {
                return response;
              }
            } else {
              // form 데이터
              const formData: FormData = requestData;
              const customErrorCode = formData.get('customErrorCode');
              if (
                String(response.data.exception.errorCode) === customErrorCode?.valueOf()
              ) {
                return response;
              }
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
      if (!err.response) {
        document.location.href = import.meta.env.VITE_LOGIN_URL;
        return Promise.reject(err);
      }
      /**
       * todo : 인증 실패 같은 공통 Exception 처리
       */
      const requestData = err.response?.config?.data;
      if (requestData) {
        if (typeof requestData === 'string') {
          const requestObj = JSON.parse(requestData);
          if (
            requestObj?.customErrorCode?.includes(err.response.data.exception.errorCode)
          ) {
            return err.response;
          }
        } else {
          // form 데이터
          const formData: FormData = requestData;
          const customErrorCode = formData.get('customErrorCode');
          if (
            String(err.response.data.exception.errorCode) === customErrorCode?.valueOf()
          ) {
            return err.response;
          }
        }
      }

      if (err.response?.data?.exception?.errorCode) {
        const errorCode: ErrorType = err.response.data.exception.errorCode;
        const errorType: ErrorValueType = errorCodes[errorCode];
        const executer = errorExecuter[errorType];
        if (executer) {
          executer.callback?.();
          return err.response;
        }
      }

      if (err.response) {
        if (err.response.status === 401) {
          // 인증 오류
          /**
           * todo: return url 처리
           */
          document.location.href = import.meta.env.VITE_LOGIN_URL;
        }

        if (err.response.status === 403) {
          // 권한 오류
          error({
            title: tc(`PAGE_PROVIDER_AUTH_ERROR_TITLE`),
            description: tc(`PAGE_PROVIDER_AUTH_ERROR_DESC`),
          }).then(() => {
            document.location.href = urlToDashbaord;
          });
        }
      }

      return Promise.reject(err);
      // if (err.response && (err.response.status === 403 || err.response.status === 401)) {
      //   // 403 -> 봇 메뉴에 대한 권한이 하나도 없을 경우
      //   if (err.response.data.exception.staffRole === '0') {
      //     error({
      //       title: tc(`HTTP_PROVIDER_NO_BOT_ERROR_TITLE`),
      //       description: tc(`HTTP_PROVIDER_BOT_BUILDER_ERROR_DESC`),
      //     }).then(() => {
      //       document.location.href = import.meta.env.VITE_PARTNERS_CENTER_URL;
      //     });
      //   } else {
      //     error({
      //       title: tc(`PAGE_PROVIDER_AUTH_ERROR_TITLE`),
      //       description: tc(`PAGE_PROVIDER_AUTH_ERROR_DESC`),
      //     }).then(() => {
      //       document.location.href = urlToDashbaord;
      //     });
      //   }
      // } else {
      //   document.location.href = import.meta.env.VITE_PARTNERS_CENTER_URL;
      // }
    },
  );

  return <HttpContext.Provider value={instance}>{children}</HttpContext.Provider>;
};
