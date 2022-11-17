import '../styles.scss';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Checkbox } from '../components/data-entry/Checkbox';
import { IDataEntryProp } from '../models/interfaces/IDataEntryProp';
import { IHasClassNameNStyle } from '../models/interfaces/IHasStyle';

export default {
  title: 'Example/Checkbox',
  component: Checkbox,
  argTypes: {},
} as ComponentMeta<typeof Checkbox>;

const Template: ComponentStory<typeof Checkbox> = (
  args: IHasClassNameNStyle & IDataEntryProp,
) => (
  <div>
    <Checkbox {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = { disabled: false };
