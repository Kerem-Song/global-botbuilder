import { icEnter, icSuccess, icUtteranceEmpty } from '@assets';
import { Card } from '@components/data-display';
import { Checkbox, Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row, Space } from '@components/layout';
import { useRootState, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import {
  IInputFormModel,
  IIntentListItem,
  IPagingItems,
  ISaveIntent,
  IUtteranceModel,
} from '@models';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import Select from 'react-select';
import { toast } from 'react-toastify';

export interface IUtteranceDetailProps {
  data: IPagingItems<IIntentListItem> | undefined;
}

export const UtteranceDetail = ({ data }: IUtteranceDetailProps) => {
  // const [select, setSelect] = useState('');
  const { getIntentListQuery } = useUtteranceClient();

  const [scenario, setScenario] = useState<string | null | undefined>(null);

  const scenarios = data?.items.map((x) => {
    return { value: x.flowId, label: x.flowName };
  });

  const { intentMutate } = useUtteranceClient();

  const { confirm } = useSystemModal();

  const { register, handleSubmit, control, getValues, watch } = useForm<IUtteranceModel>({
    defaultValues: {
      items: [],
    },
  });

  const inputForm = useForm<IInputFormModel>({ defaultValues: { utterance: '' } });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  const token = useRootState((state) => state.botBuilderReducer.token);

  const navigate = useNavigate();

  const openModal = async () => {
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

  const handleAddUtternace = (data: IInputFormModel): void => {
    if (!data.utterance || !data.utterance.trim()) return;
    append({ utterance: data.utterance });
    inputForm.reset();
  };

  const handleSave = (data: IUtteranceModel): void => {
    const newIntent: ISaveIntent = {
      sessionToken: token,
      intentName: data.name,
      utterances: data.items.map((x) => x.utterance),
    };

    intentMutate.mutate(newIntent, {
      onSuccess: (submitResult) => {
        console.log(submitResult);
        const message = '저장되었습니다.';
        toast.success(message, {
          position: 'bottom-right',
          icon: () => <img src={icSuccess} alt="success" />,
          theme: 'dark',
          hideProgressBar: true,
          className: 'luna-toast',
          bodyClassName: 'luna-toast-body',
        });
        navigate(-1);
      },
    });
  };

  return (
    <div className="utteranceDetailWrap">
      <form onSubmit={handleSubmit(handleSave)}>
        <div className="detailButtons">
          <div>
            <Button
              onClick={() => {
                navigate(-1);
              }}
            >
              List
            </Button>
          </div>
          <div>
            <Button className="deleteBtn">Delete intent</Button>
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
                <Select />
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
          <Input size="small" search placeholder="Input search text" />
          <button className="icDelete" onClick={openModal} />
        </Space>
        <Row style={{ marginTop: '12px' }}>
          <>
            {fields.length > 0 ? (
              fields.map((v, i) => {
                return (
                  <div key={i} className="utteranceItem">
                    <Checkbox
                      {...register(`items.${i}.isChecked`)}
                      style={{ marginLeft: '20px' }}
                    />
                    <p className="item">{v.utterance}</p>
                  </div>
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
        {/* <Row style={{ width: '100%', marginTop: '12px' }}>
            <div className="emptyList utteranceItem">
              <div className="empty">
                <img src={icUtteranceEmpty} alt="empty" />
                <span>No search results found.</span>
              </div>
            </div>
          </Row> */}
      </div>
    </div>
  );
};
