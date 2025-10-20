import React from 'react';

const SimpleTest: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-blue-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
        🧪 Test Simple - Composant Affiché
      </h2>
      <p className="text-center text-blue-600">
        Si vous voyez ce message, le composant fonctionne !
      </p>
      <div className="mt-4 p-4 bg-white rounded border">
        <p><strong>Status:</strong> ✅ Composant chargé</p>
        <p><strong>Date:</strong> {new Date().toLocaleString()}</p>
        <p><strong>URL API:</strong> http://localhost:8001/api</p>
      </div>
    </div>
  );
};

export default SimpleTest;
