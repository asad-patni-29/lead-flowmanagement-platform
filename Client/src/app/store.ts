import { configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer, persistStore } from 'redux-persist';
import rootReducer from './rootReducer';
import { REDUX_PERSISTENT_STORE_KEY, SliceNames } from '@/constants/redux-constant';
import apiMiddleware from '@/middleware/api-middleware';

const storageWrapper = {
  getItem: (key: string): Promise<string | null> => {
    try {
      return Promise.resolve(localStorage.getItem(key));
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return Promise.resolve(null);
    }
  },
  setItem: (key: string, value: string): Promise<void> => {
    try {
      localStorage.setItem(key, value);
      return Promise.resolve();
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
      return Promise.resolve();
    }
  },
  removeItem: (key: string): Promise<void> => {
    try {
      localStorage.removeItem(key);
      return Promise.resolve();
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
      return Promise.resolve();
    }
  },
};

const persistConfig = {
  key: REDUX_PERSISTENT_STORE_KEY,
  storage: storageWrapper,
  whitelist: [SliceNames.AUTH],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiMiddleware),
  devTools: true,
});

export const persistor = persistStore(store);

import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, unknown, UnknownAction>;
