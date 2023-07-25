import { TitleHelmet } from '@components';
import ImageEditorComponent from '@components/image-editor/ImageCropper';
import { PageProvider } from '@hooks';
import { FC } from 'react';

export const ImageEditorPage: FC = () => {
  return (
    <PageProvider pageName="imgeditor">
      <TitleHelmet />
      <ImageEditorComponent />
    </PageProvider>
  );
};

export default ImageEditorPage;
