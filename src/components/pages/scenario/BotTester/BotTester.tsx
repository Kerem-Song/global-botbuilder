import { Button, Input } from '@components';
import { Col } from '@components/layout';
import { useRootState } from '@hooks';
import { useBotTesterClient } from '@hooks';
import {
  IQuickRepliesContent,
  IRefreshBotTester,
  ISendMessage,
  ITesterDataType,
  ITesterDebugMeta,
  TESTER_DATA_TYPES,
} from '@models';
import { initMessages, setTesterData } from '@store/botTesterSlice';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { TesterMessagesItem } from './TesterMessagesItem';
import { TestInfoModal } from './TestInfoModal';

export interface IBotTesterProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
}

export const BotTester = ({ isOpen, handleIsOpen }: IBotTesterProps) => {
  const { t } = useTranslation('botTest');
  const { botTesterMutate, reFreshbotTester } = useBotTesterClient();
  const token = useRootState((state) => state.botInfoReducer.token);
  const botTesterData = useRootState((state) => state.botTesterReducer.messages);
  const [text, setText] = useState<string>('');
  const [isOpenTestInfo, setIsOpenTestInfo] = useState<boolean>(false);
  const [debugMeta, setDebugMeta] = useState<ITesterDebugMeta>();
  const scrollRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  const handleRefresh = async () => {
    const sendToken = {
      sessionToken: token!,
    };

    const res = await reFreshbotTester.mutateAsync(sendToken);

    if (res) {
      dispatch(initMessages());
      setDebugMeta(undefined);
    }
  };

  const handleClose = () => {
    handleIsOpen(false);
  };

  const handleText = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const handleSend = (e: FormEvent<HTMLButtonElement>): void => {
    const newMessage: ITesterDataType = {
      value: text,
      isMe: true,
      type: 'text',
    };
    if (!text || !text.trim()) return;
    dispatch(setTesterData([newMessage]));

    const sendMessage: ISendMessage = {
      sessionToken: token!,
      lunaMessage: {
        id: 'utterance',
        utterance: {
          value: text,
        },
      },
    };

    botTesterMutate.mutate(sendMessage, {
      onSuccess: (submitResult) => {
        const updateTesterData = submitResult.result?.messages || [];
        if (submitResult.result?.quickReplies) {
          const quickpRepliesContent: IQuickRepliesContent = {
            quickReplies: submitResult.result.quickReplies,
            type: TESTER_DATA_TYPES.quickReplies,
          };
          updateTesterData.push(quickpRepliesContent);
          setText('');
        }
        dispatch(setTesterData(updateTesterData));
      },
    });
    e.preventDefault();
    setText('');
  };

  const openTestInfo = () => {
    setIsOpenTestInfo(true);
  };

  const closeTestInfo = () => {
    setIsOpenTestInfo(false);
  };

  useEffect(() => {
    if (isOpen === false) {
      dispatch(initMessages());
      setDebugMeta(undefined);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
    }
  }, [botTesterData]);

  return (
    <>
      {isOpen && (
        <Draggable onDrag={undefined}>
          <div className="botTester">
            <Col className="botTesterHeader">
              <Col className="text">{t('HEADER')}</Col>
              <button className="icon refreshBtn" onClick={handleRefresh} />
              <button className="icon closeBtn" onClick={handleClose} />
            </Col>
            <div
              className="botTesterContent"
              role="presentation"
              onClick={openTestInfo}
              ref={scrollRef}
            >
              {botTesterData.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="testerDataContainer"
                    data-container={item.type ? true : false}
                  >
                    {item.type && (
                      <TesterMessagesItem
                        item={item}
                        onClick={(debugMeta) => setDebugMeta(debugMeta)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
            <form className="botTesterInput" onSubmit={(e) => e.preventDefault()}>
              <Input
                className="input"
                value={text}
                onChange={handleText}
                placeholder={t('ENTER_TEXT')}
                onPressEnter={(value: any) => handleSend(value)}
              />
              <Button
                style={{
                  height: '33px',
                  lineHeight: '1px',
                  color: 'white',
                  border: 'none',
                  backgroundColor: text ? '#4478FF' : '#A1BBFF',
                }}
                onClick={handleSend}
                disabled={text ? false : true}
              >
                {t('SEND')}
              </Button>
            </form>
            {debugMeta && (
              <TestInfoModal
                isOpen={isOpenTestInfo}
                handleClose={closeTestInfo}
                debugMeta={debugMeta}
              />
            )}
          </div>
        </Draggable>
      )}
    </>
  );
};
