import React from 'react';
import { App } from '@capacitor/app';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'detect', icon: 'fa-magnifying-glass-chart', label: 'Scanner' },
    { id: 'analytics', icon: 'fa-chart-line', label: 'Trends' },
    { id: 'history', icon: 'fa-clock-rotate-left', label: 'History' },
    { id: 'train', icon: 'fa-microchip', label: 'Training' },
    { id: 'settings', icon: 'fa-sliders', label: 'Model' }
  ];

  return (
    <>
      <div className="bg-animated opacity-100" />
      <div className="h-screen max-w-md mx-auto relative glass-card border-x-0 sm:border-x border-slate-800 overflow-hidden flex flex-col bg-[#020617]">
        <header className="flex-none z-50 p-5 border-b border-green-800/30 shadow-lg transition-all duration-300 bg-[#15803d] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-1 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 bg-gradient-to-r from-green-300 to-emerald-400"></div>
                <div className="w-12 h-12 relative rounded-2xl flex items-center justify-center shadow-xl rotate-3 group-hover:rotate-6 transition-transform duration-300 bg-white text-[#15803d]">
                  <i className="fa-solid fa-dna text-xl animate-pulse"></i>
                </div>
              </div>
              <div>
                <h1 className="font-extrabold leading-tight tracking-tight text-xl text-white">OncoVision AI</h1>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full animate-pulse shadow-[0_0_10px_#86efac] bg-green-300"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-green-100">Multi-Path Neural Engine</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => App.exitApp()}
                className="w-11 h-11 flex items-center justify-center btn-3d-icon group border bg-white text-[#15803d] hover:bg-green-50 border-white/50 shadow-lg"
                title="Exit Application"
              >
                <i className="fa-solid fa-power-off text-lg group-hover:scale-110 transition-transform"></i>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto scrollbar-hide bg-[#020617]">
          <div className="p-5 pb-28 min-h-full">
            {children}
          </div>
        </main>
      </div>

      <div className="fixed bottom-4 left-0 right-0 px-4 flex justify-center z-50 pointer-events-none">
          <nav className="pointer-events-auto backdrop-blur-2xl border p-2 rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5),0_0_20px_rgba(20,184,166,0.2)] grid grid-cols-5 gap-1 w-full max-w-sm ring-1 transition-all duration-300 bg-[#064e3b]/90 border-green-800/50 ring-green-500/20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-2 rounded-2xl transition-all duration-300 border-0 flex flex-col items-center justify-center ${
                activeTab === tab.id 
                  ? 'bg-[#15803d] text-white shadow-[0_6px_0_#14532d,0_15px_20px_rgba(22,101,52,0.4)] -translate-y-2 scale-110 z-10'
                  : 'bg-green-900/20 text-green-200/60 shadow-[0_4px_0_#064e3b] hover:-translate-y-1 hover:shadow-[0_6px_0_#064e3b] hover:text-green-100 hover:bg-green-900/40'
              }`}
            >
              <div className="flex flex-col items-center gap-1 w-full">
                <i className={`fa-solid ${tab.icon} text-lg ${activeTab === tab.id ? 'animate-bounce' : ''}`}></i>
                <span className={`text-[8px] font-black uppercase tracking-widest mt-0.5 w-full text-center truncate ${
                  activeTab === tab.id ? 'opacity-100' : 'opacity-100'
                }`}>
                  {tab.label}
                </span>
              </div>
            </button>
          ))}
          </nav>
      </div>
    </>
  );
};

export default Layout;
