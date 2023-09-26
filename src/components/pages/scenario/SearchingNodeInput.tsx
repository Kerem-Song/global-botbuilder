import { Autocomplete } from '@components/data-entry/Autocomplete';
import { usePage, useRootState } from '@hooks';
import { INode } from '@models';
import { useController, useForm } from 'react-hook-form';

export const SearchingNodeInput = ({ nodes }: { nodes: INode[] }) => {
  const { t } = usePage();

  const { control } = useForm();
  const { field } = useController({ name: 'searchingNode', control });

  const canvas = document.querySelector('.canvasWrapper') as HTMLDivElement;
  const scale = useRootState((state) => state.botBuilderReducer.scale);

  return (
    <Autocomplete
      items={nodes}
      displayName="title"
      placeholder={t(`SEARCHING_NODE_INPUT_PLACEHOLDER`)}
      defaultValue={nodes.find((x) => x.title === field.value)}
      onChangeValue={(value) => {
        if (value) {
          canvas.style.left =
            -value.x + canvas.getBoundingClientRect().width / 2 - 200 / scale + 'px';
          canvas.style.top =
            -value.y + canvas.getBoundingClientRect().height / 2 - 200 / scale + 'px';
        }
      }}
      onChange={field.onChange}
    />
  );
};
