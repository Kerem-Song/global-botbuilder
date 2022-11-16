import '../styles/inputTextarea.scss';

import { ComponentMeta, ComponentStory } from '@storybook/react';

import { InputTextarea } from '../components/data-entry/InputTextarea';
import { IDataEntryProp } from '../models/interfaces/IDataEntryProp';
import { IHasClassNameNStyle } from '../models/interfaces/IHasStyle';

export default {
  title: 'Example/InputTextarea',
  component: InputTextarea,
  argTypes: {},
} as ComponentMeta<typeof InputTextarea>;

const Template: ComponentStory<typeof InputTextarea> = (
  args: IHasClassNameNStyle & IDataEntryProp,
) => (
  <div>
    <InputTextarea {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  disabled: false,
  style: {
    position: 'absolute',
    top: '26px',
    left: '200px',
    fontSize: '13px',
    color: 'gray',
  },
};
