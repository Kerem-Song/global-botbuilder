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
  return { info };
};
