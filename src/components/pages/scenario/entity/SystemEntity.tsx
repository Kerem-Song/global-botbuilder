import { icUtteranceEmpty } from '@assets';
import { Card, Col, Input, Row, Title } from '@components';
import { useEntityClient } from '@hooks/client/entityClient';
import { IPagingItems, IResponseEntryItems } from '@models';
import { util } from '@modules/util';
import { InfiniteData } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

export const SystemEntity = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>();
  const [ref, inView] = useInView();
  const { changePageNumberQuery } = useEntityClient();
  const { data: initialData, fetchNextPage } = changePageNumberQuery(searchKeyword, true);

  const isExistInitialData = (
    data: InfiniteData<IPagingItems<IResponseEntryItems>> | undefined,
  ): boolean => {
    if (data?.pages && data?.pages?.reduce((acc, cur) => acc + cur.totalPage, 0) > 0) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <div className="entitiesTitle">
        <Title level={2}>Manage system entities</Title>
      </div>
      <div className="entity">
        <div></div>
        <Input
          size="small"
          search
          placeholder="Input search word"
          onBlur={(e) => setSearchKeyword(e.target.value)}
          onPressEnter={(value) => setSearchKeyword(value)}
        ></Input>
      </div>
      <div className="entityWrapper">
        <Row gap={12}>
          {isExistInitialData(initialData) ? (
            initialData?.pages.map((v) => {
              const pages = v.items;
              return pages.map((x, i) => {
                return (
                  <Col key={i} span={6}>
                    <div className="entityCard" role="presentation" ref={ref}>
                      <div className="cardHeader">
                        <span className="title">
                          {util.replaceKeywordMark(x.usingName, searchKeyword)}
                        </span>
                      </div>
                      <div className="entries">
                        <div>
                          <span className="entry">
                            {util.replaceKeywordMark(x.entries.join(' '), searchKeyword)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                );
              });
            })
          ) : (
            <Card
              radius="normal"
              bodyStyle={{ padding: '20px' }}
              style={{
                border: '1px solid #DCDCDC',
                marginTop: '20px',
                width: '1080px',
                height: '440px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Row
                style={{
                  width: '100%',
                  marginTop: '12px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div className="emptyList">
                  <div
                    className="empty"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <img src={icUtteranceEmpty} alt="empty" />
                    <span>No entries registered</span>
                  </div>
                </div>
              </Row>
            </Card>
          )}
        </Row>
      </div>
    </>
  );
};
