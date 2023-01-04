import { defaultCards, defaultNode } from '@components/data-display/DefaultCards';
import { Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { NODE_TYPES, TCardsValues, TNodeTypes } from '@models';
import { appendNode } from '@store/makingNode';
import classNames from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

interface INodeLinkPopUpFormValue {
  cardType: TCardsValues;
}

const cardTypeValue = [
  { className: 'icText', value: NODE_TYPES.TEXT_NODE },
  { className: 'icBtnTemple', value: NODE_TYPES.BASIC_CARD_NODE },
  { className: 'icList', value: NODE_TYPES.LIST },
  { className: 'icCommerce', value: NODE_TYPES.PRODUCT_CARD_NODE },
  { className: 'icCaroImg', value: NODE_TYPES.BASIC_CARD_CAROUSEL_NODE },
  { className: 'icCaroList', value: NODE_TYPES.LIST_CAROUSEL },
  { className: 'icCaroCommerce', value: NODE_TYPES.PRODUCT_CARD_CAROUSEL_NODE },
  { className: 'icQuickBtn', value: NODE_TYPES.ANSWER_NODE },
  { className: 'icCondition', value: NODE_TYPES.CONDITION_NODE },
  { className: 'icCount', value: NODE_TYPES.COUNT },
];

export const NodeLinkPopUpMenu = () => {
  const [userInput, setUserInput] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [cardBtn, setCardBtn] = useState(cardTypeValue);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<INodeLinkPopUpFormValue>();

  const onSubmit = () => {
    if (!userInput) {
      setCardBtn(cardTypeValue);
    }
  };

  const handleMakingChatbubble = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // const cardType = e.currentTarget.value as TCardsValues;
    const cardType = e.currentTarget.value as TNodeTypes;
    // const addCard = defaultCards(cardType);
    const addCard = defaultNode(cardType);
    console.log('cardtype node link', cardType);
    console.log('addcard node link', addCard);

    const addNode = {
      id: uuidv4(),
      type: cardType,
      title: cardType,
      cards: addCard,
      x: 0,
      y: 0,
    };
    dispatch(appendNode(addNode));
  };

  const onSearch = (data: string) => {
    const input = data.toLowerCase();

    const filtered = cardTypeValue.filter((item) =>
      item.value.toLowerCase().includes(input),
    );
    setCardBtn(filtered);
    setUserInput(input);
    console.log('input', input);
    if (!data) {
      setCardBtn(cardTypeValue);
    }
  };

  const cardBtnResult = classNames('btnWrapper', { noResult: !cardBtn.length });

  return (
    <div className="nodeLinkPopUpMenuWrapper luna-node luna-node-bordered border-radious-small">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Input search text"
          {...register('cardType')}
          search
          onSearch={(data) => onSearch(data as string)}
        />
      </form>

      <div className={cardBtnResult}>
        {cardBtn.length > 0 ? (
          cardBtn.map((item, i) => (
            <Row key={i} justify="flex-start" align="center" gap={8} className="btnRow">
              <Col>
                <Button
                  key={i}
                  className={`icon ${item.className}`}
                  onClick={(e) => handleMakingChatbubble(e)}
                  draggable={true}
                  value={item.value}
                />
              </Col>
              <Col>
                <span className="cardType">{item.value}</span>
              </Col>
            </Row>
          ))
        ) : (
          <div>No Results</div>
        )}
      </div>
    </div>
  );
};
