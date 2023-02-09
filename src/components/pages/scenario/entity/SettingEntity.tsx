import { Button } from '@components';
import { useModalOpen } from '@hooks';

import { ManageEntityPopup } from './ManageEntityPopup';

export const SettingEntity = () => {
  const { isOpen, handleIsOpen } = useModalOpen();

  return (
    <>
      <div className="addEntityBtn">
        <Button type="lineBlue" onClick={() => handleIsOpen(true)}>
          Setting Entity
        </Button>
      </div>
      <ManageEntityPopup isOpen={isOpen} handleIsOpen={handleIsOpen} />
    </>
  );
};
