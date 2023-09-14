import { Col, Row } from '@components';
import { util } from '@modules/util';
import classNames from 'classnames';
import { FC } from 'react';
import ReactLoadingSkeleton from 'react-loading-skeleton';

export interface IIntentSkeletonProps {
  isOpenUtterancePopup: boolean;
}

export const IntentSkeleton: FC<IIntentSkeletonProps> = ({ isOpenUtterancePopup }) => {
  const showScenarioList = !isOpenUtterancePopup;
  return (
    <>
      {util.range(showScenarioList ? 9 : 5).map((n) => (
        <tr className="intentTbodyTr intentTbodyTrSkeleton " key={n}>
          <td
            role="presentation"
            className={classNames('intentList intent', {
              hiddenScenarioListIntent: !showScenarioList,
            })}
          >
            <ReactLoadingSkeleton
              count={1}
              height={16}
              width={`${util.random(100)}%`}
              baseColor="rgba(0,0,0,0.06)"
              style={{ lineHeight: 2 }}
            />
          </td>
          {showScenarioList && (
            <td role="presentation" className="intentList connectScenarios">
              <ReactLoadingSkeleton
                count={1}
                height={16}
                width={`${util.random(70)}%`}
                baseColor="rgba(0,0,0,0.06)"
                style={{ lineHeight: 2 }}
              />
            </td>
          )}
          <td
            role="presentation"
            className={classNames('intentList intentItemsSkeleton', {
              hiddenScenarioListIntentSkeleton: !showScenarioList,
            })}
          >
            <Row gap={10}>
              <Col span={util.random(8)}>
                <ReactLoadingSkeleton
                  count={1}
                  height={16}
                  baseColor="rgba(0,0,0,0.06)"
                  style={{ lineHeight: 2 }}
                />
              </Col>
              <Col span={util.random(6)}>
                <ReactLoadingSkeleton
                  count={1}
                  height={16}
                  baseColor="rgba(0,0,0,0.06)"
                  style={{ lineHeight: 2 }}
                />
              </Col>
              <Col span={util.random(7)}>
                <ReactLoadingSkeleton
                  count={1}
                  height={16}
                  baseColor="rgba(0,0,0,0.06)"
                  style={{ lineHeight: 2 }}
                />
              </Col>
            </Row>
          </td>
          <td className="intentList icon" />
        </tr>
      ))}
    </>
  );
};
