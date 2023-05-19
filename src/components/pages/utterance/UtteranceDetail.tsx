import { icPopupClose } from '@assets';
import { Button } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePage, useRootState, useSystemModal } from '@hooks';
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
import { UtteranceGroupInfo } from './UtteranceGroupInfo';

export interface IUtteranceDetailProps {
  intentId?: string;
  isOpenUtteranceDetailPopup?: boolean;
  handleClose?: () => void;
}

export const UtteranceDetail: FC<IUtteranceDetailProps> = ({
  intentId,
  isOpenUtteranceDetailPopup,
  handleClose,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const { navigate, t, tc, setNavigateUrl } = usePage();
  const { botId } = useParams();
  const {
    intentAsync,
    getIntentDetailQuery,
    intentDeleteAsync,
    checkIntentDuplicationAsync,
  } = useUtteranceClient();
  const hasIntentId = getIntentDetailQuery(intentId);
  const token = useRootState((state) => state.botInfoReducer.token);
  const intentNameRef = useRef<HTMLInputElement | null>(null);
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

  const { reset, handleSubmit, control, getValues, watch } = formMethods;

  const { fields, remove, prepend } = useFieldArray({ control, name: 'items' });

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
    } else {
      navigate(`/${botId}/utterance`);
    }
  };

  const openDeleteIntentModal = async () => {
    const result = await confirm({
      title: t('DELETE_INTENT'),
      description: <p style={{ whiteSpace: 'pre-wrap' }}>{t('DELETE_INTENT_MESSAGE')}</p>,
    });

    if (result) {
      const deleteIntent: IDeleteIntent = {
        sessionToken: token!,
        intentId: intentId,
      };

      const res = await intentDeleteAsync(deleteIntent);

      if (res && res.isSuccess) {
        lunaToast.success();
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
      sessionToken: token!,
      intentId: itemData.intentId,
      intentName: itemData.name,
      utterances: itemData.items.map((x) => {
        return x.text;
      }),
      flowId: selectedScenarios
        ? selectedScenarios.id
        : itemData.connectScenarioId || null,
    };

    const res = await intentAsync(saveIntent);

    const handleIntentDuplication = async () => {
      const checkIntentDuplication = await checkIntentDuplicationAsync({
        name: getValues('name'),
        intentId: getValues('intentId'),
      });

      if (checkIntentDuplication.result) {
        await error({
          title: t('DUPLICATE_INTENT'),
          description: <span>{t('DUPLICATE_INTENT_MESSAGE')}</span>,
        });

        if (intentNameRef.current) {
          intentNameRef.current.select();
        }
      }
    };

    if (res && res.isSuccess) {
      lunaToast.success();

      if (isOpenUtteranceDetailPopup && handleClose) {
        handleClose();
      } else {
        setNavigateUrl(`/${botId}/utterance`);
      }
    } else if (res?.exception.errorCode === 7612) {
      await handleIntentDuplication();
    }
  };

  return (
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
          <div>
            <Button onClick={handleListBtn}>{t('LIST')}</Button>
          </div>
          <div>
            <Button
              className="deleteBtn"
              onClick={openDeleteIntentModal}
              disabled={watch('name') ? false : true}
            >
              {t('DELETE_INTENT')}
            </Button>
            <Button
              large
              type="primary"
              htmlType="submit"
              disabled={isActive ? false : true}
            >
              {t('SAVE')}
            </Button>
            {isOpenUtteranceDetailPopup && (
              <Button
                className="utteranceDetailClose"
                shape="ghost"
                onClick={handleClose}
                icon={icPopupClose}
              />
            )}
          </div>
        </div>
        <UtteranceGroupInfo
          formMethods={formMethods}
          setIsActive={setIsActive}
          isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
        />
      </form>
      <AddUtterance
        formMethods={formMethods}
        prepend={prepend}
        setIsActive={setIsActive}
      />
      <UtteranceDetailItems
        formMethods={formMethods}
        fields={fields}
        remove={remove}
        setIsActive={setIsActive}
        isOpenUtteranceDetailPopup={isOpenUtteranceDetailPopup}
      />
    </div>
  );
};
