import { Button, Checkbox, Checkboxes } from '@components';
import { CheckboxButton } from '@components/data-entry/CheckboxButton';
import { usePage } from '@hooks';
import { useHistoryClient } from '@hooks/client/historyClient';
import {
  HISTORY_CATEGORY_TYPES,
  IHistoryCondition,
  THistoryCategoryValues,
} from '@models';
import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { useParams } from 'react-router';

export const HistoryCategoryFilter = () => {
  const { t } = usePage();

  const filterBtnArr = [
    { value: HISTORY_CATEGORY_TYPES.SCENARIO, label: t(`HISTORY_SCENARIO`) },
    { value: HISTORY_CATEGORY_TYPES.INTENT, label: t(`HISTORY_UTTERANCE`) },
    { value: HISTORY_CATEGORY_TYPES.DEPLOYEMNT, label: t(`HISTORY_DEPLOYMENT`) },
    { value: HISTORY_CATEGORY_TYPES.SETTING, label: t(`HISTORY_SETTING`) },
    { value: HISTORY_CATEGORY_TYPES.ETC, label: t(`HISTORY_MY_HISTORY`) },
  ];

  const { register } = useFormContext<IHistoryCondition>();

  return (
    <div className="quickFilterWrapper">
      <span className="filterTitle">{t(`QUICK_FILTER`)}</span>
      <div className="filterBtnWrapper">
        {filterBtnArr.map((item, i) => (
          <CheckboxButton
            {...register(`filteredCategory.${i}`, { valueAsNumber: true })}
            value={item.value.toString()}
            key={i}
          >
            <span>{item.label}</span>
          </CheckboxButton>
        ))}
      </div>
    </div>
  );
};
