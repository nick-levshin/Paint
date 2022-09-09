import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import App from './App';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/:id" element={<App />} />
          <Route
            path="*"
            element={<Navigate to={`f${(+new Date()).toString(16)}`} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default AppRouter;
