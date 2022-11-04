import '../styles/switch.scss';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Switch } from '../components/data-entry/Switch';
import { IDataEntryProp } from '../models/interfaces/IDataEntryProp';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/Switch',
  component: Switch,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    onChange: { action: 'changed' },
  },
} as ComponentMeta<typeof Switch>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Switch> = (args: IDataEntryProp) => (
  <Switch {...args} />
);

export const Default = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Default.args = { disabled: false };
