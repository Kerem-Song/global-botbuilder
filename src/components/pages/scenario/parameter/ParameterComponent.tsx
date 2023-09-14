import { icDeleteDefault, icPlusWhite } from '@assets';
import { Button } from '@components/general/Button';
import { Col, Row } from '@components/layout';
import { Tooltip } from '@components/navigation/Tooltip';
import { useModalOpen, usePage, useRootState, useSystemModal } from '@hooks';
import { useParameterClient } from '@hooks/client/parameterClient';
import { IDeleteParameter, IParameterList } from '@models';
import { lunaToast } from '@modules/lunaToast';
import { useState } from 'react';

import { EntityComponent } from '../entity/EntityComponent';
import { ParameterPopup } from './ParameterPopup';
import { ParameterSkeleton } from './ParameterSkeleton';

export const ParameterComponent = () => {
  const [isParameterList, setIsParameterList] = useState<IParameterList>();
  const { t, tc } = usePage();
  const { getParameterListQuery, parameterDeleteAsync } = useParameterClient();
  const { data: parameterList, isFetching } = getParameterListQuery();
  const { confirm } = useSystemModal();
  const token = useRootState((state) => state.botInfoReducer.token);
  const { isOpen, handleIsOpen } = useModalOpen();

  const openDeleteParameterModal = async (deleteParameterId: string) => {
    const getUsingParameterIds =
      parameterList?.result.filter((x) => x.using).map((x) => x.id) || [];
    const confirmDesc = (
      <p style={{ whiteSpace: 'pre-line' }}>
        {getUsingParameterIds.includes(deleteParameterId)
          ? t('DELETE_USING_VARIABLE_MESSAGE')
          : t('DELETE_VARIABLE_MESSAGE')}
      </p>
    );

    const deleteParameterConfirm = await confirm({
      title: t('DELETE_VARIABLE'),
      description: confirmDesc,
    });

    if (deleteParameterConfirm) {
      const deleteParameter: IDeleteParameter = {
        sessionToken: token!,
        parameterId: deleteParameterId,
      };

      const res = await parameterDeleteAsync(deleteParameter);
      if (res && res.isSuccess) {
        lunaToast.success(tc('DELETE_MESSAGE'));
      }
    }
  };

  const handleId = (item?: IParameterList) => {
    if (item) {
      setIsParameterList(item);
    } else {
      setIsParameterList(undefined);
    }
  };

  return (
    <div className="parameterTabWrapper">
      <EntityComponent />
      <div className="parameterWrapper">
        <Row justify="space-between" align="center" className="m-b-10">
          <Col>
            <span className="title">{t('VARIABLE_LIST')}</span>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={icPlusWhite}
              onClick={() => {
                handleId();
                handleIsOpen(true);
              }}
            >
              <span>{t('ADD_VARIABLE')}</span>
            </Button>
          </Col>
        </Row>
        <div className="parameterListWrapper">
          <div className="parameterList">
            <div className="parameterListHeader">
              <span className="parameterName">{t('NAME')}</span>
            </div>
            <div className="parameterListItems">
              {isFetching && <ParameterSkeleton />}
              {!isFetching && parameterList && parameterList.result.length > 0
                ? parameterList?.result.map((item, i) => (
                    <div
                      key={i}
                      role="presentation"
                      className="parameterItem"
                      onDoubleClick={() => {
                        handleId(item);
                        handleIsOpen(true);
                      }}
                    >
                      <div className="parameterInfo">
                        {item.name.length > 14 ? (
                          <Tooltip tooltip={item.name}>
                            <span className="parameterName">{item.name}</span>
                          </Tooltip>
                        ) : (
                          <span className="parameterName">{item.name}</span>
                        )}
                      </div>
                      <button
                        className="deleteBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteParameterModal(item.id);
                        }}
                      >
                        <img src={icDeleteDefault} alt="delete" />
                      </button>
                    </div>
                  ))
                : !isFetching &&
                  parameterList!.result.length === 0 && (
                    <div className="emptyParameterList">
                      <span className="emptyParameter">
                        {t('NO_REGISTERED_VARIABLE')}
                      </span>
                    </div>
                  )}
            </div>
          </div>
        </div>
        <ParameterPopup
          isOpen={isOpen}
          handleIsOpen={handleIsOpen}
          parameterList={isParameterList}
        />
      </div>
    </div>
  );
};
