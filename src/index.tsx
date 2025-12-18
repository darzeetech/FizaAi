import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';

import reportWebVitals from './reportWebVitals';
import { store } from './store';

import GlobalStyle from './GlobalStyle';
import { Toaster } from './ui-component';
//import { Text } from './ui-component';
import App from './App';

import './index.css';

/* 🔹 SAFETY CHECK: clear stale auth BEFORE React renders */
const safeBootstrapAuth = () => {
  try {
    const token = localStorage.getItem('userToken') || localStorage.getItem('token');

    const refreshToken = localStorage.getItem('refreshToken');

    // ❌ Partial / broken auth → clear everything
    if (!token || !refreshToken) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userToken');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userDetails');
      localStorage.removeItem('boutique_id');
    }
  } catch {
    // Absolute fallback
    localStorage.clear();
  }
};

// ✅ Run BEFORE app mounts
safeBootstrapAuth();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <div id="turn">
        <Text size="xxxl" className="text">
          Please turn your device to use the app.
        </Text>
      </div> */}
      <App />
      {/* <RouterProvider router={routes} /> */}
      <GlobalStyle />
      <Toaster />
      {/* <App /> */}
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
