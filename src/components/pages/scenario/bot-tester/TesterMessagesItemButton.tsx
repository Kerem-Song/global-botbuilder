import { useBotTesterClient } from '@hooks/client/botTesterClient';
import { useRootState } from '@hooks/useRootState';
import {
  IHasClassNameNStyle,
  IQuickRepliesContent,
  ISendMessage,
  ITesterButton,
  ITesterDataType,
  TESTER_DATA_TYPES,
} from '@models';
import { setTesterData } from '@store/botTesterSlice';
import classNames from 'classnames';
import MultiClamp from 'react-multi-clamp';
import { useDispatch } from 'react-redux';

export interface TesterMessagesItemButtonProps extends IHasClassNameNStyle {
  item: ITesterButton;
  card?: boolean;
  cardCarousel?: boolean;
  productCardCarousel?: boolean;
  quickReply?: boolean;
}

export const TesterMessagesItemButton = ({
  item,
  quickReply,
  className,
}: TesterMessagesItemButtonProps) => {
  const { botTesterMutateAsync } = useBotTesterClient();
  const token = useRootState((state) => state.botInfoReducer.token);
  const actionType = item.actionType;
  const lunaNodeLink = item.postback?.lunaNodeLink;
  const webLinkUrl = item.postback?.webLinkUrl;
  const dispatch = useDispatch();

  const handleNodeUrl = async () => {
    const replyNodeLink: ITesterDataType = {
      value: item.label,
      isMe: true,
      type: 'text',
    };
    dispatch(setTesterData([replyNodeLink]));

    const sendLunaNodeLink: ISendMessage = {
      sessionToken: token,
      lunaMessage: {
        id: 'lunaNodeLink',
        postback: item.postback,
        lunaNode: {
          value: lunaNodeLink,
        },
      },
    };

    const res = await botTesterMutateAsync(sendLunaNodeLink);

    if (res.isSuccess) {
      const updateTesterData = res.result?.messages || [];
      if (res.result?.quickReplies) {
        const quickpRepliesContent: IQuickRepliesContent = {
          quickReplies: res.result?.quickReplies,
          type: TESTER_DATA_TYPES.quickReplies,
        };
        updateTesterData.push(quickpRepliesContent);
      }
      dispatch(setTesterData(updateTesterData));
    }
  };

  const handleActValueIsUttr = async () => {
    const actValueIsUttr: ITesterDataType = {
      value: item.postback.actValueIsUttr,
      isMe: true,
      type: 'text',
    };
    dispatch(setTesterData([actValueIsUttr]));

    const sendActValueIsUttr: ISendMessage = {
      sessionToken: token,
      lunaMessage: {
        id: 'actValueIsUttr',
        utterance: {
          value: item.postback.actValueIsUttr,
        },
        postback: item.postback,
      },
    };

    const res = await botTesterMutateAsync(sendActValueIsUttr);

    if (res.isSuccess) {
      const updateTesterData = res.result?.messages || [];
      if (res.result?.quickReplies) {
        const quickpRepliesContent: IQuickRepliesContent = {
          quickReplies: res.result?.quickReplies,
          type: TESTER_DATA_TYPES.quickReplies,
        };
        updateTesterData.push(quickpRepliesContent);
      }
      dispatch(setTesterData(updateTesterData));
    }
  };

  const handlelblIsUttr = async () => {
    const lblIsUttr: ITesterDataType = {
      value: item.label,
      isMe: true,
      type: 'text',
    };
    dispatch(setTesterData([lblIsUttr]));

    const sendlblIsUttr: ISendMessage = {
      sessionToken: token,
      lunaMessage: {
        id: 'lblIsUttr',
        utterance: {
          value: item.label,
        },
        postback: item.postback,
      },
    };

    const res = await botTesterMutateAsync(sendlblIsUttr);

    if (res.isSuccess) {
      const updateTesterData = res.result?.messages || [];
      if (res.result?.quickReplies) {
        const quickpRepliesContent: IQuickRepliesContent = {
          quickReplies: res.result?.quickReplies,
          type: TESTER_DATA_TYPES.quickReplies,
        };
        updateTesterData.push(quickpRepliesContent);
      }
      dispatch(setTesterData(updateTesterData));
    }
  };

  const itemButton = classNames(className, 'luna-testerItem-btn', {
    'luna-testerItem-quickReplyBtn': quickReply,
  });

  if (actionType === 'linkWebUrl') {
    return (
      <button
        className={itemButton}
        onClick={(e) => {
          e.stopPropagation();
          if (webLinkUrl?.startsWith('http')) {
            window.open(webLinkUrl);
          } else {
            window.open(`https://${webLinkUrl}`);
          }
        }}
      >
        {quickReply ? (
          item.label
        ) : (
          <MultiClamp clamp={1} ellipsis={'...'}>
            {item.label.substring(0, 30)}
          </MultiClamp>
        )}
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
        {quickReply ? (
          item.label
        ) : (
          <MultiClamp clamp={1} ellipsis={'...'}>
            {item.label.substring(0, 30)}
          </MultiClamp>
        )}
      </button>
    );
  } else if (actionType === 'lblIsUttr') {
    return (
      <button
        className={itemButton}
        onClick={(e) => {
          e.stopPropagation();
          handlelblIsUttr();
        }}
      >
        {quickReply ? (
          item.label
        ) : (
          <MultiClamp clamp={1} ellipsis={'...'}>
            {item.label.substring(0, 30)}
          </MultiClamp>
        )}
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
        {quickReply ? (
          item.label
        ) : (
          <MultiClamp clamp={1} ellipsis={'...'}>
            {item.label.substring(0, 30)}
          </MultiClamp>
        )}
      </button>
    );
  }
};
