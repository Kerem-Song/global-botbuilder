import { Button } from '@components';
import { useModalOpen, usePage } from '@hooks';

import { ManageEntityPopup } from './ManageEntityPopup';

export const SettingEntity = () => {
  const { t } = usePage();
  const { isOpen, handleIsOpen } = useModalOpen();

  return (
    <>
      <div className="addEntityBtn">
        <Button type="lineBlue" onClick={() => handleIsOpen(true)}>
          {t('SETTING_ENTITY')}
        </Button>
      </div>
      <ManageEntityPopup isOpen={isOpen} handleIsOpen={handleIsOpen} />
    </>
  );
};
