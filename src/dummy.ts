import img from './assets/react.svg';
import { ICommerceCard } from './models/interfaces/ICard';

export const dummy = [
  {
    id: 'template1',
    title: '타이틀1',
    description: '설명',
    buttons: [
      { buttonId: '1', name: '버튼1', endPoint: 'template2' },
      { buttonId: '2', name: '버튼2', endPoint: 'template4' },
    ],
  },
  {
    id: 'template2',
    title: '타이틀2',
    description: '설명',
    buttons: [
      { buttonId: '3', name: '버튼1', endPoint: 'template5' },
      { buttonId: '4', name: '버튼2', endPoint: 'template1' },
    ],
  },
  {
    id: 'template3',
    title: '타이틀3',
    description: '설명',
    buttons: [
      { buttonId: '5', name: '버튼1', endPoint: 'template2' },
      { buttonId: '6', name: '버튼2', endPoint: 'template5' },
    ],
  },
  {
    id: 'template4',
    title: '타이틀4',
    description: '설명',
    buttons: [
      { buttonId: '7', name: '버튼1', endPoint: 'template1' },
      { buttonId: '8', name: '버튼2', endPoint: 'template3' },
    ],
  },
  {
    id: 'template5',
    title: '타이틀5',
    description: '설명',
    buttons: [
      { buttonId: '9', name: '버튼1', endPoint: 'template3' },
      { buttonId: '10', name: '버튼2', endPoint: 'template2' },
    ],
  },
  {
    id: 'template5',
    title: '타이틀5',
    description: '설명',
    buttons: [
      { buttonId: '9', name: '버튼1', endPoint: 'template3' },
      { buttonId: '10', name: '버튼2', endPoint: 'template2' },
    ],
  },
  {
    id: 'template5',
    title: '타이틀5',
    description: '설명',
    buttons: [
      { buttonId: '9', name: '버튼1', endPoint: 'template3' },
      { buttonId: '10', name: '버튼2', endPoint: 'template2' },
    ],
  },
  {
    id: 'template5',
    title: '타이틀5',
    description: '설명',
    buttons: [
      { buttonId: '9', name: '버튼1', endPoint: 'template3' },
      { buttonId: '10', name: '버튼2', endPoint: 'template2' },
    ],
  },
  {
    id: 'template5',
    title: '타이틀5',
    description: '설명',
    buttons: [
      { buttonId: '9', name: '버튼1', endPoint: 'template3' },
      { buttonId: '10', name: '버튼2', endPoint: 'template2' },
    ],
  },
  {
    id: 'template5',
    title: '타이틀5',
    description: '설명',
    buttons: [
      { buttonId: '9', name: '버튼1', endPoint: 'template3' },
      { buttonId: '10', name: '버튼2', endPoint: 'template2' },
    ],
  },
  {
    id: 'template5',
    title: '타이틀5',
    description: '설명',
    buttons: [
      { buttonId: '9', name: '버튼1', endPoint: 'template3' },
      { buttonId: '10', name: '버튼2', endPoint: 'template2' },
    ],
  },
  {
    id: 'template5',
    title: '타이틀5',
    description: '설명',
    buttons: [
      { buttonId: '9', name: '버튼1', endPoint: 'template3' },
      { buttonId: '10', name: '버튼2', endPoint: 'template2' },
    ],
  },
];

export const dummy2: ICommerceCard[] = [
  {
    description: '상품 입니다',
    price: 10000,
    currency: 'krw',
    discount: 1000,
    discountPrice: 9000,
    thumbnail: {
      imageUrl: img,
    },
    profile: {
      nickname: 'nickname',
      imageUrl: img,
    },
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    description: '상품2 입니다',
    price: 8000,
    currency: 'krw',
    discount: 1000,
    discountPrice: 7000,
    thumbnail: {
      imageUrl: img,
    },
    profile: {
      nickname: 'nickname2asdf',
      imageUrl: img,
    },
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
  {
    description: '상품3 입니다asdfasdfasdfasdfasdfasdf입니다asdfasdfasdfasdfasdfasdf',
    price: 8000,
    currency: 'krw',
    // discount: 1000,
    // discountPrice: 7000,
    thumbnail: {
      imageUrl: img,
    },
    profile: {
      nickname: 'nickname2asdf',
      imageUrl: img,
    },
    buttons: [
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
      { label: '버튼1', action: 'message' },
    ],
  },
];
