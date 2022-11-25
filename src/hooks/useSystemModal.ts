import { useDispatch } from 'react-redux';

import { systemModalOpen } from '../store/systemModalSlice';

export interface IInfoModal {
  title: string;
  description: string;
}

export const useSystemModal = () => {
  const dispatch = useDispatch();
  const info = (args: IInfoModal) => {
    dispatch(
      systemModalOpen({
        message: args.title,
        description: args.description,
        confirmButton: 'OK',
      }),
    );
  };

  const confirm = (args: IInfoModal): Promise<boolean | undefined> => {
    return new Promise((resolve) => {
      dispatch(
        systemModalOpen({
          message: args.title,
          description: args.description,
          confirmButton: 'Confirm',
          cancelButton: 'Cancel',
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
  return { info, confirm };
};
