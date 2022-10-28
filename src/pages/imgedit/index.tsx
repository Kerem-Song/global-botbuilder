import { TitleHelmet } from '@components/common/TitleHelmet';
import ImageEditorComponent from '@components/image-editor/ImageCropper';
import { FC } from 'react';

import { PageProvider } from '../../hooks/providers/PageProvider';

export const ImageEditorPage: FC = () => {
  return (
    <PageProvider pageName="imgeditor">
      <TitleHelmet />
      <ImageEditorComponent />
    </PageProvider>
  );
};

export default ImageEditorPage;
