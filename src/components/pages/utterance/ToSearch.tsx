import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { useScenarioClient, useUtteranceClient } from '@hooks';
import { ISearchData } from '@models';
import { FC, useState } from 'react';
import Select from 'react-select';

import { reactSelectStyle } from '../scenario/edit/ButtonCtrlSelector';

export interface IToSearchProps {
  searchData: ISearchData;
  setSearchData: (data: ISearchData) => void;
}

const SORT = [
  { value: '1', label: 'Recent' },
  { value: '2', label: 'Intent name' },
  { value: '3', label: 'Scenario name' },
];

export const ToSearch: FC<IToSearchProps> = ({ setSearchData }) => {
  const [sort, setSort] = useState<string | undefined>('1');
  const [scenario, setScenario] = useState<string>('all');
  const [searchWord, setSearchWord] = useState<string>('');
  const { invalidateIntentQuery } = useUtteranceClient();
  const { getScenarioList } = useScenarioClient();
  const { data } = getScenarioList();

  const scenarioList = data
    ?.filter((item) => !item.isFallbackFlow)
    .map((x) => {
      return { value: x.id, label: x.alias };
    })
    .concat({ value: 'noflowid', label: '시나리오 미선택' });

  const test = scenarioList?.splice(0, 0, { value: 'all', label: '전체' });

  console.log(scenarioList);

  const handleReset = () => {
    setSearchData({
      sort: 1,
      scenarios: 'all',
      searchWord: '',
    });
    setSort('1');
    setScenario('all');
    setSearchWord('');
  };

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
              <div style={{ minWidth: '160px' }}>
                <Select
                  options={SORT}
                  styles={reactSelectStyle}
                  value={SORT.find((x) => x.value === sort)}
                  onChange={(e: any) => {
                    setSort(e?.value);
                  }}
                  onBlur={() => {
                    const searchData = {
                      sort: Number(sort),
                      scenarios: scenario,
                    };
                    setSearchData(searchData);
                  }}
                />
              </div>
            </Col>
            <Col>
              <span>Scenarios</span>
            </Col>
            <Col>
              <div style={{ minWidth: '160px' }}>
                <Select
                  options={scenarioList}
                  styles={reactSelectStyle}
                  placeholder="전체"
                  value={scenarioList?.find((x) => x.value === scenario) || null}
                  onChange={(e: any) => {
                    setScenario(e?.value);
                  }}
                />
              </div>
            </Col>
            <Col>
              <span>Search word</span>
            </Col>
            <Col flex="auto">
              <FormItem>
                <Input
                  value={searchWord}
                  onChange={(e) => setSearchWord(e?.target.value)}
                  search
                  placeholder="Please enter a search word"
                />
              </FormItem>
            </Col>
          </Row>
          <Row justify="flex-end">
            <Col>
              <Space>
                <Button onClick={handleReset}>Reset</Button>
                <Button
                  type="primary"
                  onClick={() => {
                    const searchData = {
                      sort: Number(sort),
                      scenarios: scenario,
                      searchWord: searchWord,
                    };
                    setSearchData(searchData);
                    invalidateIntentQuery(searchData);
                  }}
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
