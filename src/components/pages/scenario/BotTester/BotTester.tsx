import { Col } from '@components/layout';
import { useBotTesterClient } from '@hooks/client/botTesterClient';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';

import { TesterMessagesItem } from './TesterMessagesItem';
import { TesterSlide } from './TesterSlide';
import { TestInfoModal } from './TestInfoModal';

export interface IBotTesterProps {
  isOpen: boolean;
  handleIsOpen: (value: boolean) => void;
}

export const CARD_TYPES = {
  text: 'text',
  productCardCarousel: 'productCardCarousel',
  cardCarousel: 'cardCarousel',
  card: 'card',
  productCard: 'productCard',
  image: 'image',
} as const;

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

export type messageItemContentType = IProductCardContent;

export interface ITextCard {
  value?: string;
  isMe?: boolean;
  type: typeof CARD_TYPES.text;
}

export interface IProductCardCarousel {
  contents: messageItemContentType[];
  type: typeof CARD_TYPES.productCardCarousel;
}

export interface ICardCarousel {
  contents: messageItemContentType[];
  type: typeof CARD_TYPES.cardCarousel;
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
  type: typeof CARD_TYPES.card;
}

export interface IProductCard {
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
  type: typeof CARD_TYPES.productCard;
  defaultAction?: {
    actionType?: string;
    label?: string;
    postback?: {
      webLinkUrl?: string;
    };
  };
}

export interface IImageCard {
  imageUrl: string;
  imageAspectRatio: 0;
  imageSize: 0;
  background: string;
  previewUrl: string;
  type: typeof CARD_TYPES.image;
  defaultAction: {
    actionType: string;
    label: string;
    postback: {
      webLinkUrl: string;
    };
  };
}

export interface IQuickReplies {
  actionType?: string;
  label: string;
  postback?: {
    command?: string;
    displayText?: string;
    text?: string;
    lunaNodeLink?: string;
  };
}

export type IMessageType =
  | ITextCard
  | IProductCardCarousel
  | ICardCarousel
  | IBasicCardContent
  | IProductCard
  | IImageCard;

export const BotTester = ({ isOpen, handleIsOpen }: IBotTesterProps) => {
  const { botTesterMutate } = useBotTesterClient();
  const [text, setText] = useState<string>('');
  const [dataMessages, setDataMessages] = useState<IMessageType[]>([]);
  const [dataQuickReplies, setDataQuickReplies] = useState<IQuickReplies[]>([]);
  const [isOpenTestInfo, setIsOpenTestInfo] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleRefresh = () => {
    setDataMessages([]);
    setDataQuickReplies([]);
  };

  const handleClose = () => {
    handleIsOpen(false);
  };

  const handleText = (e: ChangeEvent<HTMLInputElement>): void => {
    setText(e.target.value);
  };

  const handleSend = (e: FormEvent<HTMLButtonElement>): void => {
    const newMessage: IMessageType = {
      value: text,
      isMe: true,
      type: 'text',
    };
    setDataMessages([...dataMessages, newMessage]);

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
        setDataMessages((original) => [...original, ...(submitResult.messages || [])]);
        setDataQuickReplies([...(submitResult.quickReplies || [])]);
      },
    });
    e.preventDefault();
    setText('');
  };

  const handleQuickReplyClick = () => {
    setDataQuickReplies([]);
  };

  const openTestInfo = () => {
    setIsOpenTestInfo(true);
  };

  const closeTestInfo = () => {
    setIsOpenTestInfo(false);
  };

  useEffect(() => {
    if (isOpen === false) {
      setDataMessages([]);
    }
  }, [isOpen]);

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
              {dataMessages.map((item, i) => {
                return (
                  <div className="content" key={i}>
                    <TesterMessagesItem item={item} />
                    {item.type === 'text' && item.isMe === undefined ? (
                      <div className="quickReplies">
                        {dataQuickReplies.length === 0 ? null : (
                          <TesterSlide gapSize={8} quickReplies>
                            {dataQuickReplies?.map((v, i) => {
                              return (
                                <button
                                  key={i}
                                  className="quickReply"
                                  onClick={handleQuickReplyClick}
                                >
                                  {v.label}
                                </button>
                              );
                            })}
                          </TesterSlide>
                        )}
                      </div>
                    ) : null}
                  </div>
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
