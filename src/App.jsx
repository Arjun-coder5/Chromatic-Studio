import { useMemo, useState } from 'react';
import ColorField from './components/ColorField.jsx';
import ContrastResult from './components/ContrastResult.jsx';
import PaletteSwatches from './components/PaletteSwatches.jsx';
import { contrastRatio, isValidHex, readableTextColor, makePalette, simulateColor } from './utils/color.js';

const DEFAULT_BG = '#FFF7ED';
const DEFAULT_TEXT = '#7C2D12';
const SIMULATIONS = [
  { value: 'normal', label: 'Normal vision' },
  { value: 'protanopia', label: 'Protanopia · red-blind' },
  { value: 'deuteranopia', label: 'Deuteranopia · green-blind' },
  { value: 'tritanopia', label: 'Tritanopia · blue-blind' },
  { value: 'achromatopsia', label: 'Monochromacy · grayscale' },
];
const starterPalette = () => makePalette();

export default function App() {
  const [background, setBackground] = useState(DEFAULT_BG);
  const [textColor, setTextColor] = useState(DEFAULT_TEXT);
  const [colors, setColors] = useState(starterPalette);
  const [locked, setLocked] = useState([false, false, false, false, false]);
  const [simulation, setSimulation] = useState('normal');
  const [notice, setNotice] = useState('');
  const [saved, setSaved] = useState(() => { try { return JSON.parse(localStorage.getItem('chromatic-saved-palettes') || '[]'); } catch { return []; } });
  const valid = isValidHex(background) && isValidHex(textColor);
  const ratio = useMemo(() => valid ? contrastRatio(background, textColor) : null, [background, textColor, valid]);
  const previewBg = isValidHex(background) ? simulateColor(background, simulation) : '#FFFFFF';
  const previewText = isValidHex(textColor) ? simulateColor(textColor, simulation) : '#111827';

  const apply = (palette) => {
    if (isValidHex(palette.background)) setBackground(palette.background.toUpperCase());
    if (isValidHex(palette.text)) setTextColor(palette.text.toUpperCase());
    if (palette.colors?.length) setColors(palette.colors);
    setNotice('Palette applied to live preview.');
  };
  const reset = () => { setBackground(DEFAULT_BG); setTextColor(DEFAULT_TEXT); setSimulation('normal'); setNotice('Colors reset.'); };
  const suggest = () => { if (isValidHex(background)) { setTextColor(readableTextColor(background)); setNotice('Readable text color suggested.'); } };
  const copy = async (text, message) => { try { await navigator.clipboard.writeText(text); setNotice(message); } catch { window.prompt('Copy this content:', text); } };
  const cssTokens = `:root {\n${colors.map((c, i) => `  --color-${['primary','secondary','accent','deep','highlight'][i]}: ${c};`).join('\n')}\n  --color-background: ${background};\n  --color-text: ${textColor};\n}`;
  const savePalette = () => {
    const item = { id: Date.now(), name: `Palette ${saved.length + 1}`, background, text: textColor, colors, created: new Date().toLocaleDateString() };
    const next = [item, ...saved].slice(0, 30); setSaved(next); localStorage.setItem('chromatic-saved-palettes', JSON.stringify(next)); setNotice('Palette saved in this browser.');
  };
  const deletePalette = (id) => { const next = saved.filter(p => p.id !== id); setSaved(next); localStorage.setItem('chromatic-saved-palettes', JSON.stringify(next)); setNotice('Saved palette removed.'); };
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ background, text: textColor, palette: colors, contrastRatio: ratio, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'chromatic-design-tokens.json'; a.click(); URL.revokeObjectURL(url); setNotice('JSON design tokens exported.');
  };
  const generate = () => { setColors(current => { const fresh = makePalette(); return fresh.map((c, i) => locked[i] ? current[i] : c); }); setNotice('A fresh color harmony is ready. Locked colors were kept.'); };
  const updateGeneratedColor = (index, value) => setColors(old => old.map((c, i) => i === index ? value.toUpperCase() : c));
  const toggleLock = index => setLocked(old => old.map((v, i) => i === index ? !v : v));
  const applyGenerated = () => apply({ background: colors[0], text: colors[3], colors });

  return <div className="shell" id="top">
    <header><a className="brand" href="#top"><span className="mark"><i/><i/><i/><i/></span>chromatic<span className="brand-beta">STUDIO</span></a><div className="header-right"><span className="top-tag">COLOR & ACCESSIBILITY TOOLKIT</span><a className="header-link" href="#saved">My palettes <span>{saved.length}</span></a></div></header>
    <main>
      <section className="hero"><div><p className="eyebrow">DESIGN WITH CLARITY · BUILT FOR EVERYONE</p><h1>Beautiful colors.<br/><span>Readable by everyone.</span></h1><p className="hero-desc">Create harmonious palettes, preview your interface live, simulate color-vision differences, and test accessibility before shipping your design.</p><div className="pills"><span>✦ Palette generator</span><span>✓ WCAG AA / AAA</span><span>◉ Color vision simulator</span></div><a className="hero-cta" href="#workspace">Open your color lab <b>↘</b></a></div><div className="art" aria-hidden="true"><div className="art-back"><i/><i/><i/></div><div className="art-front"><small>CHROMATIC / COLOR STUDY</small><div className="gradient"/><div className="mini-swatches">{colors.slice(0,4).map((c,i)=><i key={i} style={{background:c}}/>)}</div><div className="skeleton"/></div><div className="floating">✦ Your next color system</div></div></section>

      <section className="workspace" id="workspace"><div className="section-heading"><div><p className="eyebrow">01 / YOUR WORKSPACE</p><h2>Build your color pair</h2><p className="section-subtitle">Tune the colors. Watch the interface respond in real time.</p></div><button className="btn quiet" onClick={reset}>↺ Reset colors</button></div>
        <div className="editor"><section className="panel"><div className="panel-heading"><span className="icon-bubble">◈</span><div><h3>Color controls</h3><p>Choose a color or type a six-digit HEX code.</p></div></div><ColorField label="Background color" id="background" value={background} onChange={setBackground}/><ColorField label="Text color" id="text" value={textColor} onChange={setTextColor}/><div className="actions"><button className="btn primary" onClick={suggest}>✦ Suggest readable text</button><button className="btn secondary" disabled={!valid} onClick={() => copy(cssTokens,'CSS design tokens copied.')}>Copy CSS tokens</button></div><div className="control-foot"><span className="tiny-dot"/> Everything runs locally in your browser.</div></section>
        <section className="panel preview-panel"><div className="panel-heading spread"><div><h3>Live interface preview</h3><p>See the selected colors in a sample website component.</p></div><span className="live">LIVE</span></div><div className="website-preview" style={{backgroundColor:previewBg,color:previewText}}><nav><b>Studio<span className="preview-period">.</span></b><span>Work&nbsp;&nbsp; About</span></nav><div className="preview-content"><small>A SAMPLE COMPONENT</small><h4>Design that feels<br/>like you.</h4><p>Thoughtful color choices make digital experiences clearer, calmer, and easier to use.</p><button style={{background:previewText,color:previewBg}}>Explore more ↗</button></div><footer><span>COLOR SYSTEM / 01</span><span>● ● ●</span></footer></div><div className="values"><span><i style={{background:background}}/> BG <b>{background}</b><button onClick={() => copy(background,`${background} copied.`)} aria-label="Copy background HEX">⧉</button></span><span><i style={{background:textColor}}/> TEXT <b>{textColor}</b><button onClick={() => copy(textColor,`${textColor} copied.`)} aria-label="Copy text HEX">⧉</button></span></div></section></div>
        <ContrastResult ratio={ratio}/>
        <section className="panel simulation-panel"><div className="section-heading"><div><p className="eyebrow">02 / INCLUSIVE DESIGN</p><h2>Color vision simulator</h2><p className="section-subtitle">Preview how your colors may appear under different types of color-vision deficiency.</p></div><select className="sim-select" value={simulation} onChange={e=>setSimulation(e.target.value)} aria-label="Color vision simulation">{SIMULATIONS.map(s=><option key={s.value} value={s.value}>{s.label}</option>)}</select></div><div className="sim-grid">{SIMULATIONS.filter(s=>s.value!=='normal').map(s=><button className={`sim-card ${simulation===s.value?'selected':''}`} key={s.value} onClick={()=>setSimulation(s.value)}><span className="sim-label">{s.label}</span><span className="sim-swatches"><i style={{background:simulateColor(background,s.value)}}/><i style={{background:simulateColor(textColor,s.value)}}/><i style={{background:simulateColor(colors[2],s.value)}}/></span><small>{simulation===s.value?'Currently previewing':'Preview this simulation'} ↗</small></button>)}</div><p className="note">Simulation is an approximation for design review, not a clinical representation. Do not rely on color alone to communicate important states.</p></section>

        <section className="panel palette-generator"><div className="section-heading generator-heading"><div><p className="eyebrow">03 / CREATE SOMETHING NEW</p><h2>Color palette generator</h2><p className="section-subtitle">Generate a coordinated five-color harmony. Lock favorites and regenerate the rest.</p></div><div className="generator-actions"><button className="btn secondary" onClick={() => copy(colors.join('\n'),'All five HEX colors copied.')}>⧉ Copy all HEX</button><button className="btn primary" onClick={generate}>↻ Generate palette</button></div></div><div className="generated-colors">{colors.map((color,index)=><article className="generated-color" key={index}><button className="generated-swatch" style={{backgroundColor:isValidHex(color)?color:'#eee'}} onClick={()=>copy(color,`${color} copied.`)} title="Click to copy HEX" aria-label={`Copy ${color}`}/><div className="generated-color-meta"><label className="sr-only" htmlFor={`generated-${index}`}>Color {index+1} HEX</label><input id={`generated-${index}`} value={color} maxLength={7} onChange={e=>updateGeneratedColor(index,e.target.value)} aria-label={`Edit color ${index+1}`}/><button className={`lock-btn ${locked[index]?'is-locked':''}`} onClick={()=>toggleLock(index)} aria-pressed={locked[index]}>{locked[index]?'🔒 Locked':'♧ Lock color'}</button></div></article>)}</div><div className="generator-footer"><span>Tip: lock a swatch you love, then generate again.</span><button className="btn quiet" onClick={applyGenerated}>Use palette in preview ↗</button></div></section>

        <PaletteSwatches onSelect={apply}/>

        <section className="panel export-panel"><div><p className="eyebrow">04 / READY FOR DEVELOPMENT</p><h2>Export your design tokens</h2><p className="section-subtitle">Take your palette into a real project. No account or backend required.</p></div><div className="export-actions"><button className="btn primary" onClick={() => copy(cssTokens,'CSS variables copied to clipboard.')}>⧉ Copy CSS variables</button><button className="btn secondary" onClick={exportJson}>↓ Download JSON</button><button className="btn secondary" onClick={() => copy(JSON.stringify({background,text:textColor,colors},null,2),'JSON tokens copied.')}>Copy JSON</button></div><pre className="token-code">{cssTokens}</pre></section>

        <section className="panel saved-panel" id="saved"><div className="section-heading"><div><p className="eyebrow">05 / YOUR COLLECTION</p><h2>Saved palettes <span className="count-pill">{saved.length}</span></h2><p className="section-subtitle">Stored in this browser, so you can return to your color ideas later.</p></div><button className="btn primary" onClick={savePalette}>＋ Save current palette</button></div>{saved.length===0?<div className="empty-state"><span>✳</span><b>Your collection starts here</b><p>Find a combination you love, then save it to keep it handy.</p></div>:<div className="saved-grid">{saved.map(p=><article className="saved-card" key={p.id}><div className="saved-swatches">{p.colors.map((c,i)=><button key={i} style={{background:c}} title={`Copy ${c}`} onClick={()=>copy(c,`${c} copied.`)}/>)}</div><div className="saved-card-body"><b>{p.name}</b><small>{p.created} · {p.background} / {p.text}</small><div><button className="btn secondary" onClick={()=>apply(p)}>Load palette</button><button className="delete-btn" onClick={()=>deletePalette(p.id)} aria-label={`Delete ${p.name}`}>Remove</button></div></div></article>)}</div>}</section>
        {notice && <div className="toast" role="status"><span>✓</span>{notice}<button onClick={()=>setNotice('')} aria-label="Dismiss notification">×</button></div>}
      </section>
      <aside className="info"><b>ⓘ &nbsp;A quick accessibility note</b><p>WCAG contrast checks help with text readability, but they don't replace keyboard navigation, screen-reader testing, focus states, or testing with people who use your product.</p></aside>
    </main><footer className="site-footer"><a className="brand" href="#top"><span className="mark"><i/><i/><i/><i/></span>chromatic</a><span>Made for clearer digital experiences.</span><span>React · Vite · WCAG · Design tokens</span></footer>
  </div>;
}
