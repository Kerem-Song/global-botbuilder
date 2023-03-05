import { icEnter, icUtteranceEmpty } from '@assets';
import { Card } from '@components/data-display';
import { Checkbox, FormItem, Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row, Space } from '@components/layout';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePage, useRootState, useScenarioClient, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import {
  IDeleteIntent,
  IInputFormModel,
  ISaveIntent,
  IUtteranceItem,
  IUtteranceModel,
} from '@models';
import { util } from '@modules/util';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import Select from 'react-select';
import * as yup from 'yup';

import { lunaToast } from '../../../../src/modules/lunaToast';
import { reactSelectStyle } from '../scenario/edit/ButtonCtrlSelector';

export const UtteranceDetail = () => {
  const { utteranceId, botId } = useParams();
  const { navigate, t, tc } = usePage();
  const token = useRootState((state) => state.botInfoReducer.token);
  const { confirm, error } = useSystemModal();
  const [searchWord, setSearchWord] = useState('');
  const [isActive, setIsActive] = useState<boolean>(false);

  const {
    intentMutate,
    getIntentDetailQuery,
    intentDeleteMutate,
    checkIntentDuplicationMutate,
    checkUtteranceDuplicationMutate,
  } = useUtteranceClient();
  const { getScenarioList } = useScenarioClient();
  const hasUtteranceId = getIntentDetailQuery(utteranceId);

  const list = getScenarioList();

  const scenarioList = list.data
    ?.filter((item) => !item.isFallbackFlow)
    .map((x) => {
      return { value: x.id, label: x.alias };
    });

  const schema = yup.object({
    name: yup.string().trim().required('필수 입력 항목입니다.'),
  });

  const {
    reset,
    register,
    handleSubmit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IUtteranceModel>({
    defaultValues: {
      items: [],
    },
    resolver: yupResolver(schema),
  });

  const { field: scenarioListField } = useController({
    name: `connectScenarioId`,
    control,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const inputForm = useForm<IInputFormModel>({ defaultValues: { utterance: '' } });

  const filterKeyword = fields.filter((x) =>
    x.text?.toLowerCase().includes(searchWord.toLowerCase()),
  );

  const preventGoBack = async () => {
    const result = await confirm({
      title: '저장하기',
      description: (
        <span>
          변경사항이 저장되지 않았습니다.
          <br />
          정말 나가시겠습니까?
        </span>
      ),
    });
    if (result) {
      history.go(-1);
    } else {
      history.pushState(null, '', location.href);
    }
  };

  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ''; // chrome에서는 설정이 필요해서 넣은 코드
    return '';
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

      append(
        hasUtteranceId.data.result.utterances?.map<IUtteranceItem>((x) => {
          return { text: x.text, id: x.id };
        }) || [],
      );
    }
  }, [hasUtteranceId?.data]);

  useEffect(() => {
    (() => {
      history.pushState(null, '', location.href);
      window.addEventListener('popstate', preventGoBack);
    })();

    return () => {
      window.removeEventListener('popstate', preventGoBack);
    };
  }, []);

  useEffect(() => {
    (() => {
      window.addEventListener('beforeunload', preventClose);
    })();

    return () => {
      window.removeEventListener('beforeunload', preventClose);
    };
  }, []);

  const openDeleteCheckboxModal = async () => {
    const deleteItems = getValues().items.filter((x) => x.isChecked);
    if (deleteItems.length === 0) {
      return;
    }
    const result = await confirm({
      title: '발화 삭제',
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
      title: '인텐트 삭제',
      description: (
        <span>
          인텐트와 인텐트에 등록되어 있는 모든 발화가 삭제됩니다.
          <br />
          삭제하시겠습니까?
        </span>
      ),
    });

    if (result) {
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
  };

  const handleAddUtternace = async (data: IInputFormModel): Promise<void> => {
    if (!data.utterance || !data.utterance.trim()) return;

    if (
      getValues('items')
        .map((x) => x.text)
        ?.includes(data.utterance)
    ) {
      await error({
        title: '중복 인텐트명',
        description: (
          <span>
            이미 있는 인텐트명입니다. <br />
            등록위치: <span style={{ color: 'red' }}>{getValues('name')}</span>
          </span>
        ),
      });

      return;
    }

    checkUtteranceDuplicationMutate.mutate(
      {
        text: inputForm.getValues('utterance'),
        // utteranceId:
      },
      {
        onSuccess: async (result) => {
          if (result.result === true) {
            await error({
              title: '중복 발화',
              description: (
                <span>
                  이미 등록된 발화입니다.
                  <br />
                  등록위치: <span style={{ color: 'red' }}>{getValues('name')}</span>
                </span>
              ),
            });
          } else {
            setIsActive(true);
            append({ text: data.utterance });
            inputForm.reset();
          }
        },
      },
    );
  };

  const handleSave = (itemData: IUtteranceModel): void => {
    if (itemData.intentId) {
      const modifyIntent: ISaveIntent = {
        sessionToken: token!,
        intentId: itemData.intentId,
        intentName: itemData.name,
        utterances: itemData.items.map((x) => {
          return x.text;
        }),
        flowId: itemData.connectScenarioId,
      };

      intentMutate.mutate(modifyIntent, {
        onSuccess: (submitResult) => {
          console.log('modifyIntent', submitResult);
          if (submitResult.isSuccess) {
            lunaToast.success();
            navigate(`/${botId}/utterance`);
          }
        },
      });
    } else {
      const newIntent: ISaveIntent = {
        sessionToken: token!,
        intentName: itemData.name,
        utterances: itemData.items.map((x) => {
          return x.text;
        }),
        flowId: itemData.connectScenarioId,
      };

      intentMutate.mutate(newIntent, {
        onSuccess: (submitResult) => {
          console.log('newIntent', submitResult);
          if (submitResult.isSuccess) {
            lunaToast.success();
            navigate(`/${botId}/utterance`);
          }
        },
      });
    }
  };

  const handleNameBlur = async () => {
    checkIntentDuplicationMutate.mutate(
      {
        name: getValues('name'),
        intentId: getValues('intentId'),
      },
      {
        onSuccess: async (result) => {
          if (result.result === true) {
            await error({
              title: '중복 인텐트명',
              description: <span>이미 있는 인텐트명입니다.</span>,
            });
          }
        },
      },
    );
  };

  return (
    <div className="utteranceDetailWrap">
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="detailButtons">
          <div>
            <Button onClick={() => navigate(`/${botId}/utterance`)}>List</Button>
          </div>
          <div>
            <Button
              className="deleteBtn"
              onClick={openDeleteIntentModal}
              disabled={watch('name') ? false : true}
            >
              Delete intent
            </Button>
            <Button
              large
              type="primary"
              htmlType="submit"
              disabled={isActive ? false : true}
            >
              Save
            </Button>
          </div>
        </div>
        <Card
          radius="normal"
          bodyStyle={{ padding: '20px' }}
          style={{ border: '1px solid #DCDCDC', marginTop: '20px' }}
        >
          <Space direction="vertical">
            <p style={{ fontSize: '16px', fontWeight: 500 }}>Group Information</p>
            <Row align="center" gap={10}>
              <Col style={{ width: '128px' }}>
                <span>Intent Name</span>
              </Col>
              <Col flex="auto">
                <FormItem error={errors.name}>
                  <Input
                    {...register('name')}
                    onChange={(e) => {
                      setValue('name', e.target.value);
                      setIsActive(true);
                    }}
                    placeholder="Input Intent Name"
                    showCount
                    maxLength={20}
                    onBlur={handleNameBlur}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row align="center" gap={10}>
              <Col>
                <span>Connect Scenarios</span>
              </Col>
              <Col flex="auto">
                <Select
                  {...scenarioListField}
                  styles={reactSelectStyle}
                  options={scenarioList}
                  value={scenarioList?.find(
                    (item) => item.value === scenarioListField.value,
                  )}
                  onChange={(options: any) => {
                    scenarioListField.onChange(options.value);
                    setIsActive(true);
                  }}
                />
              </Col>
            </Row>
          </Space>
        </Card>
      </form>
      <div className="utterance add">
        <Space direction="vertical">
          <p style={{ fontSize: '16px', fontWeight: 500 }}>Add Utterance</p>
          <form onSubmit={inputForm.handleSubmit(handleAddUtternace)}>
            <Row>
              <Col flex="auto">
                <Input
                  {...inputForm.register('utterance')}
                  placeholder="Press Enter and enter the utterance keyword."
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
                  htmlType="submit"
                  disabled={inputForm.watch('utterance') ? false : true}
                >
                  <img src={icEnter} alt="enter" />
                </Button>
              </Col>
            </Row>
          </form>
        </Space>
      </div>
      <div className="utterance list">
        <Space direction="horizontal">
          <span className="title">
            Utterance <span className="utteranceLength">{watch('items').length}</span>
          </span>
          <FormItem>
            <Input
              size="small"
              search
              placeholder="Input search text"
              onBlur={(e) => setSearchWord(e.target.value)}
              onPressEnter={(value) => setSearchWord(value!)}
            />
          </FormItem>
          <button className="icDelete" onClick={openDeleteCheckboxModal} />
        </Space>
        <Row style={{ marginTop: '12px' }}>
          <>
            {watch('items').length === 0 ? (
              <Row style={{ width: '100%', marginTop: '12px' }}>
                <Col className="emptyList utteranceItem">
                  <div className="empty">
                    <img src={icUtteranceEmpty} alt="empty" />
                    <span>No registered Utterance.</span>
                  </div>
                </Col>
              </Row>
            ) : fields.find((x) =>
                x.text?.toLowerCase().includes(searchWord.toLowerCase()),
              ) ? (
              filterKeyword.map((v, i) => {
                return (
                  <>
                    <div key={v.intentId} className="utteranceItem">
                      <Checkbox
                        {...register(`items.${i}.isChecked`)}
                        style={{ marginLeft: '20px' }}
                      />
                      <p className="item">
                        {util.replaceKeywordMark(v.text!, searchWord)}
                      </p>
                    </div>
                  </>
                );
              })
            ) : (
              <Row style={{ width: '100%', marginTop: '12px' }}>
                <div className="emptyList utteranceItem">
                  <div className="empty">
                    <img src={icUtteranceEmpty} alt="empty" />
                    <span>No search results found.</span>
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
