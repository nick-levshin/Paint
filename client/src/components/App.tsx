import React from 'react';
import '../styles/app.scss';
import Canvas from './Canvas';
import SettingBar from './SettingBar';
import Toolbar from './Toolbar';

const App: React.FC = () => {
  return (
    <div className="app">
      <Toolbar />
      <SettingBar />
      <Canvas />
    </div>
  );
};

export default App;
