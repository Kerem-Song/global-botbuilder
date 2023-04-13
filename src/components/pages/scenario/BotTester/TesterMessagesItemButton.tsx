import { useBotTesterClient } from '@hooks/client/botTesterClient';
import { useRootState } from '@hooks/useRootState';
import {
  IHasClassNameNStyle,
  IQuickRepliesContent,
  ISendMessage,
  ITesterDataType,
  ITesterQuickReply,
  TESTER_DATA_TYPES,
} from '@models';
import { setTesterData } from '@store/botTesterSlice';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';

export interface TesterMessagesItemButtonProps extends IHasClassNameNStyle {
  item: ITesterQuickReply;
  card?: boolean;
  cardCarousel?: boolean;
  productCardCarousel?: boolean;
  quickReply?: boolean;
}

export const TesterMessagesItemButton = ({
  item,
  card,
  cardCarousel,
  productCardCarousel,
  quickReply,
  className,
}: TesterMessagesItemButtonProps) => {
  const { botTesterMutate } = useBotTesterClient();
  const token = useRootState((state) => state.botInfoReducer.token);
  const actionType = item.actionType;
  const lunaNodeLink = item.postback?.lunaNodeLink;
  const webLinkUrl = item.postback?.webLinkUrl;

  const dispatch = useDispatch();

  const handleNodeUrl = () => {
    const replyNodeLink: ITesterDataType = {
      value: item.label,
      isMe: true,
      type: 'text',
    };
    dispatch(setTesterData([replyNodeLink]));

    const sendLunaNodeLink: ISendMessage = {
      sessionToken: token!,
      lunaMessage: {
        id: 'lunaNodeLink',
        postback: {
          queryString: `lunaNodeLink=${lunaNodeLink}`,
        },
      },
    };

    botTesterMutate.mutate(sendLunaNodeLink, {
      onSuccess: (submitResult) => {
        const updateTesterData = submitResult.result?.messages || [];
        if (submitResult.result?.quickReplies) {
          const quickpRepliesContent: IQuickRepliesContent = {
            quickReplies: submitResult.result.quickReplies,
            type: TESTER_DATA_TYPES.quickReplies,
          };
          updateTesterData.push(quickpRepliesContent);
        }
        dispatch(setTesterData(updateTesterData));
      },
    });
  };

  const handleActValueIsUttr = () => {
    const actValueIsUttr: ITesterDataType = {
      value: item.postback.actValueIsUttr!,
      isMe: true,
      type: 'text',
    };
    dispatch(setTesterData([actValueIsUttr]));

    const sendActValueIsUttr: ISendMessage = {
      sessionToken: token!,
      lunaMessage: {
        id: 'actValueIsUttr',
        utterance: {
          value: item.postback.actValueIsUttr!,
        },
      },
    };

    botTesterMutate.mutate(sendActValueIsUttr, {
      onSuccess: (submitResult) => {
        console.log('결과', submitResult);
        const updateTesterData = submitResult.result?.messages || [];
        if (submitResult.result?.quickReplies) {
          const quickpRepliesContent: IQuickRepliesContent = {
            quickReplies: submitResult.result.quickReplies,
            type: TESTER_DATA_TYPES.quickReplies,
          };
          updateTesterData.push(quickpRepliesContent);
        }
        dispatch(setTesterData(updateTesterData));
      },
    });
  };

  const itemButton = classNames(className, 'luna-testerItem-btn', {
    'luna-testerItem-cardBtn': card,
    'luna-testerItem-cardCarouselBtn': cardCarousel,
    'luna-testerItem-productCardCarouselBtn': productCardCarousel,
    'luna-testerItem-quickReplyBtn': quickReply,
  });

  if (actionType === 'linkWebUrl') {
    return (
      <button
        className={itemButton}
        onClick={(e) => {
          e.stopPropagation();
          window.open(webLinkUrl);
        }}
      >
        {item.label}
      </button>
    );
  } else if (actionType === 'actValueIsUttr') {
    return (
      <button
        className={itemButton}
        onClick={(e) => {
          e.stopPropagation();
          handleActValueIsUttr();
        }}
      >
        {item.label}
      </button>
    );
  } else {
    return (
      <button
        className={itemButton}
        onClick={(e) => {
          e.stopPropagation();
          handleNodeUrl();
        }}
      >
        {item.label}
      </button>
    );
  }
};
