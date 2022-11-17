import '../styles.scss';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { DropDownMenu } from '../components/navigation/DropDownMenu';
import { IDataEntryProp } from '../models/interfaces/IDataEntryProp';
import { IHasClassNameNStyle } from '../models/interfaces/IHasStyle';

export default {
  title: 'Example/DropDownMenu',
  component: DropDownMenu,
  argTypes: {},
} as ComponentMeta<typeof DropDownMenu>;

const Template: ComponentStory<typeof DropDownMenu> = (
  args: IDataEntryProp & IHasClassNameNStyle,
) => (
  <div>
    <DropDownMenu {...args} />
  </div>
);

export const Default = Template.bind({});

Default.args = { disabled: false, style: {} };
