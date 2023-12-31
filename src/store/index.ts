import { AnyAction, combineReducers } from '@reduxjs/toolkit';
import { PersistConfig, persistReducer } from 'redux-persist';
import storageLocal from 'redux-persist/lib/storage';
import storage from 'redux-persist/lib/storage/session';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import undoable from 'redux-undo';

import authReducer from './authSlice';
import botBuilderReducer, { BotBuilderMaker } from './botbuilderSlice';
import botInfoReducer from './botInfoSlice';
import botSettingInfoReducer from './botSettingInfoSlice';
import botTesterReducer from './botTesterSlice';
import brandInfoReducer from './brandInfoSlice';
import historyInfoReducer from './historyInfoSlice';
import intentListReducer from './intentListSlice';
import intentReducer from './intentSlice';
import makingNodeSliceReducer from './makingNode';
import otherFlowScenariosPopupStatusReducer from './otherFlowScenarioPopupSlice';
import scenarioListPopupReducer from './scenarioListPopupSlice';
import sideBarStatusReducer from './sidebarStatusSlice';
import systemModalReducer from './systemModalSlice';
import userInfoReducer from './userInfoSlice';

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

const localPersistConfig: PersistConfig<BotBuilderMaker> = {
  key: 'local',
  storage: storageLocal,
  whitelist: ['isBezierMode'],
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

const rootReducer = combineReducers({
  authReducer,
  userInfoReducer,
  systemModalReducer,
  sideBarStatusReducer,
  brandInfoReducer,
  botBuilderReducer: persistReducer(localPersistConfig, botBuilderReducer),
  botInfoReducer,
  botSettingInfoReducer,
  botTesterReducer,
  intentReducer,
  intentListReducer,
  makingNodeSliceReducer: undoable(makingNodeSliceReducer, {
    debug: true,
    limit: 20,
  }),
  historyInfoReducer,
  otherFlowScenariosPopupStatusReducer,
  scenarioListPopupReducer,
});

export default persistReducer(persistConfig, rootReducer);
