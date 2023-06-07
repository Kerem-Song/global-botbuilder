import { icError, icSuccess } from '@assets';
import React from 'react';
import { toast } from 'react-toastify';

export const lunaToast = {
  success: (message?: string) => {
    if (message) {
      toast.success(message, {
        position: 'bottom-center',
        icon: () => React.createElement('img', { src: icSuccess, alt: 'success' }),
        theme: 'dark',
        hideProgressBar: true,
        className: 'luna-toast',
        bodyClassName: 'luna-toast-body',
        autoClose: 1000,
      });
    }
  },
  error: (message: string) => {
    toast.error(message, {
      position: 'bottom-center',
      icon: () => React.createElement('img', { src: icError, alt: 'success' }),
      theme: 'dark',
      hideProgressBar: true,
      className: 'luna-toast',
      bodyClassName: 'luna-toast-body',
      autoClose: 1000,
    });
  },
  info: (message: string) => {
    toast.info(message, {
      position: 'bottom-center',
      icon: false,
      //icon: () => React.createElement('img', { src: icSuccess, alt: 'success' }),
      theme: 'dark',
      hideProgressBar: true,
      className: 'luna-toast',
      bodyClassName: 'luna-toast-body',
      autoClose: 1000,
    });
  },
};
