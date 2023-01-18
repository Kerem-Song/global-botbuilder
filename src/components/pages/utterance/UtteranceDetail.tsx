import { icEnter, icUtteranceEmpty } from '@assets';
import { Card } from '@components/data-display';
import { Checkbox, Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row, Space } from '@components/layout';
import { useNavigate } from 'react-router';

export const UtteranceDetail = () => {
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
                <Input placeholder="Input Intent Name" showCount maxLength={20} />
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
        <form>
          <Space direction="vertical">
            <p style={{ fontSize: '16px', fontWeight: 500 }}>Add Utterance</p>
            <Row>
              <Col flex="auto">
                <Input placeholder="Press Enter and enter the utterance keyword." />
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
            <p className="title">Utterance</p>
            <Input size="small" search placeholder="Input search text" />
            <button className="icDelete" />
          </Space>
        </form>
        <form>
          <Row style={{ marginTop: '12px' }}>
            <div className="utteranceItem">
              <Checkbox style={{ marginLeft: '20px' }} />
              <p className="item">the first screen</p>
            </div>
            <div className="utteranceItem">
              <Checkbox style={{ marginLeft: '20px' }} />
              <p className="item">the first screen</p>
            </div>
            <div className="utteranceItem">
              <Checkbox style={{ marginLeft: '20px' }} />
              <p className="item">the first screen</p>
            </div>
          </Row>
          <Row style={{ marginTop: '12px' }}>
            <div className="emptyList utteranceItem">
              <div className="empty">
                <img src={icUtteranceEmpty} alt="empty" />
                <span>No search results found.</span>
              </div>
            </div>
          </Row>
          <Row style={{ marginTop: '12px' }}>
            <div className="emptyList utteranceItem">
              <div className="empty">
                <img src={icUtteranceEmpty} alt="empty" />
                <span>No registered Utterance.</span>
              </div>
            </div>
          </Row>
        </form>
      </div>
    </div>
  );
};
