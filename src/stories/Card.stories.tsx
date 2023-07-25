import '../styles.scss';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Card, ICardProps } from '../components/data-display/Card';

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
const Template: ComponentStory<typeof Card> = (args: ICardProps) => (
  <div>
    <Card {...args} />
  </div>
);
export const Default = Template.bind({});
export const Hoverable = Template.bind({});
export const NoBorder = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  title: '제목',
  children: '카드 내용',
  bordered: true,
  radius: 'none',
  style: { width: '250px' },
};
Hoverable.args = {
  title: '제목',
  children: '카드 내용',
  bordered: true,
  hoverable: true,
  radius: 'none',
  style: { width: '250px' },
};
NoBorder.args = {
  title: '제목',
  children: '카드 내용',
  bordered: false,
  radius: 'none',
  style: { width: '250px' },
};
