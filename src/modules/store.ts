import { configureStore } from '@reduxjs/toolkit';
import { persistStore } from 'redux-persist';

import rootReducer from '../store';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
const persistor = persistStore(store);

export { persistor, store };
