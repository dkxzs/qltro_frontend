import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import { combineReducers } from "redux";
import inforReducer from "./slices/inforSlice";
import contractReducer from "./slices/contractSlice";

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

// Tạo reducers có persist
const rootReducer = combineReducers({
  user: persistReducer(userPersistConfig, userReducer),
  inforConfig: persistReducer(inforPersistConfig, inforReducer),
  contractConfig: persistReducer(contractPersistConfig, contractReducer),
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
