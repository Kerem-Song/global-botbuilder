import { icNoResult } from '@assets';
import { Checkbox, Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row, Space } from '@components/layout';
import { useI18n, usePage, useSystemModal } from '@hooks';
import { IUtteranceModel } from '@models';
import { lunaToast } from '@modules/lunaToast';
import { util } from '@modules/util';
import classNames from 'classnames';
import { Dispatch, FC, RefObject, SetStateAction, useState } from 'react';
import { FieldArrayWithId, UseFieldArrayRemove, UseFormReturn } from 'react-hook-form';

export interface IUtteranceDetailItemsProps {
  formMethods: UseFormReturn<IUtteranceModel>;
  fields: FieldArrayWithId<IUtteranceModel, 'items', 'keyName'>[];
  remove: UseFieldArrayRemove;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  isOpenUtteranceDetailPopup?: boolean;
  utteranceRef: RefObject<HTMLInputElement>;
}

export const UtteranceDetailItems: FC<IUtteranceDetailItemsProps> = ({
  formMethods,
  fields,
  remove,
  setIsActive,
  isOpenUtteranceDetailPopup,
  utteranceRef,
}) => {
  const { tc } = usePage();
  const { t } = useI18n('intentDetailPage');

  const [searchKeyWord, setSearchKeyWord] = useState<string>('');
  const { confirm } = useSystemModal();
  const { register, getValues, watch } = formMethods;

  const filterKeyword = watch('items').filter((x) =>
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
        const index = getValues().items.indexOf(item);
        remove(index);
        setIsActive(true);
      });
      lunaToast.success(tc('DELETE_MESSAGE'));
    }
  };

  return (
    <div
      className={classNames('utterance list', {
        intentDetailPopup: isOpenUtteranceDetailPopup,
      })}
    >
      <Space direction="horizontal">
        <span className="title">
          {t('UTTERANCE')}{' '}
          <span
            className={classNames('utteranceLength', {
              emptyUtterance: watch('items').length === 0 || !filterKeyword.length,
            })}
          >
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
          disabled={filterKeyword.filter((x) => x.isChecked).length === 0}
        />
      </Space>
      <Row
        className={classNames('utteranceItems', {
          intentDetailPopupItems: isOpenUtteranceDetailPopup,
        })}
        style={{ marginTop: '10px' }}
      >
        {watch('items').length === 0 ? (
          <Row style={{ width: '100%' }}>
            <Col
              className={classNames('emptyList', {
                intentDetailPopupEmptyList: isOpenUtteranceDetailPopup,
              })}
            >
              <div className="empty">
                <img src={icNoResult} alt="empty" />
                <span>{t('NO_REGISTERED_UTTERANCE')}</span>
              </div>
            </Col>
          </Row>
        ) : (
          filterKeyword.length === 0 && (
            <Row style={{ width: '100%' }}>
              <Col
                className={classNames('emptyList', {
                  intentDetailPopupEmptyList: isOpenUtteranceDetailPopup,
                })}
              >
                <div className="empty">
                  <img src={icNoResult} alt="empty" />
                  <span>{t('NO_SEARCH_UTTERANCE_RESULT_FOUND')}</span>
                </div>
              </Col>
            </Row>
          )
        )}
        {fields.length > 0 &&
          fields.map((v, i) => {
            if (
              !v.text?.trim().toLowerCase().includes(searchKeyWord.trim().toLowerCase())
            ) {
              return <div key={v.keyName}></div>;
            }
            return (
              <div key={v.keyName} className="utteranceItem">
                <Checkbox
                  {...register(`items.${i}.isChecked`)}
                  style={{ marginLeft: '20px' }}
                  utteranceRef={utteranceRef}
                />
                <span className="item">
                  {util.replaceKeywordMark(v.text || '', searchKeyWord)}
                </span>
              </div>
            );
          })}
      </Row>
    </div>
  );
};
