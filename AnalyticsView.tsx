
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { TRAINING_STATS } from '../constants';

const AnalyticsView: React.FC = () => {
  const pieData = TRAINING_STATS.map(s => ({ name: s.label, value: s.quantity }));

  return (
    <div className="space-y-6 pb-4 animate-fadeIn perspective-container">
      <div className="glass-dark rounded-3xl p-6 shadow-2xl card-3d">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Diagnostic Analytics</h2>
        <p className="text-slate-500 text-sm mb-6">Global performance metrics across multi-organ detection models.</p>

        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TRAINING_STATS}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis 
                dataKey="label" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12}} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#64748b', fontSize: 12}} 
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip 
                cursor={{fill: 'rgba(0,0,0,0.05)'}}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px', 
                  border: '1px solid rgba(0,0,0,0.05)', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  color: '#1e293b'
                }}
              />
              <Bar dataKey="accuracy" radius={[8, 8, 0, 0]} barSize={40} animationDuration={1500}>
                {TRAINING_STATS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">Model Precision vs Cancer Category</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-dark rounded-3xl p-5 shadow-lg border border-indigo-500/10 flex flex-col items-center justify-center text-center card-3d">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 rounded-full flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <i className="fa-solid fa-heart-pulse animate-pulse"></i>
          </div>
          <span className="text-2xl font-black text-slate-800">98.8%</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Avg Sensitivity</span>
        </div>
        <div className="glass-dark rounded-3xl p-5 shadow-lg border border-emerald-500/10 flex flex-col items-center justify-center text-center card-3d">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <span className="text-2xl font-black text-slate-800">1.2M+</span>
          <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Lives Impacted</span>
        </div>
      </div>

      <div className="rounded-3xl p-6 shadow-xl border border-indigo-500/20 relative overflow-hidden card-3d" style={{ backgroundColor: '#1a103c' }}>
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 bg-purple-600 rounded-full blur-3xl" style={{ opacity: 0.2 }}></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-indigo-600 rounded-full blur-2xl" style={{ opacity: 0.2 }}></div>

        <div className="absolute top-0 right-0 p-6 opacity-5">
           <i className="fa-solid fa-chart-pie text-9xl text-white transform rotate-12"></i>
        </div>
        <h3 className="font-bold mb-4 relative z-10 text-white flex items-center gap-2">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg text-indigo-300" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)' }}>
            <i className="fa-solid fa-chart-pie text-sm"></i>
          </span>
          Training Distribution
        </h3>
        <div className="h-[200px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {TRAINING_STATS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(6, 78, 59, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-y-2 mt-2 relative z-10">
          {TRAINING_STATS.map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full shadow-[0_0_5px_currentColor]" style={{backgroundColor: stat.color, color: stat.color}}></div>
              <span className="text-xs text-green-200">{stat.label}: {(stat.quantity / 1000000).toFixed(1)}M</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
