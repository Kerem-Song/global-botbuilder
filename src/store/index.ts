import { combineReducers } from '@reduxjs/toolkit';
import { PersistConfig, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import undoable from 'redux-undo';

import authReducer from './authSlice';
import botBuilderReducer from './botbuilderSlice';
import botInfoReducer from './botInfoSlice';
import botTesterReducer from './botTesterSlice';
import brandInfoReducer from './brandInfoSlice';
import historyInfoReducer from './historyInfoSlice';
import intentListReducer from './intentListSlice';
import intentReducer from './intentSlice';
import makingNodeSliceReducer from './makingNode';
import sideBarStatusReducer from './sidebarStatusSlice';
import systemModalReducer from './systemModalSlice';
import userInfoReducer from './userInfSlice';

const rootReducer = combineReducers({
  authReducer,
  userInfoReducer,
  systemModalReducer,
  sideBarStatusReducer,
  brandInfoReducer,
  botBuilderReducer,
  botInfoReducer,
  botTesterReducer,
  intentReducer,
  intentListReducer,
  makingNodeSliceReducer: undoable(makingNodeSliceReducer, { debug: true, limit: 20 }),
  historyInfoReducer,
});

type ReducerType = typeof rootReducer;
type CombinedStateType = ReturnType<ReducerType>;

const persistConfig: PersistConfig<CombinedStateType> = {
  key: 'root',
  storage,
  whitelist: ['authReducer', 'brandInfoReducer', 'userInfoReducer'],
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
