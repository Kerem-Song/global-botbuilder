import { useRootState } from '@hooks/useRootState';
import { useSystemModal } from '@hooks/useSystemModal';
import { setToken } from '@store/authSlice';
import axios, { AxiosInstance } from 'axios';
import { createContext, FC } from 'react';
import { useDispatch } from 'react-redux';

import { IHasChildren } from '../../models/interfaces/IHasChildren';

const manualExceptionCode = [7604, 7636, 7608, 7633];

export const HttpContext = createContext<AxiosInstance | undefined>(undefined);

export const HttpProvider: FC<IHasChildren> = ({ children }) => {
  const { error } = useSystemModal();
  const dispatch = useDispatch();
  const token = useRootState((state) => state.authReducer.refreshToken);
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: { Authorization: token },
    //withCredentials: true,
  });
  console.log('import.meta. env', import.meta.env);

  instance.interceptors.request.use(
    function (config) {
      /**
       * todo : Authorization같은 공통 Request 처리
       */
      return config;
    },

    function (err) {
      return Promise.reject(err);
    },
  );

  instance.interceptors.response.use(
    async function (response) {
      if (response.data.newToken) {
        dispatch(setToken(response.data.newToken));
      }
      if (!response.data.isSuccess) {
        if (
          response.data.exception &&
          !manualExceptionCode.includes(response.data.exception.errorCode)
        ) {
          await error({ title: 'error', description: response.data.exception.message });
          return Promise.reject(new Error(response.data.exception.message));
        }
      }
      return response;
    },
    function (err) {
      /**
       * todo : 인증 실패 같은 공통 Exception 처리
       */
      return Promise.reject(err);
    },
  );

  return <HttpContext.Provider value={instance}>{children}</HttpContext.Provider>;
};
