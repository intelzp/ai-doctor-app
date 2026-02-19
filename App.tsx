import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './src/components/Layout';
import Consultation from './src/pages/Consultation';
import SkinAnalysis from './src/pages/SkinAnalysis';
import Appointments from './src/pages/Appointments';
import Profile from './src/pages/Profile';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Consultation />} />
          <Route path="skin-analysis" element={<SkinAnalysis />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
