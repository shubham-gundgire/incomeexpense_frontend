import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Error from './pages/Error';
import Main from './pages/Main';
import Charts from './components/nestedcomp/Charts';
import Income from './components/nestedcomp/Income';
import Expense from './components/nestedcomp/Expense';
import Profile from './components/nestedcomp/Profile';
import Homedash from './components/nestedcomp/Homedash';
import { RecoilRoot } from 'recoil';
import './css/index.css';
ReactDOM.render(
  <RecoilRoot>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Main />}>
          <Route path="/dashboard/" element={<Homedash />} />
          <Route path="/dashboard/charts" element={<Charts />} />
          <Route path="/dashboard/income" element={<Income />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/expense" element={<Expense />} />
        </Route>
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  </RecoilRoot>,

  document.getElementById("root")
);
