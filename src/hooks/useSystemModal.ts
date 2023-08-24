import { ReactNode } from 'react';
import { useDispatch } from 'react-redux';

import { systemModalOpen } from '../store/systemModalSlice';
import useI18n from './useI18n';

export interface IInfoModal {
  title: ReactNode;
  description?: ReactNode;
  afterFocusInput?: HTMLInputElement;
  isReload?: boolean;
}

export const useSystemModal = () => {
  const { tc } = useI18n();
  const dispatch = useDispatch();
  const info = (args: IInfoModal) => {
    return new Promise((resolve) => {
      dispatch(
        systemModalOpen({
          message: args.title,
          description: args.description,
          confirmButton: tc('OK'),
          callbackFunc: () => {
            resolve(true);
          },
          closeFunc: () => {
            resolve(true);
          },
        }),
      );
    });
  };

  const error = (args: IInfoModal) => {
    return new Promise((resolve) => {
      dispatch(
        systemModalOpen({
          message: args.title,
          description: args.description,
          confirmButton: tc('OK'),
          callbackFunc: () => {
            if (args.isReload === true) {
              // 봇 생성시 설정 권한 해제되었을 때 페이지 새로고침 실행
              window.location.reload();
              resolve(true);
            } else {
              resolve(true);
            }
          },
          closeFunc: () => {
            resolve(true);
          },
        }),
      );
    });
  };

  const confirm = (args: IInfoModal): Promise<boolean | undefined> => {
    return new Promise((resolve) => {
      dispatch(
        systemModalOpen({
          message: args.title,
          description: args.description,
          confirmButton: tc('OK'),
          cancelButton: tc('CANCEL'),
          callbackFunc: () => {
            resolve(true);
          },
          cancelFunc: () => {
            resolve(false);
          },
          closeFunc: () => {
            resolve(undefined);
          },
        }),
      );
    });
  };
  return { info, confirm, error };
};
