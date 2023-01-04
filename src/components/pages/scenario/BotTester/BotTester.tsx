import { Col } from '@components/layout';
import { useBotTesterClient } from '@hooks/client/botTesterClient';
import { DATA_TYPES, IDataType, IQuickRepliesContent } from '@models';
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
  const [text, setText] = useState<string>('');
  const [testerData, setTesterData] = useState<IDataType[]>([]);
  const [isOpenTestInfo, setIsOpenTestInfo] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleClose = () => {
    handleIsOpen(false);
  };

  const handleText = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const handleSend = (e: FormEvent<HTMLButtonElement>): void => {
    const newMessage: IDataType = {
      value: text,
      isMe: true,
      type: 'text',
    };
    setTesterData([...testerData, newMessage]);
    const sendMessage = {
      message: {
        id: '1',
        utterance: {
          value: text,
        },
      },
    };
    botTesterMutate.mutate(sendMessage, {
      onSuccess: (submitResult) => {
        setTesterData((original) => {
          const updatedTesterData = [...original, ...(submitResult.messages || [])];
          if (submitResult.quickReplies) {
            const quickRepliesContent: IQuickRepliesContent = {
              quickReplies: submitResult.quickReplies,
              type: DATA_TYPES.quickReplies,
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
              <button className="icon refreshBtn" />
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
                  <>
                    {item.type && (
                      <div className="testerDataContainer" key={i}>
                        <TesterMessagesItem item={item} />
                      </div>
                    )}
                  </>
                );
              })}
            </div>
            <form className="botTesterInput" onSubmit={(e) => e.preventDefault()}>
              <input
                className="input"
                ref={inputRef}
                value={text}
                type="text"
                onChange={handleText}
                placeholder="Please enter text."
              />
              <button className="sendBtn" onClick={handleSend}>
                Send
              </button>
            </form>
            <TestInfoModal isOpen={isOpenTestInfo} handleClose={closeTestInfo} />
          </div>
        </Draggable>
      )}
    </>
  );
};
