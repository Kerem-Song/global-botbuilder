import { Tooltip } from '@components/navigation/Tooltip';
import { useI18n } from '@hooks';
import { util } from '@modules/util';
import { FC } from 'react';

export interface DisplayDateProps {
  date: Date;
}

export const DisplayDate: FC<DisplayDateProps> = ({ date }) => {
  const { tc } = useI18n();
  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  ) {
    return (
      <>
        <Tooltip tooltip={util.toLocaleDateString(date)}>{tc('LBL_TODAY')}</Tooltip>
      </>
    );
  }
  return <>{date.toLocaleDateString()}</>;
};
