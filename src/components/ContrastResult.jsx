export default function ContrastResult({ ratio }) {
  if (ratio === null) return <section className="contrast panel"><h3>Accessibility results</h3><p>Enter valid six-digit HEX colors to check contrast.</p></section>;
  const checks = [
    ['Normal text · AA', ratio >= 4.5], ['Large text · AA', ratio >= 3],
    ['Normal text · AAA', ratio >= 7], ['Large text · AAA', ratio >= 4.5],
  ];
  return <section className="contrast panel"><div><p className="eyebrow">ACCESSIBILITY CHECK</p><h2>{ratio.toFixed(2)}<small>:1</small></h2><p className="muted">Contrast ratio</p><div className="contrast-meter"><span style={{width:`${Math.min(100, ratio / 21 * 100)}%`}}/></div><p className="meter-label">{ratio >= 7 ? 'Excellent contrast' : ratio >= 4.5 ? 'Good for normal text' : ratio >= 3 ? 'Suitable for large text only' : 'Contrast needs improvement'}</p></div><div className="results">{checks.map(([label,pass])=><p key={label}>{label}<b className={pass?'pass':'fail'}>{pass?'PASS':'FAIL'}</b></p>)}</div><p className="note">WCAG AA requires 4.5:1 for normal text and 3:1 for large text. AAA has stricter thresholds. The ratio is calculated from the selected background and text colors.</p></section>;
}
