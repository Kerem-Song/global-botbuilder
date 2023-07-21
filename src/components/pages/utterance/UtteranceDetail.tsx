import { icPopupClose } from '@assets';
import { Button, Divider } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useI18n, usePage, useRootState, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { usePrompt } from '@hooks/usePrompt';
import { IDeleteIntent, ISaveIntent, IUtteranceItem, IUtteranceModel } from '@models';
import { BOTNAME_REGEX } from '@modules';
import classNames from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import * as yup from 'yup';

import { lunaToast } from '../../../../src/modules/lunaToast';
import { AddUtterance } from './AddUtterance';
import { UtteranceDetailItems } from './UtteranceDetailItems';
import { UtteranceIntentInfo } from './UtteranceIntentInfo';

export interface IUtteranceDetailProps {
  intentId?: string;
  isOpenUtteranceDetailPopup?: boolean;
  handleIsOpenUtterancePopup?: (value: boolean) => void;
  handleClose?: () => void;
}

export const UtteranceDetail: FC<IUtteranceDetailProps> = ({
  intentId,
  isOpenUtteranceDetailPopup,
  handleIsOpenUtterancePopup,
  handleClose,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const { navigate, tc } = usePage();
  const { t } = useI18n('utternaceDetailPage');
  const { botId } = useParams();
  const {
    intentAsync,
    getIntentDetailQuery,
    intentDeleteAsync,
    checkIntentDuplicationAsync,
    removeUtteranceQueries,
  } = useUtteranceClient();
  const hasIntentId = getIntentDetailQuery(intentId);
  const token = useRootState((state) => state.botInfoReducer.token);
  const intentNameRef = useRef<HTMLInputElement | null>(null);
  const utteranceRef = useRef<HTMLInputElement>(null);
  const { confirm, error } = useSystemModal();
  const selectedScenarios = useRootState(
    (state) => state.botBuilderReducer.selectedScenario,
  );

  usePrompt(isActive);

  const schema = yup.object({
    name: yup
      .string()
      .trim()
      .required(t('VALIDATION_REQUIRED'))
      .matches(BOTNAME_REGEX, {
        message: tc('BOTNAME_REGEX_MESSAGE'),
      }),
  });

  const defaultValues = {
    name: '',
    connectScenarioId: '',
    items: [],
  };

  const formMethods = useForm<IUtteranceModel>({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { reset, handleSubmit, control, getValues } = formMethods;

  const { fields, remove, prepend } = useFieldArray({
    control,
    name: 'items',
    keyName: 'keyName',
  });

  useEffect(() => {
    if (hasIntentId && hasIntentId.data) {
      const resetValue = {
        name: hasIntentId.data.result.intentName,
        intentId: hasIntentId.data.result.intentId,
        connectScenarioId: hasIntentId.data.result.flowId,
        connectScenarioName: hasIntentId.data.result.flowName,
      };
      reset(resetValue);

      prepend(
        hasIntentId.data.result.utterances?.map<IUtteranceItem>((x) => {
          return { text: x.text, id: x.id };
        }) || [],
      );
    }
  }, [hasIntentId?.data]);

  const handleListBtn = () => {
    if (isOpenUtteranceDetailPopup && handleClose) {
      handleClose();
      removeUtteranceQueries();
    } else {
      navigate(`/${botId}/utterance`);
      removeUtteranceQueries();
    }
  };

  const handleDeleteIntentBtn = async () => {
    if (isActive) {
      setIsActive(false);
    }

    const result = await confirm({
      title: t('DELETE_INTENT'),
      description: <p style={{ whiteSpace: 'pre-wrap' }}>{t('DELETE_INTENT_MESSAGE')}</p>,
    });

    if (result) {
      const deleteIntent: IDeleteIntent = {
        sessionToken: token,
        intentId: intentId,
      };

      const res = await intentDeleteAsync(deleteIntent);

      if (res && res.isSuccess) {
        lunaToast.success(tc('DELETE_MESSAGE'));
        if (isOpenUtteranceDetailPopup && handleClose) {
          handleClose();
        } else {
          navigate(`/${botId}/utterance`);
        }
      }
    }
  };

  const handleSave = async (itemData: IUtteranceModel): Promise<void> => {
    const saveIntent: ISaveIntent = {
      sessionToken: token,
      intentId: itemData.intentId,
      intentName: itemData.name,
      utterances: itemData.items.map((x) => {
        return x.text;
      }),
      flowId: selectedScenarios
        ? selectedScenarios.id
        : itemData.connectScenarioId || null,
    };

    const res = await intentAsync({ ...saveIntent, customErrorCode: [7612] });

    if (res === 7612) {
      const checkIntentDuplication = await checkIntentDuplicationAsync({
        name: getValues('name'),
        intentId: getValues('intentId'),
      });

      if (checkIntentDuplication.result && intentNameRef.current) {
        intentNameRef.current.select();
        await error({
          title: t('DUPLICATE_INTENT'),
          description: <span>{t('DUPLICATE_INTENT_MESSAGE')}</span>,
        });
      }
    } else {
      lunaToast.success(tc('SAVE_MESSAGE'));
      setIsActive(false);

      return;
    }
  };

  const handleCloseDetailPopup = async () => {
    if (!handleClose) {
      return;
    }

    if (isActive) {
      const res = await confirm({
        title: tc('SAVE_CONFIRM_TITLE'),
        description: (
          <p style={{ whiteSpace: 'pre-wrap' }}>{tc('SAVE_CONFIRM_MESSAGE')}</p>
        ),
      });
      if (res) {
        handleClose();
        handleIsOpenUtterancePopup!(false);
      }
    } else {
      handleClose();
      handleIsOpenUtterancePopup!(false);
    }
  };

  useEffect(() => {
    if (intentNameRef.current) {
      intentNameRef.current.focus();
    }
  }, [intentNameRef.current]);

  return (
    <>
      {isOpenUtteranceDetailPopup ? (
        <div className="detailPopupHeaderWrap" onContextMenu={(e) => e.stopPropagation()}>
          <span className="headerTitle">
            {selectedScenarios?.alias} {t('INTENT')}
          </span>
          <Button
            className="utteranceDetailClose"
            shape="ghost"
            onClick={handleCloseDetailPopup}
            icon={icPopupClose}
          />
        </div>
      ) : null}
      {isOpenUtteranceDetailPopup ? <Divider /> : null}
      <div
        className={classNames('utteranceDetailWrap', {
          'utterance-detailModalWrap': isOpenUtteranceDetailPopup,
        })}
        onContextMenu={(e) => e.stopPropagation()}
      >
        <form
          role="presentation"
          onSubmit={handleSubmit(handleSave)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
            }
          }}
        >
          <div className="detailButtons">
            {!isOpenUtteranceDetailPopup && (
              <Button onClick={handleListBtn}>{t('LIST')}</Button>
            )}
            {isOpenUtteranceDetailPopup && <p className="addIntent">{t('ADD_INTENT')}</p>}
            <div>
              <Button
                type="secondary"
                className="deleteBtn"
                onClick={handleDeleteIntentBtn}
                disabled={!getValues('intentId')}
              >
                {t('DELETE_INTENT')}
              </Button>
              <Button large type="primary" htmlType="submit" disabled={!isActive}>
                {t('SAVE')}
              </Button>
            </div>
          </div>
          <UtteranceIntentInfo
            intentNameRef={intentNameRef}
            formMethods={formMethods}
            setIsActive={setIsActive}
            isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
          />
          <AddUtterance
            utteranceRef={utteranceRef}
            formMethods={formMethods}
            prepend={prepend}
            setIsActive={setIsActive}
          />
          <UtteranceDetailItems
            utteranceRef={utteranceRef}
            formMethods={formMethods}
            fields={fields}
            remove={remove}
            setIsActive={setIsActive}
            isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
          />
        </form>
      </div>
    </>
  );
};
