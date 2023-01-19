import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { useState } from 'react';
import Select from 'react-select';

import { UtteranceList } from './UtteranceList';

const SORT = [
  { value: 'Recent', label: 'Recent' },
  { value: 'Intent name', label: 'Intent name' },
  { value: 'Scenario name', label: 'Scenario name' },
];
const SCENARIOS = [
  { value: 'All', label: 'All' },
  { value: 'Scenario 01', label: 'Scenario 01' },
  { value: 'Scenario 02', label: 'Scenario 02' },
  { value: 'Scenario not selected', label: 'Scenario not selected' },
];

export const UtteranceComponent = () => {
  const [sort, setSort] = useState('');
  const [select, setSelect] = useState('');
  return (
    <div className="utteranceWrap">
      <div className="title">Intent Management</div>
      <Card
        radius="normal"
        bodyStyle={{ padding: '20px' }}
        style={{ border: '1px solid #DCDCDC' }}
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
                  <Select
                    options={SORT}
                    defaultInputValue={sort}
                    onChange={() => setSort}
                  />
                </FormItem>
              </Col>
              <Col>
                <span>Scenarios</span>
              </Col>
              <Col>
                <FormItem>
                  <Select
                    options={SCENARIOS}
                    defaultInputValue={select}
                    onChange={() => setSelect}
                  />
                </FormItem>
              </Col>
              <Col>
                <span>Search word</span>
              </Col>
              <Col flex="auto">
                <FormItem>
                  <Input search placeholder="Please enter a search word" />
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
      <div className="utteranceListWrap">
        <UtteranceList />
      </div>
    </div>
  );
};
