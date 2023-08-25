import { useBotTesterClient } from '@hooks/client/botTesterClient';
import { useRootState } from '@hooks/useRootState';
import {
  IBotTester,
  IHasClassNameNStyle,
  IHasResult,
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

  console.log('actionType', actionType);

  const handleLinkWebUrl = () => {
    const url = webLinkUrl?.startsWith('http') ? webLinkUrl : `https://${webLinkUrl}`;
    window.open(url);
  };

  const handleButtonClick = async () => {
    const testerDataType: ITesterDataType = {
      value: actionType === 'actValueIsUttr' ? item.postback.actValueIsUttr : item.label,
      isMe: true,
      type: 'text',
    };

    dispatch(setTesterData([testerDataType]));

    const sendMessage: ISendMessage = {
      sessionToken: token,
      lunaMessage: {
        id: actionType === 'lunaNodeRedirect' ? 'lunaNodeLink' : actionType,
        postback: item.postback,
        [actionType === 'lunaNodeRedirect' ? 'lunaNode' : 'utterance']: {
          value:
            actionType === 'linkWebUrl'
              ? item.postback.webLinkUrl
              : actionType === 'lunaNodeRedirect'
              ? lunaNodeLink
              : item.label,
        },
      },
    };

    const res = (await botTesterMutateAsync(sendMessage)) as IHasResult<IBotTester>;

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

  const buttonClassName = classNames(className, 'luna-testerItem-btn', {
    'luna-testerItem-quickReplyBtn': quickReply,
  });

  return (
    <button
      className={buttonClassName}
      onClick={(e) => {
        e.stopPropagation();
        if (actionType === 'linkWebUrl') {
          handleLinkWebUrl();
        } else {
          handleButtonClick();
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
};
