import { icDelete, icPlusWhite, icUtteranceDeleteDefault } from '@assets';
import { Button } from '@components/general/Button';
import { useModalOpen, useSystemModal } from '@hooks';
import { IScenarioVariable } from 'src/models/interfaces/IScenarioVariable';

import { SettingEntity } from './entity/SettingEntity';
import { NewVariablePopup } from './NewVariablePopup';

export const VariablesManagement = () => {
  const variableList: IScenarioVariable[] = [
    {
      name: 'name',
      type: 'phone',
    },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
    { name: 'phoneNumber', type: 'phoneNumber' },
  ];

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
            {variableList.map((item, i) => (
              <div className="variableList" key={i}>
                <span>{item.name}</span>
                <span>{item.type}</span>
                <img src={icUtteranceDeleteDefault} alt="delete"></img>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NewVariablePopup isOpen={isOpen} handleIsOpen={handleIsOpen} />
    </div>
  );
};
