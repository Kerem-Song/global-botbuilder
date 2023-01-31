import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { IIntentListItem, IPagingItems, ISearchData } from '@models';
import { FC, useEffect, useState } from 'react';
import Select from 'react-select';

export interface IToSearchProps {
  data: IPagingItems<IIntentListItem> | undefined;
  searchData: ISearchData;
  setSearchData: (data: ISearchData) => void;
}

const SORT = [
  { value: '1', label: 'Recent' },
  { value: '2', label: 'Intent name' },
  { value: '3', label: 'Scenario name' },
];

export const ToSearch: FC<IToSearchProps> = ({ data, searchData, setSearchData }) => {
  const [sort, setSort] = useState<string | undefined>('1');
  const [scenario, setScenario] = useState<string | null | undefined>(null);
  console.log(scenario);

  const scenarios = data?.items.map((x) => {
    return { value: x.flowId, label: x.flowName };
  });

  // const TEST = { value: null, label: '시나리오 미설정' };
  // scenarios?.push(TEST);
  // console.log(scenarios);

  useEffect(() => {
    setSort(String(searchData.sort));
    setScenario(searchData.scenarios);
  }, [searchData]);

  return (
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
              <Select
                options={SORT}
                value={SORT.find((x) => x.value === sort)}
                onChange={(e) => {
                  setSort(e?.value);
                }}
              />
            </Col>
            <Col>
              <span>Scenarios</span>
            </Col>
            <Col>
              <Select
                options={scenarios}
                value={scenarios?.find((x) => x.value === scenario)}
                onChange={(e) => {
                  console.log('e', e);
                  setScenario(e && e?.value);
                }}
              />
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
                <Button onClick={() => setSearchData({ sort: 1, scenarios: null })}>
                  Reset
                </Button>
                <Button
                  type="primary"
                  onClick={() =>
                    setSearchData({ sort: Number(sort), scenarios: scenario })
                  }
                >
                  Search
                </Button>
              </Space>
            </Col>
          </Row>
        </Space>
      </form>
    </Card>
  );
};
