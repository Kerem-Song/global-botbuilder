import { combineReducers } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session';
import { encryptTransform } from 'redux-persist-transform-encrypt';

import authReducer from './authSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['authReducer'],
  transforms: [
    encryptTransform({
      secretKey: import.meta.env.VITE_REDUX_PERSIST_SECRET_KEY,
      onError: function (error) {
        // Handle the error.
      },
    }),
  ],
};

const rootReducer = combineReducers({
  authReducer,
});

export default persistReducer(persistConfig, rootReducer);
