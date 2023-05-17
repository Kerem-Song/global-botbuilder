import { INodeEditModel } from '@models';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { editNode } from './makingNode';

const editNodeAsync = createAsyncThunk<void, INodeEditModel>(
  'edit_with_save',
  async (payload, thunkApi) => {
    thunkApi.dispatch(editNode(payload));
  },
);

export default editNodeAsync;
