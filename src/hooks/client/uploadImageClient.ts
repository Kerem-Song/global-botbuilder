import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { string } from 'yup';

import { useHttp } from './../useHttp';
export const imageUploadClient = () => {
  const http = useHttp();

  const imageUploadMutate = useMutation(
    async ({ token, flowId }: { token: string; flowId: string }) => {
      const res = await http.post('/builder/uploadimage', {
        sessionToken: token,
        flowId,
      });

      if (res) {
        return res;
      }
    },
  );

  return {
    imageUploadAsync: imageUploadMutate.mutateAsync,
  };
};
