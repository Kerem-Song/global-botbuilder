import { Button } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePage, useRootState, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { usePrompt } from '@hooks/usePrompt';
import { IDeleteIntent, ISaveIntent, IUtteranceItem, IUtteranceModel } from '@models';
import { BOTNAME_REGEX } from '@modules';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import * as yup from 'yup';

import { lunaToast } from '../../../../src/modules/lunaToast';
import { AddUtterance } from './AddUtterance';
import { UtteranceDetailItems } from './UtteranceDetailItems';
import { UtteranceGroupInfo } from './UtteranceGroupInfo';

export const UtteranceDetail = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const { navigate, t, tc } = usePage();
  const { utteranceId, botId } = useParams();
  const {
    intentAsync,
    getIntentDetailQuery,
    intentDeleteAsync,
    checkIntentDuplicationAsync,
  } = useUtteranceClient();
  const hasUtteranceId = getIntentDetailQuery(utteranceId);
  const token = useRootState((state) => state.botInfoReducer.token);
  const intentNameRef = useRef<HTMLInputElement | null>(null);
  const { confirm, error } = useSystemModal();

  // usePrompt(isActive);

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

  const handleListBtn = async () => {
    if (isActive) {
      navigate(`/${botId}/utterance`);
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
      if (!hasUtteranceId?.data?.result.intentId) {
        return navigate(`/${botId}/utterance`);
      } else {
        const deleteIntent: IDeleteIntent = {
          sessionToken: token!,
          intentId: hasUtteranceId!.data?.result.intentId,
        };

        const res = await intentDeleteAsync(deleteIntent);

        if (res && res.isSuccess) {
          lunaToast.success();
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
      flowId: itemData.connectScenarioId,
    };

    const res = await intentAsync(saveIntent);

    if (res?.isSuccess) {
      lunaToast.success();
      navigate(`/${botId}/utterance`);
    } else if (res?.exception.errorCode === 7612) {
      checkIntentDuplicationAsync(
        {
          name: getValues('name'),
          intentId: getValues('intentId'),
        },
        {
          onSuccess: async (result) => {
            if (result.result === true) {
              await error({
                title: t('DUPLICATE_INTENT'),
                description: <span>{t('DUPLICATE_INTENT_MESSAGE')}</span>,
              });
              if (intentNameRef.current) {
                intentNameRef.current.select();
              }
              return;
            }
          },
        },
      );
    }
  };

  useEffect(() => {
    if (hasUtteranceId && hasUtteranceId.data) {
      const resetValue = {
        name: hasUtteranceId.data.result.intentName,
        intentId: hasUtteranceId.data.result.intentId,
        connectScenarioId: hasUtteranceId.data.result.flowId,
        connectScenarioName: hasUtteranceId.data.result.flowName,
      };
      reset(resetValue);

      prepend(
        hasUtteranceId.data.result.utterances?.map<IUtteranceItem>((x) => {
          return { text: x.text, id: x.id };
        }) || [],
      );
    }
  }, [hasUtteranceId?.data]);

  console.log('isActive', isActive);

  return (
    <div className="utteranceDetailWrap">
      <form onSubmit={handleSubmit(handleSave)}>
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
          </div>
        </div>
        <UtteranceGroupInfo formMethods={formMethods} setIsActive={setIsActive} />
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
      />
    </div>
  );
};
