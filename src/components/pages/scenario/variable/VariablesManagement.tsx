import { icPlusWhite, icUtteranceDeleteDefault } from '@assets';
import { Button } from '@components/general/Button';
import { useModalOpen, useRootState, useSystemModal } from '@hooks';
import { useVariableClient } from '@hooks/client/variableClient';
import { IDeleteParameter, IVariableList } from '@models';
import { lunaToast } from '@modules/lunaToast';
import { useState } from 'react';

import { SettingEntity } from '../entity/SettingEntity';
import { NewVariablePopup } from './NewVariablePopup';

export const VariablesManagement = () => {
  const { getVariableListQuery, variableDeleteMutate } = useVariableClient();
  const { data: variableList } = getVariableListQuery();

  const { confirm } = useSystemModal();
  const token = useRootState((state) => state.botInfoReducer.token);
  const [isVariableList, setIsVariableList] = useState<IVariableList>();

  const openDeleteVariableModal = async (parameterId: string) => {
    const result = await confirm({
      title: '변수 삭제',
      description: (
        <span>
          현재 시나리오에서 사용하고 있는 변수의 경우,
          <br />
          변수 목록에서 완전히 삭제되지 않을 수 있습니다.
          <br />
          삭제하시겠습니까?
        </span>
      ),
    });

    if (result) {
      const deleteVariable: IDeleteParameter = {
        sessionToken: token!,
        parameterId: parameterId,
      };
      variableDeleteMutate.mutate(deleteVariable, {
        onSuccess: (submitResult) => {
          if (submitResult && submitResult.isSuccess) {
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
          <span className="title">Variable List</span>
          <Button
            type="primary"
            style={{ width: '84px', display: 'flex', justifyContent: 'center' }}
            onClick={() => {
              handleId();
              handleIsOpen(true);
            }}
          >
            <img src={icPlusWhite} alt="add" style={{ marginRight: '3px' }} />
            <span>variable</span>
          </Button>
        </div>
        <div className="variableListWrapper">
          <div className="variableLists">
            <div className="variableListHeader">
              <span className="variableName">Name</span>
              <span className="varibleType">Value</span>
            </div>
            {variableList && variableList.result.length > 0 ? (
              variableList?.result.map((item, i) => (
                <div
                  role="presentation"
                  className="variableList"
                  key={i}
                  onClick={() => {
                    handleId(item);
                    handleIsOpen(true);
                  }}
                >
                  <span>{item.name}</span>
                  <span>
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
                    <img src={icUtteranceDeleteDefault} alt="delete"></img>
                  </button>
                </div>
              ))
            ) : (
              <div className="emptyVariableList">
                <span>No registered Variable</span>
              </div>
            )}
          </div>
        </div>
        <NewVariablePopup
          isOpen={isOpen}
          handleIsOpen={handleIsOpen}
          variableList={isVariableList}
        />
      </div>
    </div>
  );
};
