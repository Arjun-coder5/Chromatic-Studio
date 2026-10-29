import { isValidHex } from '../utils/color.js';
export default function ColorField({label,id,value,onChange}) {
 const valid=isValidHex(value);
 return <div className="color-field"><label htmlFor={id+'-hex'}>{label}</label><div className="color-row"><input aria-label={label+' picker'} type="color" value={valid?value:'#FFFFFF'} onChange={e=>onChange(e.target.value.toUpperCase())}/><input id={id+'-hex'} className={!valid?'invalid':''} value={value} maxLength={7} spellCheck="false" onChange={e=>{let v=e.target.value.toUpperCase();if(!v.startsWith('#'))v='#'+v;onChange(v)}}/></div><small>{valid?'Six-digit HEX color':'Enter a color like #22C55E'}</small></div>;
}
