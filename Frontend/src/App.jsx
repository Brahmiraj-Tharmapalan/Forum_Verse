import React from 'react';
import { MantineProvider } from '@mantine/core';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login/Login';
import Dashboard from './dashboard_user/Main_dashboard';
import Approval from './dashboard_admin/Approval';
import Viewpost from './View_post/Viewpost';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <Router>
              <ToastContainer autoClose={1500}/>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/approval" element={<Approval />} />
          <Route path="view/:viewId" element={<Viewpost />} />

          {/* <Route path="/login/:id" element={<Login />} /> */}
        </Routes>
      </MantineProvider>
    </Router>
  );
}
