import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css'
import PrivacyPage from './PrivacyPage';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Main from './Main';
import Home from './Home';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main></Main>,
    },
    {
      path: "/privacy-policy",
      element: <PrivacyPage></PrivacyPage>
    }
  ]);

  return (
    <>
        <RouterProvider router={router} />
    </>
  );
}

export default App;
