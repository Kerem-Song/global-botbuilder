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
import classNames from 'classnames';
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
  const { t } = useI18n('botTest');
  const { botId } = useParams();
  const dispatch = useDispatch();
  const token = useRootState((state) => state.botInfoReducer.token);
  const botTesterData = useRootState((state) => state.botTesterReducer.messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { botTesterMutateAsync, refreshBotTesterAsync } = useBotTesterClient();

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
    setText('');
    handleIsOpen(false);
  };

  const handleText = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const handleSend = async () => {
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

    const res = await botTesterMutateAsync(sendMessage);

    if (res.isSuccess) {
      const updateTesterData = res.result?.messages || [];
      if (res.result?.quickReplies) {
        const quickpRepliesContent: IQuickRepliesContent = {
          quickReplies: res.result?.quickReplies,
          type: TESTER_DATA_TYPES.quickReplies,
        };
        updateTesterData.push(quickpRepliesContent);
        setText('');
      }
      dispatch(setTesterData(updateTesterData));
    }
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
    if (isOpen) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
        }
      }, 10);
    }
  }, [isOpen, botTesterData]);

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
                className={classNames('sendBtn', {
                  disabledBtn: !text,
                })}
                onClick={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                disabled={!text}
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
