import { Button, Checkbox, Checkboxes } from '@components';
import { usePage } from '@hooks';
import { IHistoryCondition } from '@models';
import { useController, useFormContext } from 'react-hook-form';

export const HistoryCategoryFilter = () => {
  const { t } = usePage();
  const filterBtnArr = [
    { value: 'scenario', label: t(`HISTORY_SCENARIO`) },
    { value: 'utterance', label: t(`HISTORY_UTTERANCE`) },
    { value: 'depolyment', label: t(`HISTORY_DEPLOYMENT`) },
    { value: 'setting', label: t(`HISTORY_SETTING`) },
    { value: 'myhistory', label: t(`HISTORY_MY_HISTORY`) },
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

  console.log('@@values in category filter', getValues().category);
  return (
    <div className="quickFilterWrapper">
      <span className="filterTitle">{t(`QUICK_FILTER`)}</span>
      <div className="filterBtnWrapper">
        {filterBtnArr.map((item, i) => (
          <div key={i}>
            <Checkbox {...categoryField} />
            <Button
              className="filterBtn"
              key={i}
              onClick={() => setValue('category', item.value)}
            >
              {item.label}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
