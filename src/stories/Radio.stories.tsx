import '../styles/radio.scss';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Radio } from '../components/data-entry/Radio';
import { IDataEntryProp } from '../models/interfaces/IDataEntryProp';

export default {
  title: 'Example/Radio',
  component: Radio,
  argTypes: {
    onChange: { action: 'changed' },
  },
} as ComponentMeta<typeof Radio>;

const Template: ComponentStory<typeof Radio> = (args: IDataEntryProp) => (
  <div>
    <Radio {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = { disabled: false };
