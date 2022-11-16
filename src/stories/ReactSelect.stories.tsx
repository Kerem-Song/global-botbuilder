import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ReactSelect } from '../components/data-entry/ReactSelect';
import { IDataEntryProp } from '../models/interfaces/IDataEntryProp';
import { IHasClassNameNStyle } from '../models/interfaces/IHasStyle';

export default {
  title: 'Example/ReactSelect',
  component: ReactSelect,
  argTypes: {},
} as ComponentMeta<typeof ReactSelect>;

const Template: ComponentStory<typeof ReactSelect> = (
  args: IHasClassNameNStyle & IDataEntryProp,
) => (
  <div>
    <ReactSelect {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = { disabled: false, style: { width: '100px', textAlign: 'left' } };
