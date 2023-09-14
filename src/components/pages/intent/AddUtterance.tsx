import { icEnter } from '@assets';
import { Button, Col, Input, Row, Space } from '@components';
import { useI18n, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { IUtteranceModel } from '@models';
import { Dispatch, FC, RefObject, SetStateAction, useEffect, useState } from 'react';
import { UseFieldArrayPrepend, UseFormReturn } from 'react-hook-form';

export interface IAddUtteranceProps {
  formMethods: UseFormReturn<IUtteranceModel>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  prepend: UseFieldArrayPrepend<IUtteranceModel, 'items'>;
  utteranceRef: RefObject<HTMLInputElement>;
}

export const AddUtterance: FC<IAddUtteranceProps> = ({
  formMethods,
  prepend,
  setIsActive,
  utteranceRef,
}) => {
  const { t } = useI18n('intentDetailPage');
  const { error } = useSystemModal();
  const [utteranceWord, setUtteranceWord] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { checkUtteranceDuplicationAsync } = useUtteranceClient();
  const { getValues } = formMethods;

  const handleAddUtternace = async () => {
    if (!utteranceWord || !utteranceWord.trim()) return;

    const res = await checkUtteranceDuplicationAsync({
      text: utteranceWord,
      customErrorCode: [7000],
    });

    if (Array.isArray(res)) {
      const isDuplicateUtterance = getValues('items')
        .map((x) => x.text?.toLowerCase())
        .includes(utteranceWord.toLowerCase());

      const errorModal = (items: string) => {
        error({
          title: t('DUPLICATE_UTTERANCE'),
          description: (
            <div style={{ whiteSpace: 'pre-wrap' }}>
              <span>{t('DUPLICATE_UTTERANCE_MESSAGE')}</span>
              <span style={{ color: 'red' }}>{items}</span>
            </div>
          ),
        });
      };

      const handleAddUtteranceSuccess = () => {
        prepend({ text: utteranceWord });
        setIsActive(true);
        setIsEditing(false);
        setUtteranceWord('');
        if (utteranceRef.current) {
          utteranceRef.current.focus();
        }
      };

      const handleAddUtteranceError = (errorMessage: string) => {
        errorModal(errorMessage);
        if (utteranceRef.current) {
          utteranceRef.current.select();
        }
        setIsActive(false);
        return;
      };

      if (res.length === 0) {
        if (isDuplicateUtterance) {
          handleAddUtteranceError(getValues('name'));
          return;
        } else {
          handleAddUtteranceSuccess();
        }
      } else {
        handleAddUtteranceError(res[0].intentName);
      }
    }
  };

  useEffect(() => {
    if (utteranceRef.current) {
      utteranceRef.current.focus();
    }
  }, [utteranceRef]);

  return (
    <div className="utterance add">
      <Space direction="vertical">
        <p className="addUtterance">{t('ADD_UTTERANCE')}</p>
        <Row>
          <Col flex="auto">
            <Input
              maxLength={700}
              showCount
              ref={utteranceRef}
              value={utteranceWord}
              onChange={(e) => {
                setUtteranceWord(e.target.value);
                setIsActive(true);
                setIsEditing(true);
              }}
              onPressEnter={handleAddUtternace}
              placeholder={t('ENTER_UTTERANCE')}
            />
          </Col>
          <Col className="addUtteranceBtnWrap">
            <Button
              type="primary"
              className="addUtteranceBtn"
              icon={icEnter}
              onClick={handleAddUtternace}
              disabled={!utteranceWord || !isEditing}
            />
          </Col>
        </Row>
      </Space>
    </div>
  );
};
