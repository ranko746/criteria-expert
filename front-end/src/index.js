import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';


import theme from './config/theme';
import "./index.css";
import App from "./pages/App.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route exact path="/" element={<App />} />

          <Route path="*" element={<Navigate to="not-found"/>} />
        </Routes>
      </Router>          
    </ThemeProvider>
  </React.StrictMode>
);
