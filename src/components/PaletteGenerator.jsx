import { useState } from 'react';

const randomHex = () => `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0').toUpperCase()}`;
const makePalette = () => Array.from({ length: 5 }, () => randomHex());

export default function PaletteGenerator({ onApply }) {
  const [colors, setColors] = useState(makePalette);
  const [locked, setLocked] = useState([false, false, false, false, false]);
  const [message, setMessage] = useState('');

  const generate = () => {
    setColors((current) => current.map((color, index) => locked[index] ? color : randomHex()));
    setMessage('New palette generated. Locked colors were kept.');
  };

  const changeColor = (index, color) => {
    setColors((current) => current.map((old, i) => i === index ? color.toUpperCase() : old));
    setMessage('');
  };

  const toggleLock = (index) => {
    setLocked((current) => current.map((value, i) => i === index ? !value : value));
  };

  const copyColor = async (color) => {
    try {
      await navigator.clipboard.writeText(color);
      setMessage(`${color} copied to clipboard.`);
    } catch {
      window.prompt('Copy this HEX color:', color);
    }
  };

  const copyAll = async () => {
    const text = colors.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setMessage('All five HEX colors copied.');
    } catch {
      window.prompt('Copy your palette:', text);
    }
  };

  return (
    <section className="palette-generator panel">
      <div className="section-heading generator-heading">
        <div><p className="eyebrow">CREATE SOMETHING NEW</p><h2>Color palette generator</h2><p className="muted">Generate five colors, lock your favorites, and keep exploring.</p></div>
        <div className="generator-actions"><button className="btn secondary" onClick={copyAll}>Copy all HEX</button><button className="btn primary" onClick={generate}>↻ Generate palette</button></div>
      </div>
      <div className="generated-colors">
        {colors.map((color, index) => (
          <article className="generated-color" key={index}>
            <button className="generated-swatch" style={{ backgroundColor: color }} onClick={() => copyColor(color)} aria-label={`Copy ${color}`} title="Click to copy HEX" />
            <div className="generated-color-meta">
              <label className="sr-only" htmlFor={`generated-hex-${index}`}>Color {index + 1} HEX code</label>
              <input id={`generated-hex-${index}`} value={color} maxLength={7} onChange={(event) => changeColor(index, event.target.value)} aria-label={`Edit color ${index + 1} HEX code`} />
              <button className={`lock-btn ${locked[index] ? 'is-locked' : ''}`} onClick={() => toggleLock(index)} aria-pressed={locked[index]} title={locked[index] ? 'Unlock color' : 'Lock color'}>{locked[index] ? '🔒 Locked' : '🔓 Lock'}</button>
            </div>
          </article>
        ))}
      </div>
      <div className="generator-footer"><span>{message || 'Tip: lock any color you like, then generate again.'}</span><button className="btn quiet" onClick={() => onApply({ background: colors[0], text: colors[4] })}>Use first &amp; last colors in preview ↗</button></div>
    </section>
  );
}
