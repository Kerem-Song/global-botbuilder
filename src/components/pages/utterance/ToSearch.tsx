import { Button, Card, Col, FormItem, Input, Row, Space } from '@components';
import { useI18n, usePage, useUtteranceClient } from '@hooks';
import { useScenarioSelectClient } from '@hooks/client/scenarioSelectClient';
import { IReactSelect, ISearchData } from '@models';
import { getReactSelectStyle } from '@modules';
import { FC, useEffect, useState } from 'react';
import Select from 'react-select';

export interface IToSearchProps {
  searchData: ISearchData;
  setSearchData: (data: ISearchData) => void;
}

export const ToSearch: FC<IToSearchProps> = ({ setSearchData }) => {
  const { t } = usePage();
  const SORT: IReactSelect[] = [
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
  const { removeUtteranceQueries } = useUtteranceClient();
  const { getScenarioList } = useScenarioSelectClient();
  const { data } = getScenarioList();
  const reactSelectStyle = getReactSelectStyle<IReactSelect>({});

  const handleReset = () => {
    const searchData = {
      sort: 1,
      scenarios: 'all',
      searchWord: undefined,
    };
    setSearchData(searchData);
    removeUtteranceQueries();
    setSort('1');
    setScenario('all');
    setSearchKeyword('');
  };

  const handleSearchBtn = (keyword?: string) => {
    const searchData = {
      sort: Number(sort),
      scenarios: scenario,
      searchWord: keyword || undefined,
    };
    setSearchData(searchData);
    removeUtteranceQueries();
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
                onChange={(newOption) => {
                  setSort(newOption?.value);
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
                onChange={(newOption) => {
                  setScenario(newOption?.value || 'all');
                }}
              />
            </div>
          </Col>
          <Col>
            <span>{t('SEARCH_WORD')}</span>
          </Col>
          <Col flex="auto">
            <Input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e?.target.value)}
              placeholder={t('SEARCH_INTENT_PLACEHOLDER')}
            />
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
    </Card>
  );
};
