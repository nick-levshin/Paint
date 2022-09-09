import React from 'react';
import '../styles/toolbar.scss';
import toolState from '../store/toolState';

const SettingBar: React.FC = () => {
  return (
    <div className="setting-bar">
      <label htmlFor="line-width">Line width</label>
      <input
        onChange={(e) => toolState.setLineWidth(+e.target.value)}
        style={{ margin: '0 10px' }}
        id="line-width"
        type="number"
        defaultValue={1}
        min={1}
        max={50}
      />
      <label htmlFor="stroke-color">Stroke color</label>
      <input
        onChange={(e) => toolState.setStrokeColor(e.target.value)}
        style={{ margin: '0 10px' }}
        id="stroke-color"
        type="color"
        value={toolState.strokeColor}
      />
    </div>
  );
};

export default SettingBar;
