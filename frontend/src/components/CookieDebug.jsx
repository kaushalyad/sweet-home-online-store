import React, { useState, useEffect } from 'react';
import { FaCookie, FaTrash, FaEye } from 'react-icons/fa';

const CookieDebug = () => {
  const [consent, setConsent] = useState(null);
  const [showDebug, setShowDebug] = useState(false);

  const checkConsent = () => {
    const stored = localStorage.getItem('cookieConsent');
    if (stored) {
      try {
        setConsent(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing cookie consent:', error);
        localStorage.removeItem('cookieConsent');
        setConsent(null);
      }
    } else {
      setConsent(null);
    }
  };

  useEffect(() => {
    checkConsent();
  }, []);

  const clearConsent = () => {
    localStorage.removeItem('cookieConsent');
    setConsent(null);
    alert('Cookie consent cleared! Refresh the page to see the banner again.');
  };

  return (
    <div className="fixed bottom-4 left-4 z-[10000] hidden md:block">
      {!showDebug ? (
        <button
          onClick={() => setShowDebug(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white p-3 rounded-full shadow-lg"
          title="Cookie Debug Tool"
        >
          <FaCookie className="text-xl" />
        </button>
      ) : (
        <div className="bg-white rounded-lg shadow-xl border-2 border-purple-500 p-4 max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-purple-600 flex items-center gap-2">
              <FaCookie /> Cookie Debug
            </h3>
            <button
              onClick={() => setShowDebug(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          {consent ? (
            <div className="space-y-2">
              <div className="bg-green-50 border border-green-200 rounded p-2 text-xs">
                <p className="font-semibold text-green-800 mb-1">Consent Given:</p>
                <ul className="space-y-1 text-green-700">
                  <li>✓ Necessary: {consent.necessary ? 'Yes' : 'No'}</li>
                  <li>✓ Functional: {consent.functional ? 'Yes' : 'No'}</li>
                  <li>✓ Analytics: {consent.analytics ? 'Yes' : 'No'}</li>
                  <li>✓ Marketing: {consent.marketing ? 'Yes' : 'No'}</li>
                </ul>
                <p className="text-[10px] text-green-600 mt-2">
                  {new Date(consent.timestamp).toLocaleString()}
                </p>
              </div>
              <button
                onClick={clearConsent}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2"
              >
                <FaTrash /> Clear Consent
              </button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs text-yellow-800">
              <p className="font-semibold mb-1">No consent stored</p>
              <p>Cookie banner should be visible</p>
            </div>
          )}
          
          <button
            onClick={checkConsent}
            className="w-full mt-2 bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2"
          >
            <FaEye /> Refresh Status
          </button>
        </div>
      )}
    </div>
  );
};

export default CookieDebug;
