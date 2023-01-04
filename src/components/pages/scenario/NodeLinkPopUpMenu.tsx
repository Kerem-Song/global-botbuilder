import { icSearch } from '@assets/index';
import { defaultCards } from '@components/data-display/DefaultCards';
import { Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { CARD_TYPES, TDefaultCard } from '@models';
import { appendNode } from '@store/makingNode';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

interface INodeLinkPopUpFormValue {
  cardType: TDefaultCard;
}

const cardTypeValue = [
  { className: 'icText', value: 'Text' },
  { className: 'icBtnTemple', value: 'Button Template' },
  { className: 'icList', value: 'List' },
  { className: 'icCommerce', value: 'Commerce' },
  { className: 'icCaroImg', value: 'Button Carousel' },
  { className: 'icCaroList', value: 'List Carousel' },
  { className: 'icCaroCommerce', value: 'Commerce Carousel' },
  { className: 'icQuickBtn', value: 'Quick Reply' },
  { className: 'icCondition', value: 'Condition' },
  { className: 'icCount', value: 'Count' },
];

export const NodeLinkPopUpMenu = () => {
  const [type, setType] = useState<TDefaultCard | null>(null);
  const dispatch = useDispatch();
  const [cardBtn, setCardBtn] = useState(cardTypeValue);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<INodeLinkPopUpFormValue>();

  const onSubmit = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!type) {
      return;
    } else {
      const searchedType = cardTypeValue.filter((item) => item.value === type);
      setCardBtn(searchedType);
    }
    setCardBtn([]);
  };

  const handleMakingChatbubble = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const cardType = e.currentTarget.value as TDefaultCard;
    const addCard = defaultCards(cardType);

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

  const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isOfTypePermission(e.currentTarget.value)) {
      setType(null);
    }
    setType(e.currentTarget.value as TDefaultCard);
  };

  const permissions = [
    'text',
    'button template',
    'list',
    'commerce',
    'button carousel',
    'list carousel',
    'commerce carousel',
    'quick reply',
    'condition',
    'count',
  ] as const;
  const cardValueArr = cardTypeValue.map((item) => item.value.toLowerCase());

  type PermissionType = typeof cardValueArr[number];

  function isOfTypePermission(userInput: string): userInput is PermissionType {
    const input = userInput.toLowerCase();
    return (permissions as readonly string[]).includes(input);
  }

  return (
    <div className="nodeLinkPopUpMenuWrapper luna-node luna-node-bordered border-radious-small">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Input search text"
          {...register('cardType')}
          search
          onChange={(e) => onSearch(e)}
        />
      </form>

      <div className="btnWrapper">
        {cardBtn.map((item, i) => (
          <Row key={i} justify="flex-start" align="center" gap={8}>
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
        ))}
      </div>
    </div>
  );
};
