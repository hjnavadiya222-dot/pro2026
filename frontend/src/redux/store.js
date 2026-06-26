import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage for web
import { persistStore, persistReducer } from "redux-persist";
import authReducer from "./authSlice"; // Import the auth slice

// Persist config
const persistConfig = {
  key: "root", // Key for localStorage
  storage, // Storage type
};

// Create a persisted reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Use persisted reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required to avoid warnings with redux-persist
    }),
});

export const persistor = persistStore(store); // Persistor instance
export default store;
