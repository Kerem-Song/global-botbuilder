import { Button, Card, Col, FormItem, Input, ReactSelect, Row, Space } from '@components';
import Select from 'react-select';

export const UtteranceComponent = () => {
  return (
    <div className="utterance-wrap">
      <span className="title">Intent Management</span>
      <Card
        radius="normal"
        bodyStyle={{ padding: '20px' }}
        style={{ border: '1px sold #DCDCDC' }}
      >
        <form>
          <Space direction="vertical">
            <p style={{ fontSize: '16px', fontWeight: 500 }}>To Search</p>
            <Row align="center" gap={10}>
              <Col>
                <span>Sort</span>
              </Col>
              <Col>
                <FormItem>
                  <Select options={[]} />
                </FormItem>
              </Col>
              <Col>
                <span>Scenarios</span>
              </Col>
              <Col>
                <FormItem>
                  <Select options={[]} />
                </FormItem>
              </Col>
              <Col>
                <span>Search word</span>
              </Col>
              <Col flex="auto">
                <FormItem>
                  <Input search />
                </FormItem>
              </Col>
            </Row>
            <Row justify="flex-end">
              <Col>
                <Space>
                  <Button>Reset</Button>
                  <Button type="primary">Search</Button>
                </Space>
              </Col>
            </Row>
          </Space>
        </form>
      </Card>
    </div>
  );
};
