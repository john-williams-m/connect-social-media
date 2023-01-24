import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
// import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
// import storage from 'redux-persist/lib/storage';
// import { PersistGate } from 'redux-persist/integration/react'
import authReducer from './store/authSlice';
import { configureStore } from '@reduxjs/toolkit';
import UIAndContentReducer from './store/ui-content-slice';
// const persistConfig = { key: 'root', storage, version: 1 };
// const persistedReducer = persistReducer(persistConfig, authReducer)
// const store = configureStore({
//   reducer: persistReducer,
//   middleware: (getDefaultMiddleware) => {
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoreActions: [FLUSH, REGISTER, REHYDRATE, PAUSE, PERSIST, PURGE],
//       }
//     })
//   }
// })
const store = configureStore({
  reducer: { auth: authReducer, UIAndContent: UIAndContentReducer }
})
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    {/* <PersistGate loading={null} persistor={persistStore(store)}> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </PersistGate> */}
  </Provider>
);

