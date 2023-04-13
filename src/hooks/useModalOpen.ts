import { useEffect, useState } from 'react';

export const useModalOpen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const keyEvent = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };
  const handleIsOpen = (value: boolean) => {
    setIsOpen(value);
  };

  // useEffect(() => {
  //   if (isOpen) {
  //     window.addEventListener('keyup', keyEvent);
  //   } else {
  //     window.removeEventListener('keyup', keyEvent);
  //   }
  //   return () => window.removeEventListener('keyup', keyEvent);
  // }, [isOpen]);
  return { isOpen, handleIsOpen };
};
