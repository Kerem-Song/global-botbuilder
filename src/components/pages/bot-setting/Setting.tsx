import { icCopy, icLine } from '@assets';
import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';

export const Setting = () => {
  return (
    <div className="settingWrap">
      <div className="title">Chatbot Setting</div>
      <Card
        radius="normal"
        bodyStyle={{ padding: '20px' }}
        style={{ border: '1px solid #DCDCDC', marginBottom: '20px' }}
      >
        <form>
          <Space direction="vertical">
            <p style={{ fontSize: '16px', fontWeight: 500 }}>Default Setting</p>
            <Row align="center" gap={10}>
              <Col>
                <span>Bot name</span>
              </Col>
              <Col flex="auto">
                <FormItem>
                  <Input
                    showCount
                    maxLength={20}
                    placeholder="Please enter a search word"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row align="center" gap={10}>
              <Col style={{ width: '69px' }}>
                <span>Bot ID</span>
              </Col>
              <Col flex="auto">
                <Input disabled />
              </Col>
              <Col>
                <Button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '34px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <img src={icCopy} alt="copy"></img>
                    <p>Copy</p>
                  </div>
                </Button>
              </Col>
            </Row>
          </Space>
        </form>
      </Card>
      <Card
        radius="normal"
        bodyStyle={{ padding: '20px' }}
        style={{ border: '1px solid #DCDCDC', marginBottom: '20px' }}
      >
        <div className="activateWrap">
          <Space direction="vertical">
            <div className="activateBotHeader">
              <Row>
                <p style={{ fontSize: '16px', fontWeight: 500 }}>Activate the bot</p>
              </Row>
              <div>
                <Button type="secondary" style={{ marginRight: '8px', width: '100px' }}>
                  Deactive
                </Button>
                <Button>Bot list</Button>
              </div>
            </div>
            <div className="botCardContainer">
              <div className="botCardWrap">
                <div className="botCard">
                  <div className="channel">
                    <div className="channelImg">
                      <img
                        src={icLine}
                        alt="socialImg"
                        style={{ width: '48px', height: '48px' }}
                      />
                    </div>
                    <div className="channelInfo">
                      <p className="channelState">Operating channel</p>
                      <p className="channelName">@lunasoft</p>
                    </div>
                  </div>
                  <Button type="primary" disabled>
                    Connect
                  </Button>
                </div>
              </div>
              <div className="botCardWrap">
                <div className="botCard">
                  <div className="channel">
                    <div className="channelImg">
                      <img
                        src={icLine}
                        alt="socialImg"
                        style={{ width: '48px', height: '48px' }}
                      />
                    </div>
                    <div className="channelInfo">
                      <p className="channelState">Operating channel</p>
                      <p className="channelName">@lunasoft</p>
                    </div>
                  </div>
                  <Button type="primary" disabled>
                    Connect
                  </Button>
                </div>
              </div>
            </div>
          </Space>
        </div>
      </Card>
      <Card
        radius="normal"
        bodyStyle={{ padding: '20px' }}
        style={{ border: '1px solid #DCDCDC' }}
      >
        <div className="handleScenariosWrap">
          <Space direction="vertical">
            <p style={{ fontSize: '16px', fontWeight: 500 }}>Export/Import Scenarios</p>
            <div className="handleScenarioInfo">
              <p className="infoText">
                If you import another bot, existing set scenarios, utterances, variables,
                entities, etc. will be overwritten. Statistics and history are not
                overwritten.
              </p>
            </div>
            <div className="duplicateScenarios">
              <div className="text">
                <p>Duplicate Scenarios</p>
              </div>
              <Button type="primary" style={{ marginRight: '8px' }}>
                Export
              </Button>
              <Button type="lineBlue">Import</Button>
              <Space />
            </div>
          </Space>
        </div>
      </Card>
    </div>
  );
};
