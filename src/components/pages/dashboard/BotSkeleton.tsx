import { Card, Col, Row } from '@components/index';
import Skeleton from 'react-loading-skeleton';

export const BotSkeleton = () => {
  return (
    <Card>
      <Row align="center">
        <Col>
          <Skeleton circle={true} style={{ width: '80px', height: '80px' }} />
        </Col>
        <Col flex="auto" style={{ paddingLeft: '10px' }}>
          <Skeleton count={3} />
        </Col>
      </Row>
    </Card>
  );
};
