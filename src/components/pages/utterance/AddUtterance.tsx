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
  const { t } = useI18n('utternaceDetailPage');
  const { error } = useSystemModal();
  const [utteranceWord, setUtteranceWord] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { checkUtteranceDuplicationAsync } = useUtteranceClient();
  const { getValues } = formMethods;

  const handleAddUtternace = async () => {
    if (!utteranceWord || !utteranceWord.trim()) return;

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

    const checkUtteranceDuplication = await checkUtteranceDuplicationAsync({
      text: utteranceWord,
    });

    const isDuplicateUtterance = getValues('items')
      .map((x) => x.text?.toLowerCase())
      .includes(utteranceWord.toLowerCase());

    if (checkUtteranceDuplication.length === 0) {
      if (isDuplicateUtterance) {
        errorModal(getValues('name'));
        if (utteranceRef.current) {
          utteranceRef.current.select();
        }
        setIsEditing(false);
        return;
      }
      prepend({ text: utteranceWord });
      setIsActive(true);
      setIsEditing(false);
      setUtteranceWord('');
      if (utteranceRef.current) {
        utteranceRef.current.focus();
      }
    } else {
      const isDuplicateUtteranceInSameIntent =
        getValues('items')
          .map((x) => x.text?.toLowerCase())
          ?.includes(checkUtteranceDuplication[0].utterance.toLocaleLowerCase()) ===
          false && getValues('name') === checkUtteranceDuplication[0].intentName;

      if (isDuplicateUtteranceInSameIntent) {
        prepend({ text: utteranceWord });
        setIsActive(true);
        setIsEditing(false);
        setUtteranceWord('');
        if (utteranceRef.current) {
          utteranceRef.current.focus();
        }
        return;
      } else {
        errorModal(checkUtteranceDuplication[0].intentName);
        if (utteranceRef.current) {
          utteranceRef.current.select();
        }
        setIsEditing(false);
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
