// Componente opcional para mostrar estadísticas de uso de OCR
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

const OCRStats = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const saved = localStorage.getItem('ocr-stats');
    if (saved) {
      setStats(JSON.parse(saved));
    } else {
      setStats({
        florence: { attempts: 0, success: 0 },
        ocrspace: { attempts: 0, success: 0 },
        tesseract: { attempts: 0, success: 0 },
        totalScans: 0,
        lastReset: new Date().toISOString()
      });
    }
  };

  const resetStats = () => {
    const emptyStats = {
      florence: { attempts: 0, success: 0 },
      ocrspace: { attempts: 0, success: 0 },
      tesseract: { attempts: 0, success: 0 },
      totalScans: 0,
      lastReset: new Date().toISOString()
    };
    localStorage.setItem('ocr-stats', JSON.stringify(emptyStats));
    setStats(emptyStats);
  };

  if (!stats) return null;

  const getSuccessRate = (method) => {
    if (method.attempts === 0) return 0;
    return Math.round((method.success / method.attempts) * 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold text-gray-800">Estadísticas OCR</h3>
        </div>
        <button
          onClick={resetStats}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Resetear
        </button>
      </div>

      <div className="space-y-3">
        <StatRow
          name="Florence-2"
          icon="🎯"
          attempts={stats.florence.attempts}
          success={stats.florence.success}
          successRate={getSuccessRate(stats.florence)}
        />
        <StatRow
          name="OCR.space"
          icon="🌐"
          attempts={stats.ocrspace.attempts}
          success={stats.ocrspace.success}
          successRate={getSuccessRate(stats.ocrspace)}
        />
        <StatRow
          name="Tesseract"
          icon="📖"
          attempts={stats.tesseract.attempts}
          success={stats.tesseract.success}
          successRate={getSuccessRate(stats.tesseract)}
        />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-2 text-sm text-gray-600">
        <TrendingUp className="w-4 h-4" />
        <span>Total escaneos: <strong>{stats.totalScans}</strong></span>
      </div>
    </div>
  );
};

const StatRow = ({ name, icon, attempts, success, successRate }) => (
  <div className="flex items-center gap-3">
    <span className="text-xl">{icon}</span>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{name}</span>
        <span className="text-xs text-gray-500">
          {success}/{attempts}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 transition-all duration-300"
          style={{ width: `${successRate}%` }}
        />
      </div>
    </div>
    <span className="text-sm font-semibold text-gray-700 min-w-[3rem] text-right">
      {successRate}%
    </span>
  </div>
);

// Hook para registrar estadísticas
export const useOCRStats = () => {
  const recordAttempt = (method, success) => {
    const saved = localStorage.getItem('ocr-stats');
    const stats = saved ? JSON.parse(saved) : {
      florence: { attempts: 0, success: 0 },
      ocrspace: { attempts: 0, success: 0 },
      tesseract: { attempts: 0, success: 0 },
      totalScans: 0,
      lastReset: new Date().toISOString()
    };

    const methodKey = method.replace('-2', '').toLowerCase();
    if (stats[methodKey]) {
      stats[methodKey].attempts++;
      if (success) {
        stats[methodKey].success++;
      }
    }
    
    stats.totalScans++;
    localStorage.setItem('ocr-stats', JSON.stringify(stats));
  };

  return { recordAttempt };
};

export default OCRStats;