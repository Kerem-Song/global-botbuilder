import { icEnter, icNoResult } from '@assets';
import { Card } from '@components/data-display';
import { Checkbox, FormItem, Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row, Space } from '@components/layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { useI18n, usePage, useRootState, useSystemModal } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import {
  IDeleteIntent,
  IReactSelect,
  ISaveIntent,
  IUtteranceItem,
  IUtteranceModel,
} from '@models';
import { BOTNAME_REGEX } from '@modules';
import { util } from '@modules/util';
import { useEffect, useRef, useState } from 'react';
import { useController, useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import Select from 'react-select';
import * as yup from 'yup';

import { lunaToast } from '../../../../src/modules/lunaToast';
import { reactSelectStyle } from '../scenario/edit/ButtonCtrlSelector';

export const UtteranceDetail = () => {
  const { i18n } = useI18n();
  const { navigate, t, tc } = usePage();
  const { utteranceId, botId } = useParams();
  const { confirm, error } = useSystemModal();
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
  const {
    intentMutate,
    getIntentDetailQuery,
    intentDeleteMutate,
    checkIntentDuplicationMutate,
    checkUtteranceDuplicationMutate,
  } = useUtteranceClient();
  const hasUtteranceId = getIntentDetailQuery(utteranceId);
  const language = i18n.language;
  const token = useRootState((state) => state.botInfoReducer.token);
  const utteranceRef = useRef<HTMLInputElement>(null);
  const intentNameRef = useRef<HTMLInputElement | null>(null);
  const [totalScenarioList, setTotalScenarioList] = useState<IReactSelect[]>();
  const [searchWord, setSearchWord] = useState<string>('');
  const [utteranceWord, setUtteranceWord] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const schema = yup.object({
    name: yup
      .string()
      .trim()
      .required(t('VALIDATION_REQUIRED'))
      .matches(BOTNAME_REGEX, {
        message: tc('BOTNAME_REGEX_MESSAGE'),
      }),
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    formState: { errors },
  } = useForm<IUtteranceModel>({
    defaultValues: {
      name: '',
      connectScenarioId: '',
      items: [],
    },
    resolver: yupResolver(schema),
  });

  const { field: nameField } = useController({
    name: `name`,
    control,
  });

  const { field: scenarioListField } = useController({
    name: `connectScenarioId`,
    control,
  });

  const { fields, remove, prepend } = useFieldArray({ control, name: 'items' });

  const filterKeyword = fields.filter((x) =>
    x.text?.trim().toLowerCase().includes(searchWord.trim().toLowerCase()),
  );

  const preventGoBack = async () => {
    const result = await confirm({
      title: t('SAVE'),
      description: (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          <p>{tc('SAVE_CONFIRM_MESSAGE')}</p>
        </div>
      ),
    });
    if (result) {
      history.go(-1);
    } else {
      history.pushState(null, '', location.href);
    }
  };

  const handleListBtn = async () => {
    if (isActive === true) {
      const result = await confirm({
        title: t('SAVE'),
        description: (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <p>{tc('SAVE_CONFIRM_MESSAGE')}</p>
          </div>
        ),
      });

      if (result) {
        navigate(`/${botId}/utterance`);
      }
    } else {
      navigate(`/${botId}/utterance`);
    }
  };

  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = '';
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
      description: (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          <p>{t('DELETE_INTENT_MESSAGE')}</p>
        </div>
      ),
    });

    if (result) {
      if (!hasUtteranceId?.data?.result.intentId) {
        return navigate(`/${botId}/utterance`);
      } else {
        const deleteIntent: IDeleteIntent = {
          sessionToken: token!,
          intentId: hasUtteranceId!.data?.result.intentId,
        };
        intentDeleteMutate.mutate(deleteIntent, {
          onSuccess: (submitResult) => {
            if (submitResult && submitResult.isSuccess) {
              lunaToast.success();
              navigate(`/${botId}/utterance`);
            }
          },
        });
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
        title: t('DUPLICATE_INTENT'),
        description: (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <span>{t('DUPLICATE_INTENT_MESSAGE_WITH_INFO')}</span>
            <span style={{ color: 'red' }}>{getValues('name')}</span>
          </div>
        ),
      });
      if (utteranceRef.current) {
        utteranceRef.current.select();
      }
      return;
    }

    checkUtteranceDuplicationMutate.mutate(
      {
        text: utteranceWord,
      },
      {
        onSuccess: (result) => {
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

    const res = await intentMutate.mutateAsync(saveIntent);

    if (res?.isSuccess) {
      lunaToast.success();
      navigate(`/${botId}/utterance`);
    } else if (res?.exception.errorCode === 7612) {
      checkIntentDuplicationMutate.mutate(
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

  useEffect(() => {
    const scenarioList = data
      ?.filter((item) => !item.isFallbackFlow)
      .map((x) => {
        return { value: x.id, label: x.alias };
      });

    const total = [
      { value: '', label: t('SELECT_SCENARIO') },
      ...(scenarioList ? scenarioList : []),
    ];

    setTotalScenarioList(total);
  }, [data, language]);

  useEffect(() => {
    if (isActive) {
      (() => {
        history.pushState(null, '', location.href);
        window.addEventListener('popstate', preventGoBack);
        window.addEventListener('beforeunload', preventClose);
      })();

      return () => {
        window.removeEventListener('popstate', preventGoBack);
        window.removeEventListener('beforeunload', preventClose);
      };
    }
  }, [isActive]);

  useEffect(() => {
    if (nameField.value === '' && intentNameRef.current) {
      intentNameRef.current.focus();
    }
  }, [nameField.value]);

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
        <Card
          radius="normal"
          bodyStyle={{ padding: '20px' }}
          style={{ border: '1px solid #DCDCDC', marginTop: '20px' }}
        >
          <Space direction="vertical">
            <p style={{ fontSize: '16px', fontWeight: 500 }}>{t('TITLE')}</p>
            <Row align="center" gap={10}>
              <Col style={{ width: '130px' }}>
                <span>{t('INTENT_NAME')}</span>
                <span style={{ color: 'red' }}> *</span>
              </Col>
              <Col flex="auto">
                <FormItem error={errors.name}>
                  <Input
                    value={nameField.value}
                    ref={(e) => {
                      nameField.ref(e);
                      intentNameRef.current = e;
                    }}
                    onChange={(e) => {
                      nameField.onChange(e);
                      setIsActive(true);
                    }}
                    placeholder={t('INPUT_INTENT_NAME')}
                    maxLength={20}
                    showCount
                  />
                </FormItem>
              </Col>
            </Row>
            <Row align="center" gap={10}>
              <Col style={{ width: '130px' }}>
                <span>{t('CONNECT_SCENARIOS')}</span>
              </Col>
              <Col flex="auto">
                <Select
                  {...scenarioListField}
                  options={totalScenarioList}
                  value={totalScenarioList?.find(
                    (item) => item.value === scenarioListField.value,
                  )}
                  onChange={(options: any) => {
                    scenarioListField.onChange(options.value);
                    setIsActive(true);
                  }}
                  styles={reactSelectStyle}
                  isSearchable={false}
                  placeholder={t('SELECT_SCENARIO')}
                />
              </Col>
            </Row>
          </Space>
        </Card>
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
