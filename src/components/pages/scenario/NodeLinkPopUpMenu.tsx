import { icSearch } from '@assets/index';
import { defaultCards } from '@components/data-display/DefaultCards';
import { Input } from '@components/data-entry';
import { Button } from '@components/general';
import { Col, Row } from '@components/layout';
import { TDefaultCard } from '@models';
import { appendNode } from '@store/makingNode';
import { useState } from 'react';
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
  { className: 'icCondition', value: 'Condition' },
  { className: 'icCount', value: 'Count' },
];

export const NodeLinkPopUpMenu = () => {
  const [type, setType] = useState<TDefaultCard>('Text');
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<INodeLinkPopUpFormValue>();

  const onSubmit = ({ cardType }: INodeLinkPopUpFormValue) => {
    setType(cardType);
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

  return (
    <div className="nodeLinkPopUpMenuWrapper luna-node luna-node-bordered border-radious-small">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="inputWrapper">
          <Input placeholder="Input search text" {...register('cardType')} />
          <button className="searchBtn">
            <img src={icSearch} alt="searchCardType" />
          </button>
        </div>
      </form>

      <div className="btnWrapper">
        {cardTypeValue.map((item, i) => (
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
