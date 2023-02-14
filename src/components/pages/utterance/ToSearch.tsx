import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { useScenarioClient } from '@hooks';
import { ISearchData } from '@models';
import { FC, useEffect, useState } from 'react';
import Select from 'react-select';

export interface IToSearchProps {
  searchData: ISearchData;
  setSearchData: (data: ISearchData) => void;
}

const SORT = [
  { value: '1', label: 'Recent' },
  { value: '2', label: 'Intent name' },
  { value: '3', label: 'Scenario name' },
];

export const ToSearch: FC<IToSearchProps> = ({ searchData, setSearchData }) => {
  const [sort, setSort] = useState<string | undefined>('1');
  const [scenario, setScenario] = useState<string | undefined>(undefined);
  const [searchWord, setSearchWord] = useState<string | undefined>('');

  const { getScenarioList } = useScenarioClient();
  const { data } = getScenarioList();

  const scenarioList = data?.map((x) => {
    return { value: x.id, label: x.alias };
  });

  const handleReset = () => {
    setSearchData({
      sort: 1,
    });
    setScenario(undefined);
    setSearchWord('');
  };

  useEffect(() => {
    setSort(String(searchData.sort));
    setScenario(searchData.scenarios);
    setSearchWord(searchData.searchWord);
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
                options={scenarioList}
                placeholder="시나리오 미선택"
                value={scenarioList?.find((x) => x.value === scenario)}
                onChange={(e) => {
                  setScenario(e?.value);
                }}
              />
            </Col>
            <Col>
              <span>Search word</span>
            </Col>
            <Col flex="auto">
              <FormItem>
                <Input
                  search
                  placeholder="Please enter a search word"
                  onSearch={(e) => setSearchWord(e)}
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
                  onClick={() =>
                    setSearchData({
                      sort: Number(sort),
                      scenarios: scenario,
                      searchWord: searchWord,
                    })
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
