import '../styles.scss';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { DropDown } from '../components/navigation/DropDown';
import { IDataEntryProp } from '../models/interfaces/IDataEntryProp';
import { IHasClassNameNStyle } from '../models/interfaces/IHasStyle';

export default {
  title: 'Example/DropDown',
  component: DropDown,
  argTypes: {},
} as ComponentMeta<typeof DropDown>;

const Template: ComponentStory<typeof DropDown> = (
  args: IDataEntryProp & IHasClassNameNStyle,
) => (
  <div>
    <DropDown {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = { disabled: false, style: {} };
