import { Button, Input } from '@components';
import { useBotTesterClient, useI18n, useRootState } from '@hooks';
import {
  IBotTester,
  IHasResult,
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
import { useLocation, useParams } from 'react-router-dom';

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
  const location = useLocation();
  const token = useRootState((state) => state.botInfoReducer.token);
  const botTesterData = useRootState((state) => state.botTesterReducer.messages);
  const botTesterRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { botTesterMutateAsync, refreshBotTesterAsync } = useBotTesterClient();
  const isEditDrawerOpen = useRootState(
    (state) => state.botBuilderReducer.isEditDrawerOpen,
  );

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
      sessionToken: token,
      lunaMessage: {
        id: 'utterance',
        utterance: {
          value: text,
        },
      },
    };

    dispatch(setTesterData([newMessage]));
    setText('');

    const result = await botTesterMutateAsync({
      ...sendMessage,
      customErrorCode: [7617],
    });

    if (typeof result === 'number' && result === 7617) {
      console.log('result', result);
      setText('');
      return;
    }

    const res = result as IHasResult<IBotTester>;
    const { messages, quickReplies } = res.result;

    const updateTesterData: ITesterDataType[] = messages || [];
    if (quickReplies) {
      const quickRepliesContent: IQuickRepliesContent = {
        quickReplies,
        type: TESTER_DATA_TYPES.quickReplies,
      };
      updateTesterData.push(quickRepliesContent);
    }
    dispatch(setTesterData(updateTesterData));
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (botTesterRef.current) {
          botTesterRef.current.blur();
          handleIsOpen(false);
          setText('');
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      const isInScenarioMenu = location.pathname.includes(`/${botId}/scenario/`);
      handleIsOpen(isInScenarioMenu);
    } else {
      handleIsOpen(false);
      setText('');
    }
  }, [location.pathname, isOpen]);

  useEffect(() => {
    handleIsOpen(false);
    setText('');
  }, [botId]);

  return (
    <>
      {isOpen && (
        <Draggable handle=".botTesterHeader" onDrag={undefined} bounds="#layout">
          <div
            className={classNames('botTester', {
              editDrawerOpen: isEditDrawerOpen,
            })}
            ref={botTesterRef}
          >
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
                        handleRefresh={handleRefresh}
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
