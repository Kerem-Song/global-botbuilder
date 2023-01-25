import { icEnter, icUtteranceEmpty } from '@assets';
import { Card } from '@components/data-display';
import { Checkbox, Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row, Space } from '@components/layout';
import { useRootState } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { IDataEntryProp } from '@models';
import { removeUtteranceData, setUtteranceData } from '@store/utteranceDetailSlice';
import { ChangeEvent, FormEvent, useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

export interface UtteranceDetailProps extends IDataEntryProp {
  onPressEnter?: (value: string | undefined) => void;
}

export const UtteranceDetail = ({ onPressEnter }: UtteranceDetailProps) => {
  const { utteranceDetailMutate } = useUtteranceClient();
  const token = useRootState((state) => state.botBuilderReducer.token);
  const utteranceData = useRootState((state) => state.utteranceDetailReducer.utterance);
  const [intent, setIntent] = useState<string>('');
  const [utterance, setUtterance] = useState<string>('');

  const dispatch = useDispatch();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleIntent = (e: ChangeEvent<HTMLInputElement>): void => {
    setIntent(e.target.value);
  };

  const handleUtterance = (e: ChangeEvent<HTMLInputElement>): void => {
    setUtterance(e.target.value);
  };

  const handleDelete = (e: FormEvent<HTMLButtonElement>): void => {
    const newUtterance = { id: utteranceData.length, utterance: utterance };
    dispatch(removeUtteranceData(newUtterance.id));
    e.preventDefault();
  };

  const handleEnter = (e: FormEvent<HTMLButtonElement>): void => {
    const newUtterance = { id: utteranceData.length + 1, utterance: utterance };
    if (!utterance || !utterance.trim()) return;
    dispatch(setUtteranceData([newUtterance]));
    e.preventDefault();
    setUtterance('');
  };

  const navigate = useNavigate();
  return (
    <div className="utteranceDetailWrap">
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
          <Button large type="primary">
            Save
          </Button>
        </div>
      </div>
      <Card
        radius="normal"
        bodyStyle={{ padding: '20px' }}
        style={{ border: '1px solid #DCDCDC', marginTop: '20px' }}
      >
        <form>
          <Space direction="vertical">
            <p style={{ fontSize: '16px', fontWeight: 500 }}>Group Information</p>
            <Row align="center" gap={10}>
              <Col style={{ width: '128px' }}>
                <span>Intent Name</span>
              </Col>
              <Col flex="auto">
                <Input
                  onChange={handleIntent}
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
                <Input placeholder="Input Intent Name" />
              </Col>
            </Row>
          </Space>
        </form>
      </Card>
      <div className="utterance add">
        <form onSubmit={(e) => e.preventDefault()}>
          <Space direction="vertical">
            <p style={{ fontSize: '16px', fontWeight: 500 }}>Add Utterance</p>
            <Row>
              <Col flex="auto">
                <Input
                  value={utterance}
                  ref={inputRef}
                  onChange={handleUtterance}
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
                  onClick={handleEnter}
                >
                  <img src={icEnter} alt="enter" />
                </Button>
              </Col>
            </Row>
          </Space>
        </form>
      </div>
      <div className="utterance list">
        <form>
          <Space direction="horizontal">
            <span className="title">
              Utterance <span className="utteranceLength">{utteranceData.length}</span>
            </span>
            <Input size="small" search placeholder="Input search text" />
            <button className="icDelete" onClick={handleDelete} />
          </Space>
        </form>
        <form>
          <Row style={{ marginTop: '12px' }}>
            <>
              {utteranceData.length > 0 ? (
                utteranceData.map((v, i) => {
                  return (
                    <div key={i} className="utteranceItem">
                      <Checkbox style={{ marginLeft: '20px' }} />
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
        </form>
      </div>
    </div>
  );
};
