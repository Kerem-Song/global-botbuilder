import { Button, Input } from '@components';
import { useI18n, useRootState } from '@hooks';
import { useBotTesterClient } from '@hooks';
import {
  IQuickRepliesContent,
  ISendMessage,
  ITesterDataType,
  ITesterDebugMeta,
  TESTER_DATA_TYPES,
} from '@models';
import { initMessages, setTesterData } from '@store/botTesterSlice';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { TesterMessagesItem } from './TesterMessagesItem';
import { TestInfoModal } from './TestInfoModal';

export interface IBotTesterProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
}

export const BotTesterComponent = ({ isOpen, handleIsOpen }: IBotTesterProps) => {
  const [text, setText] = useState<string>('');
  const [isOpenTestInfo, setIsOpenTestInfo] = useState<boolean>(false);
  const [debugMeta, setDebugMeta] = useState<ITesterDebugMeta>();
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const { t } = useI18n('botTest');
  const { botId } = useParams();
  const dispatch = useDispatch();
  const token = useRootState((state) => state.botInfoReducer.token);
  const botTesterData = useRootState((state) => state.botTesterReducer.messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { botTesterMutate, refreshBotTesterAsync } = useBotTesterClient();

  const handleRefresh = async () => {
    const sendToken = {
      sessionToken: token!,
    };

    const res = await refreshBotTesterAsync(sendToken);

    if (res) {
      dispatch(initMessages());
      setDebugMeta(undefined);
      setText('');
    }
  };

  const handleClose = () => {
    setScrollPosition(scrollRef.current?.scrollTop || 0);
    setText('');
    handleIsOpen(false);
  };

  const handleText = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const handleSend = () => {
    if (!text || !text.trim()) return;

    const newMessage: ITesterDataType = {
      value: text,
      isMe: true,
      type: 'text',
    };

    const sendMessage: ISendMessage = {
      sessionToken: token!,
      lunaMessage: {
        id: 'utterance',
        utterance: {
          value: text,
        },
      },
    };

    dispatch(setTesterData([newMessage]));

    botTesterMutate.mutate(sendMessage, {
      onSuccess: (res) => {
        const updateTesterData = res?.messages || [];
        if (res?.quickReplies) {
          const quickpRepliesContent: IQuickRepliesContent = {
            quickReplies: res?.quickReplies,
            type: TESTER_DATA_TYPES.quickReplies,
          };
          updateTesterData.push(quickpRepliesContent);
          setText('');
        }
        dispatch(setTesterData(updateTesterData));
      },
    });
    setText('');
  };

  const openTestInfo = () => {
    setIsOpenTestInfo(true);
  };

  const closeTestInfo = () => {
    setIsOpenTestInfo(false);
  };

  useEffect(() => {
    dispatch(initMessages());
  }, [botId]);

  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = scrollPosition;
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
        <Draggable handle=".botTesterHeader" onDrag={undefined} bounds="#layout">
          <div className="botTester">
            <div className="botTesterHeader">
              <div className="text">{t('HEADER')}</div>
              <button className="icon refreshBtn" onClick={handleRefresh} />
              <button className="icon closeBtn" onClick={handleClose} />
            </div>
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
                onPressEnter={handleSend}
              />
              <Button
                style={{
                  height: '33px',
                  lineHeight: '1px',
                  color: 'white',
                  border: 'none',
                  backgroundColor: text ? '#4478FF' : '#A1BBFF',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
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
