import React, { useState, useEffect } from 'react';

const HistoryView: React.FC = () => {
  return (
    <div className="space-y-6 pb-4 animate-fadeIn perspective-container">
      <div className="bg-[#064e3b]/90 backdrop-blur-lg border border-green-500/20 rounded-3xl p-6 shadow-2xl card-3d">
        <h2 className="text-xl font-bold text-white mb-2">Scan History</h2>
        <p className="text-green-100/70 text-sm mb-6">Recent diagnostic scans and their classification results. Tap to view details.</p>

        <div className="text-center py-10 text-green-200/50">
          <i className="fa-solid fa-clock-rotate-left text-4xl mb-3 opacity-50"></i>
          <p>History is currently unavailable.</p>
        </div>
      </div>
    </div>
  );
};

export default HistoryView;
