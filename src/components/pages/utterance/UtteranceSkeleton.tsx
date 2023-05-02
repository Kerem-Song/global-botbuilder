import { Col, Row } from '@components';
import { util } from '@modules/util';
import ReactLoadingSkeleton from 'react-loading-skeleton';

export const UtteranceSkeleton = () => {
  return (
    <>
      {util.range(5).map((n) => (
        <tr className="list" key={n}>
          <td role="presentation" className="utteranceList intent">
            <ReactLoadingSkeleton
              count={1}
              height={16}
              width={`${util.random(100)}%`}
              baseColor="rgba(0,0,0,0.06)"
              style={{ lineHeight: 2 }}
            />
          </td>
          <td role="presentation" className="utteranceList connectScenarios">
            <ReactLoadingSkeleton
              count={1}
              height={16}
              width={`50%`}
              baseColor="rgba(0,0,0,0.06)"
              style={{ lineHeight: 2 }}
            />
          </td>
          <td role="presentation" className="utteranceList utterance">
            <Row gap={10}>
              <Col span={util.random(8)}>
                <ReactLoadingSkeleton
                  count={1}
                  height={16}
                  baseColor="rgba(0,0,0,0.06)"
                  style={{ lineHeight: 2 }}
                />
              </Col>
              <Col span={util.random(8)}>
                <ReactLoadingSkeleton
                  count={1}
                  height={16}
                  baseColor="rgba(0,0,0,0.06)"
                  style={{ lineHeight: 2 }}
                />
              </Col>
              <Col span={util.random(8)}>
                <ReactLoadingSkeleton
                  count={1}
                  height={16}
                  baseColor="rgba(0,0,0,0.06)"
                  style={{ lineHeight: 2 }}
                />
              </Col>
            </Row>
          </td>
          <td className="utteranceList icon"></td>
        </tr>
      ))}
    </>
  );
};