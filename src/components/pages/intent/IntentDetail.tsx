import { icPopupClose, icPrev } from '@assets';
import { Button, Divider } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useI18n, usePage, useRootState, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { usePrompt } from '@hooks/usePrompt';
import { IDeleteIntent, ISaveIntent, IUtteranceItem, IUtteranceModel } from '@models';
import { BOTNAME_REGEX } from '@modules';
import classNames from 'classnames';
import { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import * as yup from 'yup';

import { lunaToast } from '../../../modules/lunaToast';
import { AddUtterance } from './AddUtterance';
import { IntentInfo } from './IntentInfo';
import { UtteranceDetailItems } from './UtteranceDetailItems';

export interface IIntentDetailProps {
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  intentId?: string;
  isOpenUtteranceDetailPopup?: boolean;
  handleIsOpenUtterancePopup?: (value: boolean) => void;
  handleClose?: () => void;
  handleSetIntentId?: (intentId: string) => void;
  handleCloseUtteranceDetailPopup?: () => void;
}

export const IntentDetail: FC<IIntentDetailProps> = ({
  isActive,
  setIsActive,
  intentId,
  isOpenUtteranceDetailPopup,
  handleIsOpenUtterancePopup,
  handleClose,
  handleSetIntentId,
  handleCloseUtteranceDetailPopup,
}) => {
  const { navigate, tc } = usePage();
  const { t } = useI18n('intentDetailPage');
  const { botId } = useParams();
  const {
    intentSaveAsync,
    getIntentDetailQuery,
    intentDeleteAsync,
    checkIntentDuplicationAsync,
    removeUtteranceQueries,
  } = useUtteranceClient();
  const hasIntentId = getIntentDetailQuery(intentId);
  const token = useRootState((state) => state.botInfoReducer.token);
  const intentNameRef = useRef<HTMLInputElement | null>(null);
  const utteranceRef = useRef<HTMLInputElement>(null);
  const { info, confirm, error } = useSystemModal();
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

  const handleListBtn = async () => {
    if (isOpenUtteranceDetailPopup) {
      if (isActive) {
        const saveConfirm = await confirm({
          title: tc('SAVE_CONFIRM_TITLE'),
          description: (
            <p style={{ whiteSpace: 'pre-line' }}>{tc('SAVE_CONFIRM_MESSAGE')}</p>
          ),
        });
        if (!saveConfirm) {
          return;
        }
      }
      handleIsOpenUtterancePopup?.(true);
    } else {
      navigate(`/${botId}/intent`);
    }
    handleCloseUtteranceDetailPopup?.();
    removeUtteranceQueries();
  };

  const handleDeleteIntentBtn = async () => {
    const deleteIntentConfirm = await confirm({
      title: t('DELETE_INTENT'),
      description: <p style={{ whiteSpace: 'pre-line' }}>{t('DELETE_INTENT_MESSAGE')}</p>,
    });

    const deleteIntent: IDeleteIntent = {
      sessionToken: token,
      intentId: intentId,
    };

    const handleIntentDelete = async () => {
      const deletionResult = await intentDeleteAsync(deleteIntent);
      if (deletionResult && deletionResult.isSuccess) {
        lunaToast.success(tc('DELETE_MESSAGE'));
        handleCloseUtteranceDetailPopup?.();
        if (isOpenUtteranceDetailPopup) {
          handleIsOpenUtterancePopup?.(true);
        } else {
          navigate(`/${botId}/intent`);
        }
      }
    };

    if (isActive) {
      setIsActive(false);
      if (deleteIntentConfirm) {
        handleIntentDelete();
      } else {
        setIsActive(true);
      }
    } else {
      if (deleteIntentConfirm) {
        handleIntentDelete();
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

    const res = await intentSaveAsync({ ...saveIntent, customErrorCode: [7612] });

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
      setIsActive(false);

      if (!itemData.intentId) {
        await info({
          title: t('SAVE_NEW_INTENT'),
          description: t('SAVE_NEW_INTENT_DESC'),
        });
        if (isOpenUtteranceDetailPopup) {
          handleSetIntentId?.(res as string);
        } else {
          navigate(`/${botId}/intent/detail/${res}`);
        }
      } else {
        lunaToast.success(tc('SAVE_MESSAGE'));
      }
      return;
    }
  };

  const handleCloseDetailPopup = async () => {
    if (isActive) {
      const res = await confirm({
        title: tc('SAVE_CONFIRM_TITLE'),
        description: (
          <p style={{ whiteSpace: 'pre-line' }}>{tc('SAVE_CONFIRM_MESSAGE')}</p>
        ),
      });
      if (res) {
        handleClose?.();
        handleIsOpenUtterancePopup?.(false);
      }
    } else {
      handleClose?.();
      handleIsOpenUtterancePopup?.(false);
    }
  };

  useEffect(() => {
    if (intentNameRef.current) {
      intentNameRef.current.focus();
    }
  }, [intentNameRef.current]);

  return (
    <>
      {isOpenUtteranceDetailPopup && (
        <div
          className="intentDetailPopupHeader"
          onContextMenu={(e) => e.stopPropagation()}
        >
          <div className="intentDetailListTitle">
            <div className="listBtn">
              <Button icon={icPrev} onClick={handleListBtn}>
                {t('INTENT_LIST')}
              </Button>
            </div>
            <span className="headerTitle">
              {selectedScenarios?.alias}{' '}
              {hasIntentId.data?.result.intentId ? t('INTENT_DETAIL') : t('INTENT')}
            </span>
          </div>
          <Button
            className="intentDetailPopupClose"
            shape="ghost"
            onClick={handleCloseDetailPopup}
            icon={icPopupClose}
          />
        </div>
      )}
      {isOpenUtteranceDetailPopup && <Divider />}
      <div
        className={classNames('intentDetailWrap', {
          intentDetailPopupWrap: isOpenUtteranceDetailPopup,
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
          <div className="intentDetailButtons">
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
          <IntentInfo
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
            intentId={intentId}
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
