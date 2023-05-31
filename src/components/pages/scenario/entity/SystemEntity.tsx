import { Col, Input, Row, Title } from '@components';
import { usePage } from '@hooks';
import { useEntityClient } from '@hooks/client/entityClient';
import { IPagingItems, IResponseEntryItems } from '@models';
import { util } from '@modules/util';
import { InfiniteData } from '@tanstack/react-query';
import { FC, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { EmptyEntityCard } from './EmptyEntityCard';

export const SystemEntity = () => {
  const { t } = usePage();
  const { changePageNumberQuery } = useEntityClient();
  const [ref, inView] = useInView();
  const [searchKeyword, setSearchKeyword] = useState<string>();
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
        <Title level={2}>{t('MANAGE_SYSTEM_ENTITIES')}</Title>
      </div>
      <div className="entity systemEntity">
        <Input
          size="small"
          search
          placeholder={t('INPUT_SEARCH_WORD')}
          onBlur={(e) => setSearchKeyword(e.target.value)}
          onPressEnter={(value) => setSearchKeyword(value)}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
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
            <EmptyEntityCard searchKeyword={searchKeyword} />
          )}
        </Row>
      </div>
    </>
  );
};
