import { Col } from '@components/layout';
import { useBotTesterClient } from '@hooks/client/botTesterClient';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';

import { TesterMessagesItem } from './TesterMessagesItem';
import { TestInfoModal } from './TestInfoModal';

export interface IBotTesterProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
}

export type ISendMessage = {
  value?: string;
  type?: string;
};

export interface IReplyMessage {
  value?: string;
  type?: string;
}

export type messageItemType =
  | 'text'
  | 'productCardCarousel'
  | 'cardCarousel'
  | 'card'
  | 'productCard'
  | 'image';

export interface IProductCardContent {
  image?: {
    imageUrl?: string;
    imageAspectRatio?: number;
    imageSize?: number;
    background?: string;
    previewUrl?: string;
    type?: string;
  };
  icon: {
    url: string;
  };
  title: string;
  description: string;
  price?: {
    gross?: number;
    net?: number;
    symbol?: string;
    discount?: number;
  };
  buttons?: [
    {
      actionType?: string;
      label?: string;
      postback?: {
        lunaNodeLink?: string;
        webLinkUrl?: string;
        text?: string;
      };
    },
  ];
  type?: string;
  defaultAction?: {
    actionType?: string;
    label?: string;
    postback?: {
      webLinkUrl?: string;
    };
  };
}

export interface IBasicCardContent {
  contentText?: string;
  title?: string;
  image?: {
    imageUrl?: string;
    imageAspectRatio?: number;
    imageSize?: number;
    background?: string;
    previewUrl?: string;
    type?: string;
    defaultAction?: {
      actionType?: string;
      label?: string;
      postback?: {
        webLinkUrl?: string;
      };
    };
  };
  buttons?: [
    {
      actionType?: string;
      label?: string;
      postback?: {
        webLinkUrl?: string;
      };
    },
    {
      actionType?: string;
      label?: string;
      postback?: {
        text?: string;
      };
    },
    {
      actionType?: string;
      label?: string;
      postback?: {
        p1?: string;
        p2?: string;
        p3?: string;
        displayText?: string;
      };
    },
  ];
  type?: string;
}

export type messageItemContentType = IProductCardContent;

export interface IMessageItem {
  value?: string;
  isMe?: boolean;
  type: messageItemType;
  contentText?: string;
  contents?: messageItemContentType[];
}

export const BotTester = ({ isOpen, handleIsOpen }: IBotTesterProps) => {
  const { data, botTesterMutate } = useBotTesterClient();

  const [text, setText] = useState<string>('');
  const [dataMessages, setDataMessages] = useState<IMessageItem[]>([]);
  console.log('dataMessages?', dataMessages);

  const [isOpenTestInfo, setIsOpenTestInfo] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    setDataMessages([]);
  };

  const handleClose = () => {
    handleIsOpen(false);
  };

  const handleText = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const handleSend = (e: FormEvent<HTMLButtonElement>): void => {
    const newMessage: IMessageItem = {
      value: text,
      isMe: true,
      type: 'text',
    };
    setDataMessages([...dataMessages, newMessage]);
    e.preventDefault();
    setText('');
  };

  function openTestInfo() {
    setIsOpenTestInfo(true);
  }

  const closeTestInfo = () => {
    setIsOpenTestInfo(false);
  };

  useEffect(() => {
    if (isOpen === false) {
      setDataMessages([]);
    }
  }, [isOpen]);

  useEffect(() => {
    setDataMessages([...dataMessages, ...(data?.messages || [])]);
  }, [data]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
    }
  }, [dataMessages]);

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
              {dataMessages.map((item: IMessageItem, i) => {
                return <TesterMessagesItem key={i} item={item} />;
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
