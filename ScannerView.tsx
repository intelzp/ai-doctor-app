
import React, { useState, useRef } from 'react';
import { analyzeMedicalImage, speakReport, stopSpeech } from '../services/geminiService';
import { DetectionResult } from '../types';
import { MODELS } from '../constants';
import { Share } from '@capacitor/share';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { jsPDF } from 'jspdf';

interface ScannerViewProps {
  selectedModelId: string;
}

const ScannerView: React.FC<ScannerViewProps> = ({ selectedModelId }) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleShare = async () => {
    if (!result) return;
    
    const dateStr = new Date().toLocaleDateString();
    const shareText = `OncoVision AI Report\n\nDate: ${dateStr}\nDiagnosis: ${result.diagnosis}\nType: ${result.detectedType}\nRisk Level: ${result.riskLevel}\nConfidence: ${(result.confidence * 100).toFixed(1)}%\n\nFindings:\n${result.findings ? result.findings.map(f => `- ${f}`).join('\n') : 'No findings recorded.'}\n\nFull Report:\n${result.report}`;

    try {
      await Share.share({
        title: `OncoVision AI Report - ${result.diagnosis}`,
        text: shareText,
        dialogTitle: 'Share Diagnostic Report',
      });
    } catch (error) {
      console.log('Native share failed, attempting clipboard fallback', error);
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Sharing unavailable in browser. Report copied to clipboard instead!');
      } catch (clipboardError) {
        console.error('Clipboard copy failed', clipboardError);
        alert('Could not share report.');
      }
    }
  };

  const handleExportPDF = async () => {
    if (!result) return;
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();
    
    // Header
    doc.setFillColor(21, 128, 61); // #15803d Green
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text("OncoVision AI", 20, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text("Diagnostic Report", 20, 30);
    
    // Content
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated on: ${dateStr}`, 20, 50);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Scan Details", 20, 65);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Diagnosis: ${result.diagnosis}`, 20, 75);
    doc.text(`Type: ${result.detectedType}`, 20, 82);
    doc.text(`Risk Level: ${result.riskLevel}`, 20, 89);
    doc.text(`Confidence: ${(result.confidence * 100).toFixed(1)}%`, 20, 96);
    doc.text(`Date: ${dateStr}`, 20, 103);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Clinical Findings", 20, 120);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    let yPos = 130;
    if (result.findings && result.findings.length > 0) {
      result.findings.forEach((finding) => {
        doc.text(`• ${finding}`, 25, yPos);
        yPos += 7;
      });
    } else {
        doc.text("No specific findings recorded.", 25, yPos);
        yPos += 7;
    }
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Analysis Report", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(60, 60, 60);
    const splitText = doc.splitTextToSize(result.report, 170);
    doc.text(splitText, 20, yPos);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("OncoVision AI is an experimental diagnostic tool. Please verify with a certified pathologist.", 105, 280, { align: 'center' });
    
    const fileName = `oncovision-report-${Date.now()}.pdf`;

    if (Capacitor.isNativePlatform()) {
      try {
        const base64PDF = doc.output('datauristring').split(',')[1];
        
        const fileResult = await Filesystem.writeFile({
          path: fileName,
          data: base64PDF,
          directory: Directory.Cache,
        });

        await Share.share({
          title: `OncoVision Report`,
          text: `Diagnostic Report for ${result.diagnosis}`,
          url: fileResult.uri,
          dialogTitle: 'Share PDF Report'
        });

      } catch (error) {
        console.error('Error exporting PDF on device:', error);
        alert('Could not export PDF on device. ' + error);
      }
    } else {
      doc.save(fileName);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
        setResult(null);
        setIsSpeaking(false);
        stopSpeech();
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setLoading(true);
    stopSpeech();
    setIsSpeaking(false);
    try {
      const base64Data = image.split(',')[1];
      const selectedModel = MODELS.find(m => m.id === selectedModelId);
      const data = await analyzeMedicalImage(base64Data, selectedModel?.geminiModel || MODELS[0].geminiModel);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error analyzing image. Please ensure your API key is valid.");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else if (result) {
      setIsSpeaking(true);
      speakReport(result.report, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn perspective-container pb-48">
      {/* Header */}
      <header className="mb-8 relative z-40 bg-[#064e3b]/90 backdrop-blur-lg py-5 px-6 rounded-[36px] shadow-[0_20px_40px_-10px_rgba(6,78,59,0.4)] border border-green-500/20 ring-1 ring-green-500/10 transition-all mx-1">
        <div className="flex items-start gap-5 mb-3">
          <div className="w-16 h-16 bg-white/10 rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-green-900/20 flex-shrink-0 transform transition-transform hover:scale-105 duration-300 ring-4 ring-white/10">
            <i className="fa-solid fa-bolt-lightning text-3xl drop-shadow-md text-yellow-300"></i>
          </div>
          <div className="pt-1">
            <h2 className="text-2xl font-black text-white leading-none mb-2 tracking-tight">Advanced Auto-Scan</h2>
            <p className="text-green-100 text-[11px] font-black uppercase tracking-[0.2em] bg-white/10 inline-block px-3 py-1 rounded-lg border border-white/10">Neural Tissue Classification</p>
          </div>
        </div>
        <p className="text-green-100/80 text-[13px] leading-relaxed font-semibold pl-1 max-w-md opacity-90">
          Upload any tissue scan for instantaneous classification and risk assessment using our multi-modal neural network.
        </p>
      </header>

      <div className="bg-[#064e3b]/80 backdrop-blur-lg rounded-[40px] p-3 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] border border-green-500/20">
        <div className="bg-gradient-to-br from-[#065f46] via-[#047857] to-[#065f46] rounded-[32px] p-6 relative overflow-hidden group border border-white/10 shadow-inner">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <i className="fa-solid fa-dna text-9xl text-white transform rotate-12"></i>
        </div>
        
        <div 
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`w-full rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden relative group z-10 ${
            image ? 'border-transparent shadow-2xl ring-4 ring-white/20' : 'aspect-[4/3] border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 hover:shadow-xl hover:shadow-green-900/20 active:bg-white/20 active:border-white/50 active:scale-[0.98] transition-all'
          }`}
        >
          {image ? (
            <>
              <img src={image} alt="Scan" className="w-full h-auto object-cover" />
                  {loading && (
                    <div className="absolute inset-0 bg-[#064e3b]/80 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center overflow-hidden scanner-overlay">
                      {/* Scanning Beam */}
                      <div className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent shadow-[0_0_20px_#4ade80] animate-scan z-30"></div>
                      
                      {/* Pulse Rings */}
                      <div className="relative z-40">
                        <div className="absolute inset-0 rounded-full border-4 border-green-400/30 animate-ping opacity-75"></div>
                        <div className="w-20 h-20 rounded-full border-4 border-green-400 border-t-transparent animate-spin shadow-[0_0_30px_rgba(74,222,128,0.5)] bg-[#064e3b]/50 backdrop-blur-md"></div>
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                           <i className="fa-solid fa-brain text-white text-xl animate-pulse"></i>
                        </div>
                      </div>
                      
                      <div className="mt-8 text-center relative z-40 bg-[#064e3b]/90 px-6 py-2 rounded-2xl border border-green-400/30 shadow-lg backdrop-blur-xl">
                        <span className="text-white text-xs font-black uppercase tracking-[0.2em] animate-pulse block mb-1">Processing Voxels</span>
                        <span className="text-[10px] text-green-300 font-bold">Neural Network Analysis</span>
                      </div>
                    </div>
                  )}
              {!loading && result?.affectedAreas && result.affectedAreas.map((area, idx) => (
                <div 
                  key={idx} 
                  className="affected-area-marker" 
                  style={{ left: `${area.x}%`, top: `${area.y}%` }}
                >
                  <div className="affected-area-label">{area.label}</div>
                </div>
              ))}
              {!loading && !result && (
                <div className="flex gap-3 animate-slideUp max-w-md mx-auto mt-6">
                  <button 
                    onClick={(e) => { e.stopPropagation(); startAnalysis(); }}
                    className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-600/30 active:scale-95 transition-all"
                  >
                    Initiate Diagnosis
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setImage(null);
                      stopSpeech();
                      setIsSpeaking(false);
                    }}
                    className="w-14 bg-rose-100 backdrop-blur rounded-2xl text-rose-500 flex items-center justify-center shadow-lg active:scale-95 transition-all border border-rose-200"
                  >
                    <i className="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-white/10 rounded-[24px] shadow-lg flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-white/30 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                <i className="fa-solid fa-cloud-arrow-up text-3xl"></i>
              </div>
              <p className="text-sm font-black text-white/60 uppercase tracking-wider group-hover:text-white transition-colors">Tap to Import Scan</p>
              <p className="text-[10px] text-green-200 font-bold mt-2 bg-white/10 px-3 py-1 rounded-full border border-white/10">DICOM • MRI • CT • PET</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
            accept="image/*"
          />
        </div>
      </div>
      {!loading && result?.affectedAreas && result.affectedAreas.length > 0 && (
        <div className="mt-4 bg-[#064e3b] rounded-2xl border border-green-500/20 p-3">
          <span className="text-[10px] text-green-300 uppercase font-black tracking-widest">Affected Regions</span>
          <div className="mt-2 grid grid-cols-1 gap-2">
            {result.affectedAreas.map((area, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs text-white bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                <span className="font-bold">{area.label}</span>
                <span className="text-green-300">{Math.round(area.x)}%, {Math.round(area.y)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {result && (
        <div className="bg-[#064e3b]/95 backdrop-blur-xl rounded-[32px] p-7 shadow-2xl border border-green-500/20 space-y-5 animate-slideUp relative overflow-hidden card-3d">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <i className={`fa-solid ${
              result.detectedType === 'Breast' ? 'fa-venus' : 
              result.detectedType === 'Lung' ? 'fa-lungs' : 
              result.detectedType === 'Prostate' ? 'fa-mars' : 'fa-disease'
            } text-8xl text-white`}></i>
          </div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                result.riskLevel === 'Low' ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-emerald-500/30' : 
                result.riskLevel === 'Moderate' ? 'bg-gradient-to-br from-amber-500 to-amber-700 shadow-amber-500/30' : 'bg-gradient-to-br from-rose-500 to-rose-700 shadow-rose-500/30'
              }`}>
                <i className={`fa-solid ${result.status === 'malignant' ? 'fa-biohazard' : 'fa-microscope'} text-2xl animate-pulse`}></i>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg leading-tight">{result.diagnosis || `${result.detectedType} Analysis`}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-full border border-white/10">
                    <span className="text-[10px] font-bold text-green-200 uppercase tracking-wider">Type:</span>
                    <span className="text-[11px] font-black text-white uppercase tracking-widest">
                      {result.detectedType}
                    </span>
                  </div>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold border uppercase tracking-wider ${
                    result.status === 'malignant' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : 
                    result.status === 'benign' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                    'bg-slate-500/20 text-slate-300 border-slate-500/30'
                  }`}>
                    {result.status || 'Processed'}
                  </span>
                </div>
              </div>
            </div>
            <button 
              onClick={handleSpeech}
              className={`w-12 h-12 btn-3d-icon rounded-2xl flex items-center justify-center border transition-all ${
                isSpeaking 
                  ? 'bg-rose-500 text-white border-rose-400 animate-pulse shadow-lg shadow-rose-500/30' 
                  : 'bg-white/20 text-green-400 border-white/30 hover:bg-white/30 backdrop-blur-md shadow-lg shadow-green-500/10'
              }`}
            >
              <i className={`fa-solid ${isSpeaking ? 'fa-circle-stop' : 'fa-volume-high'} text-lg`}></i>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-green-200 uppercase font-black tracking-widest">Malignancy Risk</span>
              <p className={`text-xl font-black mt-1 ${
                result.riskLevel === 'Low' ? 'text-emerald-400' : 
                result.riskLevel === 'Moderate' ? 'text-amber-400' : 'text-rose-400'
              }`}>{result.riskLevel}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <span className="text-[10px] text-green-200 uppercase font-black tracking-widest">AI Confidence</span>
              <p className={`text-xl font-black mt-1 ${
                  result.confidence > 0.9 ? 'text-emerald-400' : 
                  result.confidence > 0.7 ? 'text-amber-400' : 'text-slate-400'
              }`}>{(result.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black text-green-200 uppercase tracking-[0.2em]">Diagnostic Findings</h4>
            <div className="grid grid-cols-1 gap-2">
              {result.findings && result.findings.length > 0 ? (
                result.findings.map((finding, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-white font-medium bg-white/5 p-3 rounded-xl border border-white/10 hover:border-white/30 transition-colors">
                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <i className="fa-solid fa-check text-[10px] text-green-300"></i>
                    </div>
                    {finding}
                  </div>
                ))
              ) : (
                <p className="text-sm text-green-300 italic">No specific findings listed.</p>
              )}
            </div>
          </div>

          <div className="p-5 bg-gradient-to-br from-green-800 to-emerald-900 rounded-[24px] shadow-xl shadow-green-900/20 text-white relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <i className="fa-solid fa-quote-left absolute top-3 left-3 opacity-20 text-xl"></i>
            <p className="text-sm leading-relaxed font-semibold italic text-green-50 relative z-10">
              {result.report}
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 mb-4">
            <button 
              onClick={handleExportPDF}
              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-green-100 text-xs font-bold hover:bg-white/10 transition-colors shadow-sm"
            >
              <i className="fa-solid fa-file-pdf mr-2 text-rose-400"></i>
              Export PDF
            </button>
            <button 
              onClick={handleShare}
              className="flex-1 py-3 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
            >
              <i className="fa-solid fa-share-nodes mr-2"></i>
              Share
            </button>
          </div>

          <button 
            onClick={() => {
              setResult(null);
              stopSpeech();
              setIsSpeaking(false);
            }}
            className="w-full btn-3d-primary bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/30 text-xs tracking-widest border border-rose-400/30 hover:shadow-rose-500/50"
          >
            Reset Analysis Module
          </button>
        </div>
      )}

      {!result && !loading && (
        <div className="p-5 bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#064e3b] backdrop-blur-xl rounded-[24px] border border-green-500/20 flex gap-5 card-3d shadow-xl shadow-green-900/20 group hover:border-green-400/30 transition-all duration-300">
          <div className="w-12 h-12 bg-white/10 rounded-2xl shadow-inner flex items-center justify-center flex-shrink-0 text-amber-400 border border-white/10 group-hover:scale-110 transition-transform duration-300">
            <i className="fa-solid fa-scale-balanced text-xl"></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h5 className="text-xs font-black text-amber-300 uppercase tracking-widest">Medical Ethics Compliance</h5>
              <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[9px] font-bold border border-amber-500/30">BETA</span>
            </div>
            <p className="text-xs text-green-100/70 leading-relaxed font-medium">
              OncoVision AI is an experimental diagnostics framework. Results should be cross-verified with immunohistochemistry reports.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerView;
