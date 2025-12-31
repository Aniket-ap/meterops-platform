import React from 'react';
import { AlertTriangle, Zap, ArrowUpCircle } from 'lucide-react';

const UpgradeCTA = ({ percentage, plan }) => {
  // Safety check
  if (typeof percentage !== 'number' || isNaN(percentage)) return null;

  // Show if usage > 80%
  if (percentage < 80) return null;

  const isDanger = percentage >= 90;

  const handleUpgrade = () => {
    window.location.href = `mailto:sales@meterops.com?subject=Upgrade Request for ${plan} Plan`;
  };

  return (
    <div className={`rounded-xl border p-4 mb-6 shadow-sm transition-all duration-300 ${
      isDanger 
        ? 'bg-red-50 border-red-100' 
        : 'bg-amber-50 border-amber-100'
    }`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isDanger ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${isDanger ? 'text-red-900' : 'text-amber-900'}`}>
              {isDanger ? 'Critical Usage Alert' : 'Approaching Limit'}
            </h3>
            <p className={`mt-1 text-sm ${isDanger ? 'text-red-700' : 'text-amber-700'}`}>
              You have used <span className="font-bold">{percentage.toFixed(1)}%</span> of your {plan} plan limits. 
              {isDanger 
                ? ' Please upgrade immediately to avoid service interruption.' 
                : ' Consider upgrading to ensure uninterrupted service.'}
            </p>
          </div>
        </div>
        <button
          onClick={handleUpgrade}
          className={`whitespace-nowrap inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white shadow-sm transition-transform active:scale-95 ${
            isDanger 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-amber-600 hover:bg-amber-700'
          }`}
        >
          <ArrowUpCircle size={16} />
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default UpgradeCTA;
