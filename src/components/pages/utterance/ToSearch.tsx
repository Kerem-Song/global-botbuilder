import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { useScenarioClient, useUtteranceClient } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IReactSelect, ISearchData } from '@models';
import { FC, useEffect, useState } from 'react';
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
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchKeywordParameter, setSearchKeywordParameter] = useState<string>();
  const [totalScenarioList, setTotalScenarioList] = useState<IReactSelect[]>();
  const { invalidateIntentQuery } = useUtteranceClient();
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();

  useEffect(() => {
    const scenarioList = data
      ?.filter((item) => !item.isFallbackFlow)
      .map((x) => {
        return { value: x.id, label: x.alias };
      })
      .concat({ value: 'noflowid', label: '시나리오 미선택' });

    const total = [
      { value: 'all', label: '전체' },
      ...(scenarioList ? scenarioList : []),
    ];

    setTotalScenarioList(total);
  }, [data]);

  const handleReset = () => {
    setSearchData({
      sort: 1,
      scenarios: 'all',
      searchWord: '',
    });
    setSort('1');
    setScenario('all');
    setSearchKeyword('');
  };

  const handleSearchBtn = (keyword?: string) => {
    const searchData = {
      sort: Number(sort),
      scenarios: scenario,
      searchWord: keyword,
    };
    setSearchData(searchData);
    invalidateIntentQuery(searchData);
  };

  const handleSearch = (keyword?: string) => {
    setSearchKeyword(keyword!);
    setSearchKeywordParameter(keyword);
    handleSearchBtn(keyword);
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
                  options={totalScenarioList}
                  styles={reactSelectStyle}
                  placeholder="전체"
                  value={totalScenarioList?.find((x) => x.value === scenario) || null}
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
                  search
                  value={searchKeyword}
                  onSearch={(value) => handleSearch(value!)}
                  onChange={(e) => setSearchKeyword(e?.target.value)}
                  placeholder="Please enter a search word"
                />
              </FormItem>
            </Col>
          </Row>
          <Row justify="flex-end">
            <Col>
              <Space>
                <Button onClick={handleReset}>Reset</Button>
                <Button type="primary" onClick={() => handleSearchBtn(searchKeyword)}>
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
