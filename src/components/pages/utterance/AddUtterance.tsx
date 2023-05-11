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

    if (
      getValues('items')
        .map((x) => x.text)
        ?.includes(utteranceWord)
    ) {
      error({
        title: t('DUPLICATE_UTTERANCE'),
        description: (
          <div style={{ whiteSpace: 'pre-wrap' }}>
            <span>{t('DUPLICATE_UTTERANCE_MESSAGE')}</span>
            <span style={{ color: 'red' }}>{getValues('name')}</span>
          </div>
        ),
      });
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
            error({
              title: t('DUPLICATE_UTTERANCE'),
              description: (
                <div style={{ whiteSpace: 'pre-wrap' }}>
                  <span>{t('DUPLICATE_UTTERANCE_MESSAGE')}</span>
                  <span style={{ color: 'red' }}>{result[0].intentName}</span>
                </div>
              ),
            });
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
        <p style={{ fontSize: '16px', fontWeight: 500 }}>{t('ADD_UTTERANCE')}</p>
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
          <Col style={{ marginLeft: '8px' }}>
            <Button
              type="primary"
              style={{
                width: '64px',
                height: '33px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onClick={() => {
                handleAddUtternace();
              }}
              disabled={utteranceWord && isEditing ? false : true}
            >
              <img src={icEnter} alt="enter" />
            </Button>
          </Col>
        </Row>
      </Space>
    </div>
  );
};
