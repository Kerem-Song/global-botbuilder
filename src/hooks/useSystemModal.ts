import { ReactNode } from 'react';
import { useDispatch } from 'react-redux';

import { systemModalOpen } from '../store/systemModalSlice';

export interface IInfoModal {
  title: ReactNode;
  description?: ReactNode;
  afterFocusInput?: HTMLInputElement;
}

export const useSystemModal = () => {
  const dispatch = useDispatch();
  const info = (args: IInfoModal) => {
    return new Promise((resolve) => {
      dispatch(
        systemModalOpen({
          message: args.title,
          description: args.description,
          confirmButton: 'OK',
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
          confirmButton: 'OK',
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

  const confirm = (args: IInfoModal): Promise<boolean | undefined> => {
    return new Promise((resolve) => {
      dispatch(
        systemModalOpen({
          message: args.title,
          description: args.description,
          confirmButton: '확인',
          cancelButton: '취소',
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
