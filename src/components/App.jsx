import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/App.css'
import PrivacyPage from './PrivacyPage';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './Main';
import DeletePage from './DeletePage';

function App() {

  return (
    <>
      <Router>
        <div className="contaier">
          <div className="main">
            <Routes>
                <Route path="/" element={<Main />}/>
                <Route path="/account-delete" element={<DeletePage />}/>
                <Route path="/privacy-policy" element={<PrivacyPage />}/>
            </Routes>
          </div>
        </div>
      </Router>
    </>
  );
}

export default App;
