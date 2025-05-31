import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import accountReducer from "./slices/accountSlice";
import contractReducer from "./slices/contractSlice";
import inforReducer from "./slices/inforSlice";
import userReducer from "./slices/userSlice";

const userPersistConfig = {
  key: "user",
  storage,
};

const inforPersistConfig = {
  key: "infor",
  storage,
};

const contractPersistConfig = {
  key: "contract",
  storage,
};

const accountPersistConfig = {
  key: "account",
  storage,
};

// Tạo reducers có persist
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  inforConfig: persistReducer(inforPersistConfig, inforReducer),
  contractConfig: persistReducer(contractPersistConfig, contractReducer),
  account: persistReducer(accountPersistConfig, accountReducer),
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
