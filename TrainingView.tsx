import React from 'react';
import { TRAINING_STATS, TOTAL_DATASET_COUNT } from '../constants';

const TrainingView: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <header className="mb-8 pt-2">
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">Model Training</span> Center
        </h1>
        <p className="text-green-100/70 font-medium text-lg">
          Deep learning architecture and dataset composition metrics
        </p>
      </header>

      {/* Hero Stats */}
      <div className="card-3d bg-gradient-to-br from-green-700 via-emerald-700 to-teal-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full blur-xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-green-500 opacity-20 rounded-full blur-lg"></div>
        
        <div className="relative z-10 flex flex-col justify-between items-center gap-6">
          <div className="max-w-lg text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              Live Training Node
            </div>
            <h2 className="text-2xl font-black mb-2 leading-tight">Million-Scale <br/>Medical Datasets</h2>
            <p className="text-green-50 text-sm mb-6 opacity-90 max-w-md mx-auto">
              Our models are trained on curated clinical data from global consortiums, ensuring robust generalization.
            </p>
          </div>
          
          <div className="flex gap-4">
             <div className="text-center p-4 bg-white/10 rounded-2xl border border-white/10 w-32 hover:bg-white/20 transition-colors">
                <div className="text-3xl font-black mb-1">{(TOTAL_DATASET_COUNT / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-green-200 uppercase font-bold tracking-wider">Images</div>
             </div>
             <div className="text-center p-4 bg-white/10 rounded-2xl border border-white/10 w-32 hover:bg-white/20 transition-colors">
                <div className="text-3xl font-black mb-1">99.2%</div>
                <div className="text-xs text-green-200 uppercase font-bold tracking-wider">Accuracy</div>
             </div>
          </div>
        </div>
      </div>

      {/* Training Distribution */}
      <div>
        <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2 px-1">
          <i className="fa-solid fa-chart-pie text-green-400"></i>
          Training Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {TRAINING_STATS.map((item, i) => (
            <div key={i} className="card-3d p-5 rounded-3xl relative overflow-hidden group transition-all border border-green-500/10 shadow-lg hover:shadow-xl bg-[#064e3b]/40 backdrop-blur-md">
              {/* Colored Background Accent */}
              <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-300" style={{background: item.color}}></div>
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-[0.05] rounded-bl-full -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-110`} style={{background: item.color}}></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transform group-hover:rotate-6 transition-transform duration-300`} style={{background: item.color, boxShadow: `0 10px 20px -5px ${item.color}60`}}>
                    <i className={`fa-solid ${
                        item.label === 'Breast' ? 'fa-venus' : 
                        item.label === 'Lung' ? 'fa-lungs' : 
                        item.label === 'Prostate' ? 'fa-mars' : 'fa-disease'
                    }`}></i>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-black text-white tracking-tight">{(item.quantity / 1000).toFixed(0)}K</div>
                        <div className="text-[10px] text-green-200/50 font-bold uppercase tracking-wider">Samples</div>
                    </div>
                </div>
                
                <h3 className="text-white text-lg font-bold mb-3">{item.label} Cancer</h3>
                
                <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden mb-5 border border-white/10">
                  <div 
                    className={`h-full rounded-full relative shadow-sm`}
                    style={{ width: `${item.accuracy}%`, background: item.color }}
                  >
                     <div className="absolute inset-0 bg-white/30 animate-shimmer"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-green-200/50">
                    Accuracy: <span style={{color: item.color}}>{item.accuracy}%</span>
                  </div>
                  <button 
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0"
                    style={{background: item.color, boxShadow: `0 4px 10px -2px ${item.color}50`}}
                  >
                    View Metrics
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Training Protocol */}
      <div className="w-full">
        <div className="rounded-3xl p-6 card-3d shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #064e3b, #020617)' }}>
           {/* Decorative Background Elements */}
           <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-emerald-500 rounded-full blur-xl" style={{ opacity: 0.1 }}></div>
           <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-teal-500 rounded-full blur-lg" style={{ opacity: 0.1 }}></div>

          <div className="flex items-center justify-between mb-6 relative z-10">
             <h3 className="text-lg font-bold text-white flex items-center gap-2">
               <span className="flex items-center justify-center w-8 h-8 rounded-lg text-emerald-300" style={{ backgroundColor: 'rgba(52, 211, 153, 0.2)' }}>
                  <i className="fa-solid fa-network-wired text-sm"></i>
               </span>
               Training Protocol
             </h3>
             <span className="px-3 py-1 rounded-full text-emerald-200 text-[10px] font-bold border border-emerald-500/30" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)' }}>
               v4.2.0 Active
             </span>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-6 before:w-0.5 before:bg-emerald-500/20 z-10">
            {[
              { title: "Data Augmentation", desc: "Elastic deformations, rotation, flip", active: true },
              { title: "Feature Extraction", desc: "ResNet-50 backbone (ImageNet)", active: true },
              { title: "Attention Mechanism", desc: "Spatial and channel-wise attention", active: true },
              { title: "Classification Head", desc: "Dense layers with dropout (p=0.5)", active: false }
            ].map((step, i) => (
              <div key={i} className="relative pl-16 group">
                <div className={`absolute left-6 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-[#020617] shadow-md ${step.active ? 'bg-emerald-500 scale-125 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : 'bg-green-800'} z-10 transition-all duration-300`}></div>
                
                <div className="p-4 rounded-2xl border border-emerald-500/10 hover:shadow-lg transition-all duration-300" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                  <h4 className={`font-bold text-sm mb-1 ${step.active ? 'text-emerald-300' : 'text-green-200/50'}`}>
                    {step.title}
                  </h4>
                  <p className="text-green-100/70 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingView;