import '../styles.scss';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Checkboxes } from '../components/data-entry/Checkboxes';
import { IDataEntryProp } from '../models/interfaces/IDataEntryProp';
import { IHasClassNameNStyle } from '../models/interfaces/IHasStyle';

export default {
  title: 'Example/Checkboxes',
  component: Checkboxes,
  argTypes: {},
} as ComponentMeta<typeof Checkboxes>;

const Template: ComponentStory<typeof Checkboxes> = (
  args: IHasClassNameNStyle & IDataEntryProp,
) => (
  <div>
    <Checkboxes {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = { disabled: false };
