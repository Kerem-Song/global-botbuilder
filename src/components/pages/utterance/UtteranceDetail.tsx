import { icEnter, icNoResult } from '@assets';
import { Button, Checkbox, Col, FormItem, Input, Row, Space } from '@components';
import { usePage, useRootState, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { usePrompt } from '@hooks/usePrompt';
import { IDeleteIntent, ISaveIntent, IUtteranceItem, IUtteranceModel } from '@models';
import { util } from '@modules/util';
import { useEffect, useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router';

import { lunaToast } from '../../../../src/modules/lunaToast';
import { AddIntentCard } from './AddIntentCard';

export const UtteranceDetail = () => {
  const { navigate, t, tc } = usePage();
  const { utteranceId, botId } = useParams();
  const { confirm, error } = useSystemModal();
  const {
    intentAsync,
    getIntentDetailQuery,
    intentDeleteAsync,
    checkIntentDuplicationAsync,
    checkUtteranceDuplicationAsync,
  } = useUtteranceClient();
  const hasUtteranceId = getIntentDetailQuery(utteranceId);
  const token = useRootState((state) => state.botInfoReducer.token);
  const utteranceRef = useRef<HTMLInputElement>(null);
  const intentNameRef = useRef<HTMLInputElement | null>(null);
  const [searchWord, setSearchWord] = useState<string>('');
  const [utteranceWord, setUtteranceWord] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // usePrompt(isActive);

  const { reset, register, handleSubmit, control, getValues, watch } =
    useForm<IUtteranceModel>({
      defaultValues: {
        name: '',
        connectScenarioId: '',
        items: [],
      },
    });

  const { fields, remove, prepend } = useFieldArray({ control, name: 'items' });

  const filterKeyword = fields.filter((x) =>
    x.text?.trim().toLowerCase().includes(searchWord.trim().toLowerCase()),
  );

  const handleListBtn = async () => {
    if (isActive === true) {
      navigate(`/${botId}/utterance`);
    } else {
      navigate(`/${botId}/utterance`);
    }
  };

  const openDeleteCheckboxModal = async () => {
    const deleteItems = getValues().items.filter((x) => x.isChecked);

    if (deleteItems.length === 0) {
      return;
    }
    const result = await confirm({
      title: t('DELETE_UTTERANCE'),
      description: <span>{t('DELETE_CONFIRM', { count: deleteItems.length })}</span>,
    });

    if (result) {
      deleteItems.map((item) => {
        setIsActive(true);
        const index = getValues().items.indexOf(item);
        remove(index);
      });
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

  const handleAddUtternace = () => {
    if (!utteranceWord || !utteranceWord.trim()) return;

    if (
      getValues('items')
        .map((x) => x.text)
        ?.includes(utteranceWord)
    ) {
      error({
        title: t('DUPLICATE_UTTERANCE'),
        description: (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <span>{t('DUPLICATE_UTTERANCE_MESSAGE')}</span>
            <span style={{ color: 'red' }}>{getValues('name')}</span>
          </div>
        ),
      });
      if (utteranceRef.current) {
        utteranceRef.current.select();
      }
      return;
    }

    checkUtteranceDuplicationAsync(
      {
        text: utteranceWord,
      },
      {
        onSuccess: (result) => {
          console.log('result', result);
          if (result.length > 0) {
            error({
              title: t('DUPLICATE_UTTERANCE'),
              description: (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  <span>{t('DUPLICATE_UTTERANCE_MESSAGE')}</span>
                  <span style={{ color: 'red' }}>{result[0].intentName}</span>
                </div>
              ),
            });
            if (utteranceRef.current) {
              utteranceRef.current.select();
            }
          } else {
            prepend({ text: utteranceWord });
            setIsActive(true);
            setUtteranceWord('');
            if (utteranceRef.current) {
              utteranceRef.current.focus();
            }
          }
        },
      },
    );
  };

  const handleSearch = (keyword?: string) => {
    setSearchWord(keyword!);
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
        <AddIntentCard control={control} setIsActive={setIsActive} />
      </form>
      <div className="utterance add">
        <Space direction="vertical">
          <p style={{ fontSize: '16px', fontWeight: 500 }}>{t('ADD_UTTERANCE')}</p>
          <Row>
            <Col flex="auto">
              <Input
                ref={utteranceRef}
                value={utteranceWord}
                onChange={(e) => {
                  setUtteranceWord(e.target.value);
                  setIsEditing(true);
                }}
                onPressEnter={handleAddUtternace}
                placeholder={t('ENTER_UTTERANCE')}
              />
            </Col>
            <Col style={{ marginLeft: '8px' }}>
              <Button
                type="primary"
                style={{
                  width: '64px',
                  height: '33px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => {
                  handleAddUtternace();
                }}
                disabled={utteranceWord && isEditing ? false : true}
              >
                <img src={icEnter} alt="enter" />
              </Button>
            </Col>
          </Row>
        </Space>
      </div>
      <div className="utterance list">
        <Space direction="horizontal">
          <span className="title">
            {t('UTTERANCE')}{' '}
            <span className="utteranceLength">
              {filterKeyword ? filterKeyword.length : watch('items').length}
            </span>
          </span>
          <FormItem>
            <Input
              size="small"
              search
              placeholder={t('SEARCH_UTTERANCE_PLACEHOLDER')}
              value={searchWord}
              onSearch={(value) => handleSearch(value)}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormItem>
          <Button
            shape="ghost"
            className="icDelete"
            onClick={openDeleteCheckboxModal}
            disabled={
              getValues('items') &&
              getValues().items.filter((x) => x.isChecked).length === 0
                ? true
                : false
            }
          />
        </Space>
        <Row style={{ marginTop: '12px' }}>
          <>
            {watch('items').length === 0 ? (
              <Row style={{ width: '100%', marginTop: '12px' }}>
                <Col className="emptyList utteranceItem">
                  <div className="empty">
                    <img src={icNoResult} alt="empty" />
                    <span>{t('NO_REGISTERED_UTTERANCE')}</span>
                  </div>
                </Col>
              </Row>
            ) : filterKeyword.length > 0 ? (
              filterKeyword.map((v, i) => {
                return (
                  <div key={v.id} className="utteranceItem">
                    <Checkbox
                      {...register(`items.${i}.isChecked`)}
                      style={{ marginLeft: '20px' }}
                    />
                    <p className="item">{util.replaceKeywordMark(v.text!, searchWord)}</p>
                  </div>
                );
              })
            ) : (
              <Row style={{ width: '100%', marginTop: '12px' }}>
                <div className="emptyList utteranceItem">
                  <div className="empty">
                    <img src={icNoResult} alt="empty" />
                    <span>{t('NO_SEARCH_UTTERANCE_RESULT_FOUND')}</span>
                  </div>
                </div>
              </Row>
            )}
          </>
        </Row>
      </div>
    </div>
  );
};
