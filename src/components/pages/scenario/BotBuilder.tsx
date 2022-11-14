import { Card } from '@components/data-display/Card';
import { Carousel } from '@components/data-display/Carousel';
import { Button } from '@components/general/Button';
import { IBasicCard } from 'src/models/interfaces/ICard';

import img from '../../../assets/react.svg';

export const Botbuilder = () => {
  const title = '캐로셀1';
  const cards: IBasicCard[] = [
    {
      title: 'title1',
      thumbnail: { imageUrl: img },
      description: '설명1',
      buttons: [{ label: '버튼1', action: 'message' }],
    },
    {
      title: 'title2',
      thumbnail: { imageUrl: img },
      description:
        '설명2asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfadfasdfasdfasdfasdfasdfasdfasdfsd',
      buttons: [
        { label: '버튼1', action: 'message' },
        { label: '버튼1', action: 'message' },
        { label: '버튼1', action: 'message' },
      ],
    },
    { title: 'title3', thumbnail: { imageUrl: img }, description: '설명3' },
    {
      title: 'title4',
      thumbnail: { imageUrl: img },
      description: '설명4',
      buttons: [
        { label: '버튼1', action: 'message' },
        { label: '버튼1', action: 'message' },
      ],
    },
  ];
  return (
    <>
      <div>Bot builder</div>
      <div>
        <Carousel title={title} cards={cards} />
        <Card
          className="builderCard"
          title={title}
          hoverable
          onClick={() => console.log('card click')}
        >
          <div className="thumbnail">
            <img src={img} alt="" />
          </div>
          <div>
            <p></p>
          </div>
          <div className="buttonWrapper">
            {/* {buttons?.map((button, i) => {
              return <Button key={i}>{button.label}</Button>;
            })} */}
            <Button>버튼2</Button>
          </div>
        </Card>
      </div>
    </>
  );
};
