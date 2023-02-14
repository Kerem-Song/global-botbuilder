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
  quickReply?: boolean;
}

export const TesterMessagesItemButton = ({
  item,
  card,
  cardCarousel,
  quickReply,
  className,
}: TesterMessagesItemButtonProps) => {
  const { botTesterMutate } = useBotTesterClient();
  const token = useRootState((state) => state.botBuilderReducer.token);
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

  const itemButton = classNames(className, 'luna-testerItem-btn', {
    'luna-testerItem-cardBtn': card,
    'luna-testerItem-cardCarouselBtn': cardCarousel,
    'luna-testerItem-quickReplyBtn': quickReply,
  });
  return (
    <>
      <div>
        {actionType === 'linkWebUrl' ? (
          <button className={itemButton} onClick={() => window.open(webLinkUrl)}>
            {item.label}
          </button>
        ) : (
          <button className={itemButton} onClick={() => handleNodeUrl()}>
            {item.label}
          </button>
        )}
      </div>
    </>
  );
};
