
import React from 'react';
import { MODELS } from '../constants';

interface SettingsViewProps {
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ selectedModelId, setSelectedModelId }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="bg-[#064e3b]/80 backdrop-blur-md border border-green-500/20 rounded-3xl p-8 card-3d relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Neural Engine</span>
        </h2>
        <p className="text-green-100/70 font-medium text-sm mb-8 max-w-md">
          Select specialized AI architectures optimized for specific diagnostic modalities.
        </p>

        <div className="space-y-5">
          {MODELS.map((model) => (
            <div 
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer relative group overflow-hidden ${
                selectedModelId === model.id 
                  ? 'border-transparent bg-gradient-to-r from-green-900/40 to-emerald-900/40 shadow-lg shadow-green-900/20 scale-[1.02]' 
                  : 'border-white/5 bg-white/5 hover:border-green-500/30 hover:bg-white/10 hover:shadow-md'
              }`}
            >
              {/* Active Border Gradient */}
              {selectedModelId === model.id && (
                 <div className="absolute inset-0 border-2 border-transparent bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl [mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:xor] [mask-composite:exclude] opacity-50 pointer-events-none"></div>
              )}

              <div className="flex justify-between items-start mb-3 relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-colors duration-300 ${
                    selectedModelId === model.id 
                      ? 'bg-gradient-to-br from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/30' 
                      : 'bg-white/10 text-green-200/50 group-hover:bg-white/20 group-hover:text-green-400 group-hover:shadow-md'
                  }`}>
                    <i className={`fa-solid ${
                      model.id === 'onconet-x' ? 'fa-brain' : model.id === 'biopath-a1' ? 'fa-dna' : 'fa-bolt'
                    }`}></i>
                  </div>
                  <div>
                    <h3 className={`font-black tracking-tight text-lg ${selectedModelId === model.id ? 'text-white' : 'text-green-100'}`}>
                      {model.name}
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          selectedModelId === model.id ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-green-200/50'
                       }`}>
                         v{model.version || '2.4.0'}
                       </span>
                    </div>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                  selectedModelId === model.id ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'bg-white/10 text-green-200/50'
                }`}>
                  <i className="fa-solid fa-crosshairs text-[10px]"></i>
                  {model.accuracy}
                </div>
              </div>
              
              <p className={`text-sm leading-relaxed pr-10 relative z-10 ${selectedModelId === model.id ? 'text-green-100/90 font-medium' : 'text-green-200/50'}`}>
                {model.description}
              </p>
              
              <div className={`absolute bottom-6 right-6 transition-all duration-500 ${
                selectedModelId === model.id ? 'scale-110 opacity-100 translate-x-0' : 'scale-50 opacity-0 translate-x-4'
              }`}>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30">
                  <i className="fa-solid fa-check text-sm"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-3d bg-[#064e3b] rounded-3xl p-8 shadow-2xl text-white relative overflow-hidden group border border-green-500/20">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/50 via-[#064e3b] to-[#020617]"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-emerald-600 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-700"></div>
        
        <div className="relative z-10">
            <h3 className="font-black text-xl mb-8 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg backdrop-blur-sm border border-green-500/30">
                <i className="fa-solid fa-gears text-green-400"></i>
            </div>
            Engine Configuration
            </h3>
            
            <div className="space-y-6">
            <div className="flex items-center justify-between group/item cursor-pointer">
                <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-green-300 group-hover/item:bg-green-500/20 group-hover/item:text-green-200 group-hover/item:border-green-500/30 transition-all shadow-inner">
                    <i className="fa-solid fa-volume-high"></i>
                </div>
                <div>
                    <span className="block text-base font-bold text-white group-hover/item:text-green-200 transition-colors">Vocal Synthesis</span>
                    <span className="text-[10px] text-green-200/50 font-bold uppercase tracking-widest group-hover/item:text-green-400/70">Auto-Speech Reports</span>
                </div>
                </div>
                <div className="w-14 h-7 bg-green-600 rounded-full relative shadow-inner transition-colors group-hover/item:bg-green-500">
                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform group-hover/item:scale-110"></div>
                </div>
            </div>

            <div className="w-full h-px bg-green-900/30"></div>

            <div className="flex items-center justify-between group/item opacity-50 cursor-not-allowed grayscale">
                <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-rose-300">
                    <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                    <span className="block text-base font-bold text-white">Biometric Vault</span>
                    <span className="text-[10px] text-green-200/50 font-bold uppercase tracking-widest">Protected Environment</span>
                </div>
                </div>
                <div className="w-14 h-7 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 w-5 h-5 bg-slate-500 rounded-full shadow-md"></div>
                </div>
            </div>

            <div className="w-full h-px bg-green-900/30"></div>

            <div className="flex items-center justify-between group/item cursor-pointer">
                <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-300 group-hover/item:bg-emerald-500/20 group-hover/item:text-emerald-200 group-hover/item:border-emerald-500/30 transition-all shadow-inner">
                    <i className="fa-solid fa-server"></i>
                </div>
                <div>
                    <span className="block text-base font-bold text-white group-hover/item:text-emerald-200 transition-colors">Edge Processing</span>
                    <span className="text-[10px] text-green-200/50 font-bold uppercase tracking-widest group-hover/item:text-emerald-400/70">Low Latency Analysis</span>
                </div>
                </div>
                <div className="w-14 h-7 bg-emerald-600 rounded-full relative shadow-inner transition-colors group-hover/item:bg-emerald-500">
                <div className="absolute right-1 top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform group-hover/item:scale-110"></div>
                </div>
            </div>
            </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3 pt-6">
        <div className="flex items-center gap-2 px-5 py-2 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20 shadow-lg shadow-emerald-500/5 backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Live: Secure Connection</span>
        </div>
        <p className="text-[10px] text-green-200/30 font-bold uppercase tracking-widest opacity-60">OncoVision AI v2.5.0-Stable Build</p>
      </div>
    </div>
  );
};

export default SettingsView;
