import '../styles.scss';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button, ButtonProps } from '../components/general/Button';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    children: { type: { name: 'string' } },
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof Button>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args: ButtonProps) => (
  <div>
    <Button {...args} />
  </div>
);
export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = {
  label: 'Button',
  block: false,
  disabled: false,
};
