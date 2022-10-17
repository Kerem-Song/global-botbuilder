import '../assets/css/card.css';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Card, CardProps } from '../components/data-display/Card';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Card',
  component: Card,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    title: { type: { name: 'string' } },
    children: { type: { name: 'string' } },
  },
} as ComponentMeta<typeof Card>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Card> = (args: CardProps) => <Card {...args} />;
export const Default = Template.bind({});
export const Hoverable = Template.bind({});
export const NoBorder = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = { title: '제목', children: '카드 내용', bordered: true };
Hoverable.args = {
  title: '제목',
  children: '카드 내용',
  bordered: true,
  hoverable: true,
};
NoBorder.args = { title: '제목', children: '카드 내용', bordered: false };
