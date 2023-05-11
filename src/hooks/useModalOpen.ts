import { useEffect, useState } from 'react';
// import {
//   unstable_Blocker as Blocker,
//   unstable_useBlocker as useBlocker,
// } from 'react-router';

export const useModalOpen = () => {
  const [isOpen, setIsOpen] = useState(false);

  // const blocker: Blocker = useBlocker(isOpen);
  // useEffect(() => {
  //   if (blocker.state === 'blocked' && isOpen) {
  //     setIsOpen(false);
  //     blocker.reset();
  //   }
  // }, [blocker, isOpen]);

  const handleIsOpen = (value: boolean) => {
    setIsOpen(value);
  };

  return { isOpen, handleIsOpen };
};
