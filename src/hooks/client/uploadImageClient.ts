import { useMutation } from '@tanstack/react-query';

import { useHttp } from './../useHttp';
export const imageUploadClient = () => {
  const http = useHttp();

  const imageUploadMutate = useMutation(async ({ formData }: { formData: FormData }) => {
    // for (const value of formData.values()) {
    //   console.log('form data values', value);
    // }
    const res = await http.post(`/builder/uploadimage`, formData);

    if (res) {
      return res;
    }
  });

  return {
    isLoadingImageUpload: imageUploadMutate.isLoading,
    imageUploadAsync: imageUploadMutate.mutateAsync,
  };
};
