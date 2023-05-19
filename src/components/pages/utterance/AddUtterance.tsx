import { icEnter } from '@assets';
import { Button, Col, Input, Row, Space } from '@components';
import { usePage, useSystemModal } from '@hooks';
import { useUtteranceClient } from '@hooks/client/utteranceClient';
import { IUtteranceModel } from '@models';
import { Dispatch, FC, SetStateAction, useRef, useState } from 'react';
import { UseFieldArrayPrepend, UseFormReturn } from 'react-hook-form';

export interface IAddUtteranceProps {
  formMethods: UseFormReturn<IUtteranceModel>;
  setIsActive: Dispatch<SetStateAction<boolean>>;
  prepend: UseFieldArrayPrepend<IUtteranceModel, 'items'>;
}

export const AddUtterance: FC<IAddUtteranceProps> = ({
  formMethods,
  prepend,
  setIsActive,
}) => {
  const { t } = usePage();
  const { error } = useSystemModal();
  const utteranceRef = useRef<HTMLInputElement>(null);
  const [utteranceWord, setUtteranceWord] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { checkUtteranceDuplicationAsync } = useUtteranceClient();

  const { getValues } = formMethods;

  const handleAddUtternace = () => {
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

    if (
      getValues('items')
        .map((x) => x.text)
        ?.includes(utteranceWord)
    ) {
      errorModal(getValues('name'));
      if (utteranceRef.current) {
        utteranceRef.current.select();
      }
      return;
    }

    checkUtteranceDuplicationAsync(
      {
        text: utteranceWord,
      },
      {
        onSuccess: (result) => {
          console.log('result', result);
          if (result.length > 0) {
            errorModal(result[0].intentName);
            if (utteranceRef.current) {
              utteranceRef.current.select();
            }
          } else {
            prepend({ text: utteranceWord });
            setIsActive(true);
            setUtteranceWord('');
            if (utteranceRef.current) {
              utteranceRef.current.focus();
            }
          }
        },
      },
    );
  };
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
              onClick={() => {
                handleAddUtternace();
              }}
              disabled={utteranceWord && isEditing ? false : true}
            ></Button>
          </Col>
        </Row>
      </Space>
    </div>
  );
};
