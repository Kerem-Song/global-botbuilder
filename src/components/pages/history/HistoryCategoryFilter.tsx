import { Button, Checkbox, Checkboxes } from '@components';
import { usePage } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import {
  HISTORY_CATEGORY_TYPES,
  IHistoryCondition,
  ISearchHistoryData,
  THistoryCategoryValues,
} from '@models';
import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';

export const HistoryCategoryFilter = () => {
  const [category, setCategory] = useState<THistoryCategoryValues[]>([]);
  const filteredCategory = category.reduce((a, b) => a + b, 0);

  const { t } = usePage();

  const filterBtnArr = [
    { value: HISTORY_CATEGORY_TYPES.SCENARIO, label: t(`HISTORY_SCENARIO`) },
    { value: HISTORY_CATEGORY_TYPES.INTENT, label: t(`HISTORY_UTTERANCE`) },
    { value: HISTORY_CATEGORY_TYPES.DEPLOYEMNT, label: t(`HISTORY_DEPLOYMENT`) },
    { value: HISTORY_CATEGORY_TYPES.SETTING, label: t(`HISTORY_SETTING`) },
    { value: HISTORY_CATEGORY_TYPES.ETC, label: t(`HISTORY_MY_HISTORY`) },
  ];

  const {
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<IHistoryCondition>();

  const { field: categoryField } = useController({
    name: `category`,
    control,
  });

  const { botId } = useParams();
  const {
    getHistoryListQuery,
    changeHistoryPageNumberQuery,
    invalidateGetHistoryListQuery,
  } = useHistoryClient();
  const searchData: ISearchHistoryData = { botId: botId!, category: filteredCategory };
  // console.log('@@values in category filter', getValues().category);

  const handleSetCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCategory([...category, Number(e.currentTarget.value)]);
  };
  // console.log('filteredCategory', filteredCategory);
  return (
    <div className="quickFilterWrapper">
      <span className="filterTitle">{t(`QUICK_FILTER`)}</span>
      <div className="filterBtnWrapper">
        {filterBtnArr.map((item, i) => (
          <div key={i}>
            {/* <Checkbox {...categoryField} /> */}
            <Button
              className="filterBtn"
              key={i}
              value={item.value.toString()}
              onClick={(e) => handleSetCategory(e)}
            >
              {item.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
