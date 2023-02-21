import { icEnter, icUtteranceEmpty } from '@assets';
import { Card } from '@components/data-display';
import { Checkbox, FormItem, Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row, Space } from '@components/layout';
import { usePage, useRootState, useScenarioClient, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import {
  IDeleteIntent,
  IInputFormModel,
  ISaveIntent,
  IUtteranceItem,
  IUtteranceModel,
} from '@models';
import { useEffect, useState } from 'react';
import { useController, useFieldArray, useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import Select from 'react-select';

import { lunaToast } from '../../../../src/modules/lunaToast';
import { reactSelectStyle } from '../scenario/edit/ButtonCtrlSelector';

export const UtteranceDetail = () => {
  const { utteranceId, botId } = useParams();
  const { navigate, t, tc } = usePage();
  const token = useRootState((state) => state.botInfoReducer.token);
  const { confirm } = useSystemModal();
  const [searchWord, setSearchWord] = useState('');
  const { intentMutate, getIntentDetailQuery, intentDeleteMutate } = useUtteranceClient();
  const { getScenarioList } = useScenarioClient();
  const hasUtteranceId = getIntentDetailQuery(utteranceId);
  const list = getScenarioList();
  const scenarioList =
    list.data &&
    list.data.map((x) => {
      return { value: x.id, label: x.alias };
    });

  const { reset, register, handleSubmit, control, getValues, watch } =
    useForm<IUtteranceModel>({
      defaultValues: {
        items: [],
      },
    });

  const { field: scenarioListField } = useController({
    name: `connectScenarioId`,
    control,
  });

  const inputForm = useForm<IInputFormModel>({ defaultValues: { utterance: '' } });
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

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

  const openDeleteCheckboxModal = async () => {
    const result = await confirm({
      title: 'Delete',
      description: (
        <span>
          There is a scenario associated with scenario 02
          <br />: Start, Scenario 01
          <br />
          Are you sure you want to delete it?
        </span>
      ),
    });

    if (result) {
      const deleteItems = getValues().items.filter((x) => x.isChecked);
      deleteItems.map((item) => {
        const index = getValues().items.indexOf(item);
        remove(index);
      });
    }
  };

  const openDeleteIntentModal = async () => {
    const result = await confirm({
      title: 'Delete',
      description: (
        <span>
          There is a scenario associated with scenario 02
          <br />: Start, Scenario 01
          <br />
          Are you sure you want to delete it?
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

  const handleAddUtternace = (data: IInputFormModel): void => {
    if (!data.utterance || !data.utterance.trim()) return;
    append({ text: data.utterance });
    inputForm.reset();
  };

  const handleSave = (itemData: IUtteranceModel): void => {
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
    }
  };

  return (
    <div className="utteranceDetailWrap">
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="detailButtons">
          <div>
            <Button onClick={() => navigate(`/${botId}/utterance`)}>List</Button>
          </div>
          <div>
            <Button className="deleteBtn" onClick={openDeleteIntentModal}>
              Delete intent
            </Button>
            <Button large type="primary" htmlType="submit">
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
                <Input
                  {...register('name')}
                  placeholder="Input Intent Name"
                  showCount
                  maxLength={20}
                />
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
                  onChange={(options: any) => scenarioListField.onChange(options.value)}
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
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onSearch={(v) => setSearchWord(v || '')}
            />
          </FormItem>
          <button className="icDelete" onClick={openDeleteCheckboxModal} />
        </Space>
        <Row style={{ marginTop: '12px' }}>
          <>
            {watch('items').length > 0 ? (
              fields
                .filter((x) => x.text?.toLowerCase().includes(searchWord.toLowerCase()))
                .map((v, i) => {
                  return (
                    <>
                      <div key={i} className="utteranceItem">
                        <Checkbox
                          {...register(`items.${i}.isChecked`)}
                          style={{ marginLeft: '20px' }}
                        />
                        <p className="item">{v.text}</p>
                      </div>
                    </>
                  );
                })
            ) : (
              <Row style={{ width: '100%', marginTop: '12px' }}>
                <div className="emptyList utteranceItem">
                  <div className="empty">
                    <img src={icUtteranceEmpty} alt="empty" />
                    <span>No registered Utterance.</span>
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
