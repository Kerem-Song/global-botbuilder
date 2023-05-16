import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { useI18n, usePage, useUtteranceClient } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IReactSelect, ISearchData } from '@models';
import { FC, useEffect, useState } from 'react';
import Select from 'react-select';

import { reactSelectStyle } from '../scenario/edit/ButtonCtrlSelector';

export interface IToSearchProps {
  searchData: ISearchData;
  setSearchData: (data: ISearchData) => void;
}

export const ToSearch: FC<IToSearchProps> = ({ setSearchData }) => {
  const { t } = usePage();
  const SORT = [
    { value: '1', label: t('SORT_RECENT') },
    { value: '2', label: t('SORT_INTENT_NAME') },
    { value: '3', label: t('SORT_SCENARIO_NAME') },
  ];
  const { i18n } = useI18n();
  const language = i18n.language;
  const [sort, setSort] = useState<string | undefined>('1');
  const [scenario, setScenario] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [totalScenarioList, setTotalScenarioList] = useState<IReactSelect[]>();
  const { invalidateIntentQuery } = useUtteranceClient();
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();

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
    handleSearchBtn(keyword);
  };

  useEffect(() => {
    const scenarioList = data
      ?.filter((item) => !item.isFallbackFlow)
      .map((x) => {
        return { value: x.id, label: x.alias };
      })
      .concat({ value: 'noflowid', label: t('NO_SCENARIO_SELECTED') });

    const total = [
      { value: 'all', label: t('ALL') },
      ...(scenarioList ? scenarioList : []),
    ];

    setTotalScenarioList(total);
  }, [data, language]);

  return (
    <Card className="toSearchCard" radius="normal">
      <form>
        <Space direction="vertical">
          <p className="cardTitle">{t('TO_SEARCH')}</p>
          <Row align="center" gap={10}>
            <Col>
              <span>{t('SORT')}</span>
            </Col>
            <Col>
              <div className="selectBox">
                <Select
                  isSearchable={false}
                  options={SORT}
                  styles={reactSelectStyle}
                  value={SORT.find((x) => x.value === sort)}
                  onChange={(e: any) => {
                    setSort(e?.value);
                  }}
                />
              </div>
            </Col>
            <Col>
              <span>{t('SCENARIOS')}</span>
            </Col>
            <Col>
              <div className="selectBox">
                <Select
                  options={totalScenarioList}
                  styles={reactSelectStyle}
                  placeholder={t('ALL')}
                  value={totalScenarioList?.find((x) => x.value === scenario) || null}
                  onChange={(e: any) => {
                    setScenario(e?.value);
                  }}
                />
              </div>
            </Col>
            <Col>
              <span>{t('SEARCH_WORD')}</span>
            </Col>
            <Col flex="auto">
              <FormItem>
                <Input
                  search
                  value={searchKeyword}
                  onSearch={(value) => handleSearch(value!)}
                  onChange={(e) => setSearchKeyword(e?.target.value)}
                  placeholder={t('SEARCH_INTENT_PLACEHOLDER')}
                />
              </FormItem>
            </Col>
          </Row>
          <Row justify="flex-end">
            <Col>
              <Space>
                <Button onClick={handleReset}>{t('RESET')}</Button>
                <Button type="primary" onClick={() => handleSearchBtn(searchKeyword)}>
                  {t('SEARCH')}
                </Button>
              </Space>
            </Col>
          </Row>
        </Space>
      </form>
    </Card>
  );
};
