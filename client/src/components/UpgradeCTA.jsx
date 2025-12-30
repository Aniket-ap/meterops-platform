import React from 'react';

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
    <div className={`rounded-lg border p-4 mb-6 ${isDanger ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className={`text-sm font-semibold ${isDanger ? 'text-red-800' : 'text-yellow-800'}`}>
            {isDanger ? 'Critical Usage Alert' : 'Usage Warning'}
          </h3>
          <p className={`mt-1 text-sm ${isDanger ? 'text-red-700' : 'text-yellow-700'}`}>
            You have used <span className="font-bold">{percentage.toFixed(1)}%</span> of your {plan} plan limits. 
            {isDanger 
              ? ' Please upgrade immediately to avoid service interruption.' 
              : ' Consider upgrading your plan to ensure uninterrupted service.'}
          </p>
        </div>
        <button
          onClick={handleUpgrade}
          className={`whitespace-nowrap inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isDanger 
              ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
              : 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
          } focus:outline-none focus:ring-2 focus:ring-offset-2`}
        >
          Upgrade Plan
        </button>
      </div>
    </div>
  );
};

export default UpgradeCTA;
