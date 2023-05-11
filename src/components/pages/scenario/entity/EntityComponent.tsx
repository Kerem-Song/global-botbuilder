import { Button } from '@components';
import { useModalOpen, usePage } from '@hooks';
import { useState } from 'react';

import { EntityDetailPopup } from './EntityDetailPopup';
import { ManageEntityPopup } from './ManageEntityPopup';

export const EntityComponent = () => {
  const { t } = usePage();
  const { isOpen, handleIsOpen } = useModalOpen();
  const { isOpen: isOpenEntityDetailPopup, handleIsOpen: handleIsOpenEntityDetailPopup } =
    useModalOpen();
  const [entryId, setEntryId] = useState<string>('');

  return (
    <>
      <div className="settingEntityBtn">
        <Button type="lineBlue" onClick={() => handleIsOpen(true)}>
          {t('SETTING_ENTITY')}
        </Button>
      </div>
      <ManageEntityPopup
        isOpen={isOpen}
        handleIsOpen={handleIsOpen}
        setEntryId={setEntryId}
        handleIsOpenEntityDetailPopup={handleIsOpenEntityDetailPopup}
      />
      {isOpenEntityDetailPopup && (
        <EntityDetailPopup
          handleIsOpen={handleIsOpen}
          isOpenEntityDetailPopup={isOpenEntityDetailPopup}
          handleIsOpenEntityDetailPopup={handleIsOpenEntityDetailPopup}
          entryId={entryId}
          setEntryId={setEntryId}
        />
      )}
    </>
  );
};
