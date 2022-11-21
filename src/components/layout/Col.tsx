import { ComputeRange, IHasChildren, IHasClassNameNStyle } from '@models/index';
import { FC } from 'react';

export interface ColProps extends IHasChildren, IHasClassNameNStyle {
  span?: ComputeRange<24, [24]>[number];
  flex?: number | 'auto';
}
export const Col: FC<ColProps> = ({ flex, span, children }) => {
  const spanPercent = span ? (span * 100) / 24 : undefined;
  const flexValue = flex || (spanPercent ? `0 0 ${spanPercent}%` : undefined);
  const minWidth = spanPercent ? `${spanPercent}%` : undefined;
  return <div style={{ flex: flexValue, minWidth }}>{children}</div>;
};
