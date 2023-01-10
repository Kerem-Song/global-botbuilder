import { Col } from '@components/layout';
import { useRootState } from '@hooks';
import { useBotTesterClient } from '@hooks/client/botTesterClient';
// import { useSessionTokenClient } from '@hooks/client/sessionTokenClient';
import {
  IQuickRepliesContent,
  ITesterDataType,
  ITesterDebugMeta,
  TESTER_DATA_TYPES,
} from '@models';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';

import { TesterMessagesItem } from './TesterMessagesItem';
import { TestInfoModal } from './TestInfoModal';

export interface IBotTesterProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
}

export const BotTester = ({ isOpen, handleIsOpen }: IBotTesterProps) => {
  const { botTesterMutate } = useBotTesterClient();
  // const { token } = useSessionTokenClient();
  // console.log(token);
  const token = useRootState((state) => state.botBuilderReducer.token);

  const [text, setText] = useState<string>('');
  const [testerData, setTesterData] = useState<ITesterDataType[]>([]);
  const [isOpenTestInfo, setIsOpenTestInfo] = useState<boolean>(false);
  const [debugMeta, setDebugMeta] = useState<ITesterDebugMeta>();

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    setTesterData([]);
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
    setTesterData([...testerData, newMessage]);

    const sendMessage = {
      sessionToken: token,
      lunaMessage: {
        id: '1',
        utterance: {
          value: text,
        },
      },
    };

    botTesterMutate.mutate(sendMessage, {
      onSuccess: (submitResult) => {
        setTesterData((original) => {
          const updatedTesterData = [
            ...original,
            ...(submitResult.result?.messages || []),
          ];
          if (submitResult.result?.quickReplies) {
            const quickRepliesContent: IQuickRepliesContent = {
              quickReplies: submitResult.result.quickReplies,
              type: TESTER_DATA_TYPES.quickReplies,
            };
            updatedTesterData.push(quickRepliesContent);
          }
          return updatedTesterData;
        });
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
      setTesterData([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
    }
  }, [testerData]);

  return (
    <>
      {isOpen && (
        <Draggable>
          <div className="botTester">
            <Col className="botTesterHeader">
              <Col className="text">Testing the Bot</Col>
              <button className="icon refreshBtn" onClick={handleRefresh} />
              <button className="icon closeBtn" onClick={handleClose} />
            </Col>
            <div
              className="botTesterContent"
              role="presentation"
              onClick={openTestInfo}
              ref={scrollRef}
            >
              {testerData.map((item, i) => {
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
              <input
                className="input"
                value={text}
                type="text"
                onChange={handleText}
                placeholder="Please enter text."
              />
              <button className="sendBtn" onClick={handleSend}>
                Send
              </button>
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
