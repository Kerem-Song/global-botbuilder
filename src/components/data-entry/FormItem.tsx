import { FC, ReactElement } from 'react';
import { FieldError } from 'react-hook-form';

export interface IFormItemProps {
  error?: FieldError;
  children: ReactElement;
}

export const FormItem: FC<IFormItemProps> = ({ children, error }) => {
  return (
    <div>
      {children}
      <div style={{ color: 'red', padding: '5px 5px 0 5px', height: '21px' }}>
        {error?.message}
      </div>
    </div>
  );
};
// export const FormItem: FC<IFormItemProps> = ({ children, error }) => {
//   const ref = React.createRef<HTMLInputElement>();
//   const clone = React.cloneElement(children, { ref });
//   useEffect(() => {
//     if (ref.current) {
//       if (error) {
//         ref.current.required = true;
//       }
//     }
//   }, [error]);
//   return <>{clone}</>;
// };
