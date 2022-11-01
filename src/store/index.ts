import { combineReducers } from '@reduxjs/toolkit';
import { PersistConfig, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import authReducer from './authSlice';
import sideBarStatusReducer from './sidebarStatusSlice';
import systemModalReducer from './systemModalSlice';

const rootReducer = combineReducers({
  authReducer,
  systemModalReducer,
  sideBarStatusReducer,
});

type ReducerType = typeof rootReducer;
type CombinedStateType = ReturnType<ReducerType>;

const persistConfig: PersistConfig<CombinedStateType> = {
  key: 'root',
  storage,
  whitelist: ['authReducer', 'systemModalReducer'],
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
