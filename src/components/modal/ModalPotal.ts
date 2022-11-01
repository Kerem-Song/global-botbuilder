import React, { FC, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IHasChildren } from 'src/models/interfaces/IHasChildren';

const modalRoot = document.querySelector('#modal') as HTMLElement;

export const ModalPortal: FC<IHasChildren> = ({ children }) => {
  const el = useRef(document.createElement('div'));

  useEffect(() => {
    const current = el.current;

    modalRoot!.appendChild(current);

    return () => void modalRoot!.removeChild(current);
  }, []);

  return createPortal(children, el.current);
};

export default ModalPortal;
