import React from 'react';

const DebugTest: React.FC = () => {
  console.log('DebugTest component rendered');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#ff0000', 
      color: 'white', 
      margin: '20px',
      borderRadius: '8px',
      fontSize: '18px',
      fontWeight: 'bold'
    }}>
      🚨 COMPOSANT DE DEBUG - SI VOUS VOYEZ CECI, LE COMPOSANT FONCTIONNE !
    </div>
  );
};

export default DebugTest;
