import { Col, Row } from '@components/layout';
import { usePage } from '@hooks';
import { IHistoryCondition } from '@models/interfaces/IHistory';
import { FormProvider, useForm } from 'react-hook-form';

import { HistoryCategoryFilter } from './HistoryCategoryFilter';
import { HistoryListItem } from './HistoryList';
import { HistoryYearSelector } from './HistoryYearSelector';

export const HistoryMain = () => {
  const { t } = usePage();

  const formMethods = useForm<IHistoryCondition>({
    mode: 'onSubmit',
  });

  const { watch } = formMethods;

  const filteredCategory = watch(`filteredCategory`)
    ?.map(Number)
    ?.reduce((a, b) => a + b, 0);

  return (
    <>
      <div className="historyMain">
        <p className="historyMainTitle">{t(`TITLE`)}</p>
        <FormProvider {...formMethods}>
          <div className="historyHeader">
            <Row className="inquiryYear" align="center">
              <Col className="inquiryYear">{t(`INQUIRY_YEAR`)}</Col>
              <Col className="">
                <HistoryYearSelector />
              </Col>
            </Row>
            <HistoryCategoryFilter />
          </div>
          <HistoryListItem category={filteredCategory} year={watch(`year`)} />
        </FormProvider>
      </div>
    </>
  );
};
