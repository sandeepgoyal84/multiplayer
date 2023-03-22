import React, { useCallback, useState, useRef } from 'react';
import HLSComponent from './HLSComponent';
import './App.css';

function App() {
  return (
    <div style={{ height: "900px", display: "flex" }}>
      <HLSComponent />
    </div>
  );
}

export default App;
