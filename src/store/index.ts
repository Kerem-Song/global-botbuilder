import { combineReducers } from '@reduxjs/toolkit';
import { PersistConfig, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import undoable from 'redux-undo';

import authReducer from './authSlice';
import botBuilderReducer from './botbuilderSlice';
import botTesterReducer from './botTesterSlice';
import brandInfoReducer from './brandInfoSlice';
import makingNodeSliceReducer from './makingNode';
import sideBarStatusReducer from './sidebarStatusSlice';
import systemModalReducer from './systemModalSlice';
import utteranceDetailReducer from './utteranceDetailSlice';

const rootReducer = combineReducers({
  authReducer,
  systemModalReducer,
  sideBarStatusReducer,
  brandInfoReducer,
  botBuilderReducer,
  botTesterReducer,
  utteranceDetailReducer,
  makingNodeSliceReducer: undoable(makingNodeSliceReducer, { debug: true, limit: 20 }),
});

type ReducerType = typeof rootReducer;
type CombinedStateType = ReturnType<ReducerType>;

const persistConfig: PersistConfig<CombinedStateType> = {
  key: 'root',
  storage,
  whitelist: ['authReducer', 'utteranceDetailReducer'],
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_REDUX_PERSIST_SECRET_KEY,
      onError: function (error) {
        // Handle the error.
        console.log('error', error);
      },
    }),
  ],
};

export default persistReducer(persistConfig, rootReducer);
