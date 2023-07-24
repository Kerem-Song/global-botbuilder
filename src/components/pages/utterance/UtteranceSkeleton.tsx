import { Col, Row } from '@components';
import { util } from '@modules/util';
import classNames from 'classnames';
import { FC } from 'react';
import ReactLoadingSkeleton from 'react-loading-skeleton';

export interface IUtteranceSkeletonProps {
  isOpenUtterancePopup: boolean;
}

export const UtteranceSkeleton: FC<IUtteranceSkeletonProps> = ({
  isOpenUtterancePopup,
}) => {
  const showScenarioList = !isOpenUtterancePopup;
  return (
    <>
      {util.range(5).map((n) => (
        <tr className="utteranceTbodyTr utteranceTbodyTrSkeleton " key={n}>
          <td
            role="presentation"
            className={classNames('utteranceList intent', {
              'hidden-scenarioList': !showScenarioList,
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
          {showScenarioList ? (
            <td role="presentation" className="utteranceList connectScenarios">
              <ReactLoadingSkeleton
                count={1}
                height={16}
                width={`${util.random(70)}%`}
                baseColor="rgba(0,0,0,0.06)"
                style={{ lineHeight: 2 }}
              />
            </td>
          ) : null}
          <td
            role="presentation"
            className={classNames('utteranceList utteranceItemsSkeleton', {
              'hidden-scenarioList-utteranceItemsSkeleton': !showScenarioList,
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
          <td className="utteranceList icon" />
        </tr>
      ))}
    </>
  );
};
