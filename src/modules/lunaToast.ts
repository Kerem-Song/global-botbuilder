import { icSuccess } from '@assets';
import React from 'react';
import { toast } from 'react-toastify';

export const lunaToast = {
  success: () => {
    toast.success('저장되었습니다.', {
      position: 'bottom-center',
      icon: () => React.createElement('img', { src: icSuccess, alt: 'success' }),
      theme: 'dark',
      hideProgressBar: true,
      className: 'luna-toast',
      bodyClassName: 'luna-toast-body',
      autoClose: 1000,
    });
  },
};
