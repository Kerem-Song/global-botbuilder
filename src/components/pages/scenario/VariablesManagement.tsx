import { Button } from '@components/general/Button';
import { IScenarioVariable } from 'src/models/interfaces/IScenarioVariable';

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

  return (
    <div className="variableTabWrapper">
      <div className="addVariableBtn">
        <Button>엔티티 관리</Button>
      </div>
      <div className="variableWrapper">
        <p>변수 목록</p>
        <div className="variableListWrapper">
          <div className="variableListHeader">
            <span className="variableName">변수명</span>
            <span className="varibleType">타입</span>
          </div>
          <div className="variableLists">
            {variableList.map((item, i) => (
              <div className="variableList" key={i}>
                <span>{item.name}</span>
                <span>{item.type}</span>
                <i className="fa-solid fa-trash-can"></i>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
