import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ 
      padding: '50px', 
      backgroundColor: '#00ff00', 
      color: 'black', 
      fontSize: '24px',
      textAlign: 'center'
    }}>
      <h1>TEST PAGE - SI VOUS VOYEZ CECI, REACT FONCTIONNE !</h1>
      <p>Date: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default TestPage;
