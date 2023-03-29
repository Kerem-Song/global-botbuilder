import { Col, Row } from '@components/layout';
import { yupResolver } from '@hookform/resolvers/yup';
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

  const {
    getValues,
    watch,
    formState: { errors, isValid },
  } = formMethods;

  const filteredCategory = watch(`filteredCategory`)
    ?.map(Number)
    ?.reduce((a, b) => a + b, 0);

  console.log('@year value', getValues().year, 'category value', filteredCategory);
  return (
    <>
      <div className="historyMain">
        <p className="historyMainTitle">{t(`HISTORY`)}</p>
        <FormProvider {...formMethods}>
          <Row className="inquiryYear" align="center">
            <Col className="inquiryYear">{t(`INQUIRY_YEAR`)}</Col>
            <Col className="">
              <HistoryYearSelector />
            </Col>
          </Row>
          <HistoryCategoryFilter />
          <HistoryListItem category={filteredCategory} year={watch(`year`)} />
        </FormProvider>
      </div>
    </>
  );
};
