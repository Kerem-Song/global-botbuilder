import { icDeleteDefault, icPlusWhite } from '@assets';
import { Button } from '@components/general/Button';
import { useModalOpen, usePage, useRootState, useSystemModal } from '@hooks';
import { useVariableClient } from '@hooks/client/variableClient';
import { IDeleteParameter, IVariableList } from '@models';
import { lunaToast } from '@modules/lunaToast';
import { useState } from 'react';

import { SettingEntity } from '../entity/SettingEntity';
import { VariablePopup } from './VariablePopup';

export const VariablesManagement = () => {
  const { t } = usePage();
  const { getVariableListQuery, variableDeleteMutateAsync } = useVariableClient();
  const { data: variableList } = getVariableListQuery();

  const { confirm } = useSystemModal();
  const token = useRootState((state) => state.botInfoReducer.token);
  const [isVariableList, setIsVariableList] = useState<IVariableList>();

  const openDeleteVariableModal = async (parameterId: string) => {
    const result = await confirm({
      title: t('DELETE_VARIABLE'),
      description: (
        <p style={{ whiteSpace: 'pre-wrap' }}>{t('DELETE_VARIABLE_MESSAGE')}</p>
      ),
    });

    if (result) {
      const deleteVariable: IDeleteParameter = {
        sessionToken: token!,
        parameterId: parameterId,
      };
      variableDeleteMutateAsync(deleteVariable, {
        onSuccess: (res) => {
          if (res && res.isSuccess) {
            lunaToast.success();
          }
        },
      });
    }
  };

  const { isOpen, handleIsOpen } = useModalOpen();

  const handleId = (item?: IVariableList) => {
    if (item) {
      setIsVariableList(item);
    } else {
      setIsVariableList(undefined);
    }
  };

  return (
    <div className="variableTabWrapper">
      <SettingEntity />
      <div className="variableWrapper">
        <div className="variableHeader">
          <span className="title">{t('VARIABLE_LIST')}</span>
          <Button
            type="primary"
            className="addVariableBtn"
            onClick={() => {
              handleId();
              handleIsOpen(true);
            }}
          >
            <img className="plusBtn" src={icPlusWhite} alt="add" />
            <span>{t('ADD_VARIABLE')}</span>
          </Button>
        </div>
        <div className="variableListWrapper">
          <div className="variableList">
            <div className="variableListHeader">
              <span className="variableName">{t('NAME')}</span>
              <span className="varibleType">{t('VARIABLE_VALUE')}</span>
            </div>
            {variableList && variableList.result.length > 0 ? (
              variableList?.result.map((item, i) => (
                <div
                  role="presentation"
                  className="variableItemList"
                  key={i}
                  onDoubleClick={() => {
                    handleId(item);
                    handleIsOpen(true);
                  }}
                >
                  <span className="variableInfo">{item.name}</span>
                  <span className="variableInfo">
                    {item.defaultValue === null || item.defaultValue === ''
                      ? '-'
                      : item.defaultValue}
                  </span>
                  <button
                    className="deleteBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteVariableModal(item.id);
                    }}
                  >
                    <img src={icDeleteDefault} alt="delete" />
                  </button>
                </div>
              ))
            ) : (
              <div className="emptyVariableList">
                <span className="emptyVariable">{t('NO_REGISTERED_VARIABLE')}</span>
              </div>
            )}
          </div>
        </div>
        <VariablePopup
          isOpen={isOpen}
          handleIsOpen={handleIsOpen}
          variableList={isVariableList}
        />
      </div>
    </div>
  );
};
