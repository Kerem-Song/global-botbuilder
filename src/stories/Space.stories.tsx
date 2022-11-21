import '../styles.scss';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button } from '../components/general/Button';
import { ISpaceProp, Space } from '../components/layout/Space';
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Space',
  component: Space,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
} as ComponentMeta<typeof Space>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Space> = (args: ISpaceProp) => (
  <div>
    <Space {...args}>
      <Button>버튼1</Button>
      <Button>버튼1</Button>
      <Button>버튼3</Button>
    </Space>
  </div>
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = { direction: 'horizontal', gap: 'large' };
