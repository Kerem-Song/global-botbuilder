import { icDeleteDefault, icPlusWhite } from '@assets';
import { Button } from '@components/general/Button';
import { Col, Row } from '@components/layout';
import { Tooltip } from '@components/navigation/Tooltip';
import { useModalOpen, usePage, useRootState, useSystemModal } from '@hooks';
import { useVariableClient } from '@hooks/client/variableClient';
import { IDeleteParameter, IVariableList } from '@models';
import { lunaToast } from '@modules/lunaToast';
import { useState } from 'react';

import { EntityComponent } from '../entity/EntityComponent';
import { VariablePopup } from './VariablePopup';
import { VariableSkeleton } from './VariableSkeleton';

export const VariableComponent = () => {
  const [isVariableList, setIsVariableList] = useState<IVariableList>();
  const { t, tc } = usePage();
  const { getVariableListQuery, variableDeleteAsync } = useVariableClient();
  const { data: variableList, isFetching } = getVariableListQuery();
  const { confirm } = useSystemModal();
  const token = useRootState((state) => state.botInfoReducer.token);
  const { isOpen, handleIsOpen } = useModalOpen();

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

      const res = await variableDeleteAsync(deleteVariable);
      if (res && res.isSuccess) {
        lunaToast.success(tc('DELETE_MESSAGE'));
      }
    }
  };

  const handleId = (item?: IVariableList) => {
    if (item) {
      setIsVariableList(item);
    } else {
      setIsVariableList(undefined);
    }
  };

  return (
    <div className="variableTabWrapper">
      <EntityComponent />
      <div className="variableWrapper">
        <Row justify="space-between" align="center" className="m-b-10">
          <Col>
            <span className="title">{t('VARIABLE_LIST')}</span>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={icPlusWhite}
              className="addVariableBtn"
              onClick={() => {
                handleId();
                handleIsOpen(true);
              }}
            >
              <span>{t('ADD_VARIABLE')}</span>
            </Button>
          </Col>
        </Row>
        <div className="variableListWrapper">
          <div className="variableList">
            <div className="variableListHeader">
              <span className="variableName">{t('NAME')}</span>
            </div>
            <div className="variableListItems">
              {isFetching && <VariableSkeleton />}
              {!isFetching && variableList && variableList.result.length > 0
                ? variableList?.result.map((item, i) => (
                    <div
                      key={i}
                      role="presentation"
                      className="variableItem"
                      onDoubleClick={() => {
                        handleId(item);
                        handleIsOpen(true);
                      }}
                    >
                      <div className="variableInfo">
                        {item.name.length > 13 ? (
                          <Tooltip tooltip={item.name}>
                            <span className="variableName">{item.name}</span>
                          </Tooltip>
                        ) : (
                          <span className="variableName">{item.name}</span>
                        )}
                      </div>
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
                : !isFetching &&
                  variableList!.result.length === 0 && (
                    <div className="emptyVariableList">
                      <span className="emptyVariable">{t('NO_REGISTERED_VARIABLE')}</span>
                    </div>
                  )}
            </div>
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
