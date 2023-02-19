import { icPlusWhite, icUtteranceDeleteDefault } from '@assets';
import { Button } from '@components/general/Button';
import { useModalOpen, useRootState, useSystemModal } from '@hooks';
import { useVariableClient } from '@hooks/client/variableClient';
import { IDeleteParameter } from '@models';
import { lunaToast } from '@modules/lunaToast';

import { SettingEntity } from '../entity/SettingEntity';
import { NewVariablePopup } from './NewVariablePopup';

export const VariablesManagement = () => {
  const { getVariableListQuery, variableDeleteMutate } = useVariableClient();
  const { data: variableList } = getVariableListQuery();
  const { confirm } = useSystemModal();
  const token = useRootState((state) => state.botInfoReducer.token);

  const openDeleteVariableModal = async (parameterId: string) => {
    const result = await confirm({
      title: 'Delete',
      description: (
        <span>
          There is a scenario associated with scenario 02
          <br />: Start, Scenario 01
          <br />
          Are you sure you want to delete it?
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

  return (
    <div className="variableTabWrapper">
      <SettingEntity />
      <div className="variableWrapper">
        <div className="variableHeader">
          <span className="title">Variable List</span>
          <Button
            type="primary"
            style={{ width: '84px', display: 'flex', justifyContent: 'center' }}
            onClick={() => handleIsOpen(true)}
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
                <div className="variableList" key={i}>
                  <span>{item.name}</span>
                  <span>{item.defaultValue === null ? '-' : item.defaultValue}</span>
                  <button
                    className="deleteBtn"
                    onClick={() => openDeleteVariableModal(item.id)}
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
      </div>
      <NewVariablePopup isOpen={isOpen} handleIsOpen={handleIsOpen} />
    </div>
  );
};
