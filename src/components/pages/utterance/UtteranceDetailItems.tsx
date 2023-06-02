import { icNoResult } from '@assets';
import { Checkbox, Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row, Space } from '@components/layout';
import { useI18n, usePage, useSystemModal } from '@hooks';
import { IUtteranceModel } from '@models';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import classNames from 'classnames';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { FieldArrayWithId, UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';

export interface IUtteranceDetailItemsProps {
  formMethods: UseFormReturn<IUtteranceModel>;
  fields: FieldArrayWithId<IUtteranceModel, 'items', 'id'>[];
  remove: UseFieldArrayRemove;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  isOpenUtteranceDetailPopup?: boolean;
}

export const UtteranceDetailItems: FC<IUtteranceDetailItemsProps> = ({
  formMethods,
  fields,
  remove,
  setIsActive,
  isOpenUtteranceDetailPopup,
}) => {
  const { tc } = usePage();
  const { t } = useI18n('utternaceDetailPage');

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const { confirm } = useSystemModal();
  const { register, getValues, watch } = formMethods;

  const filterKeyword = fields.filter((x) =>
    x.text?.trim().toLowerCase().includes(searchKeyWord.trim().toLowerCase()),
  );

  const handleSearch = (keyword?: string) => {
    setSearchKeyWord(keyword!);
  };

  const openDeleteCheckboxModal = async () => {
    const deleteItems = getValues().items.filter((x) => x.isChecked);

    if (deleteItems.length === 0) {
      return;
    }
    const result = await confirm({
      title: t('DELETE_UTTERANCE'),
      description: <span>{t('DELETE_CONFIRM', { count: deleteItems.length })}</span>,
    });

    if (result) {
      deleteItems.map((item) => {
        setIsActive(true);
        const index = getValues().items.indexOf(item);
        remove(index);
      });
      lunaToast.success(tc('DELETE_MESSAGE'));
    }
  };

  return (
    <div
      className={classNames('utterance list', {
        'utterance-detailModal': isOpenUtteranceDetailPopup,
      })}
    >
      <Space direction="horizontal">
        <span className="title">
          {t('UTTERANCE')}{' '}
          <span className="utteranceLength">
            {filterKeyword ? filterKeyword.length : watch('items').length}
          </span>
        </span>
        <Input
          size="small"
          search
          placeholder={t('SEARCH_UTTERANCE_PLACEHOLDER')}
          value={searchKeyWord}
          onSearch={(value) => handleSearch(value)}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          shape="ghost"
          className="icDelete"
          onClick={openDeleteCheckboxModal}
          disabled={
            getValues('items') &&
            getValues().items.filter((x) => x.isChecked).length === 0
          }
        />
      </Space>
      <Row style={{ marginTop: '12px' }}>
        {watch('items').length === 0 ? (
          <Row style={{ width: '100%', marginTop: '12px' }}>
            <Col className="emptyList utteranceItem">
              <div className="empty">
                <img src={icNoResult} alt="empty" />
                <span>{t('NO_REGISTERED_UTTERANCE')}</span>
              </div>
            </Col>
          </Row>
        ) : filterKeyword.length > 0 ? (
          filterKeyword.map((v, i) => {
            return (
              <div key={v.id} className="utteranceItem">
                <Checkbox
                  {...register(`items.${i}.isChecked`)}
                  style={{ marginLeft: '20px' }}
                />
                <p className="item">{util.replaceKeywordMark(v.text!, searchKeyWord)}</p>
              </div>
            );
          })
        ) : (
          <Row style={{ width: '100%', marginTop: '12px' }}>
            <div className="emptyList utteranceItem">
              <div className="empty">
                <img src={icNoResult} alt="empty" />
                <span>{t('NO_SEARCH_UTTERANCE_RESULT_FOUND')}</span>
              </div>
            </div>
          </Row>
        )}
      </Row>
    </div>
  );
};
