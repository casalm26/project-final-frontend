import{d as o,r as x,m as l,j as r,q as j,L as $}from"./index-Bdj1OuIn.js";import{u as M}from"./useKeyboardNavigation-HrnEcNsd.js";const n=()=>{const e=document.documentElement.classList.contains("dark");return{containerBg:e?"#1f2937":"#ffffff",containerBorder:e?"#374151":"#e5e7eb",containerShadow:e?"0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)":"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",headerBg:e?"#374151":"#f9fafb",headerBorder:e?"#4b5563":"#e5e7eb",headerText:e?"#f9fafb":"#111827",cellText:e?"#e5e7eb":"#111827",cellBorder:e?"#4b5563":"#f3f4f6",cellHover:e?"#374151":"#f9fafb",cellHeaderText:e?"#d1d5db":"#374151",cellHeaderHover:e?"#4b5563":"#f3f4f6",mutedText:e?"#9ca3af":"#6b7280",sortIcon:e?"#6b7280":"#9ca3af"}};o.div`
  background: ${()=>n().containerBg};
  border-radius: 0.75rem;
  box-shadow: ${()=>n().containerShadow};
  border: 1px solid ${()=>n().containerBorder};
  overflow: hidden;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;o.div`
  background: ${()=>n().headerBg};
  padding: 1.5rem;
  border-bottom: 1px solid ${()=>n().headerBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;o.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${()=>n().headerText};
  margin: 0;
  transition: color 0.2s ease;
`;const w=o.table`
  width: 100%;
  border-collapse: collapse;
`;o.thead`
  background: ${()=>n().headerBg};
  border-bottom: 1px solid ${()=>n().headerBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;const u=o.tr`
  border-bottom: 1px solid ${()=>n().cellBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
  
  &:hover {
    background: ${()=>n().cellHover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`,c=o.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${()=>n().cellHeaderText};
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background: ${()=>n().cellHeaderHover};
  }
`,h=o.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${()=>n().cellText};
  vertical-align: top;
  transition: color 0.2s ease;
`;o.div`
  text-align: center;
  padding: 3rem;
  color: ${()=>n().mutedText};
  transition: color 0.2s ease;
`;o.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: ${()=>n().sortIcon};
  transition: color 0.2s ease;
`;const v=[{date:"2024-01-15",height:2.4,diameter:8.2,health:"healthy"},{date:"2024-02-15",height:2.3,diameter:8.1,health:"healthy"},{date:"2024-03-15",height:2.2,diameter:8,health:"healthy"},{date:"2024-04-15",height:2.1,diameter:7.9,health:"warning"},{date:"2024-05-15",height:2,diameter:7.8,health:"warning"},{date:"2024-06-15",height:1.9,diameter:7.7,health:"warning"},{date:"2024-07-15",height:1.8,diameter:7.6,health:"critical"},{date:"2024-08-15",height:1.7,diameter:7.5,health:"critical"},{date:"2024-09-15",height:1.6,diameter:7.4,health:"critical"},{date:"2024-10-15",height:1.5,diameter:7.3,health:"critical"}],D=(e,t)=>{const[a,s]=x.useState([]);return x.useEffect(()=>{e&&t&&s(v)},[e,t]),a},y=e=>x.useCallback(()=>{e&&(navigator.share?navigator.share({title:`Tree Details - ${e.name}`,text:`Check out this tree: ${e.name} (${e.species})`,url:window.location.href}):(navigator.clipboard.writeText(window.location.href),alert("Tree URL copied to clipboard!")))},[e]),T=o.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  outline: none;
`,I=o.div`
  background: ${e=>e.$isDarkMode?"#1f2937":"white"};
  border-radius: 0.75rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  outline: none;
`,B=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${e=>e.$isDarkMode?"#374151":"#e5e7eb"};
  background: ${e=>e.$isDarkMode?"#111827":"#f9fafb"};
  border-radius: 0.75rem 0.75rem 0 0;
`,C=o.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  margin: 0;
`,H=o.button`
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: ${e=>e.$isDarkMode?"#9ca3af":"#6b7280"};
  transition: all 0.2s;
  
  &:hover {
    background: ${e=>e.$isDarkMode?"#374151":"#f3f4f6"};
    color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
  }
`,L=o.div`
  padding: 1.5rem;
`,S=()=>r.jsx("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})}),z=({isOpen:e,onClose:t,title:a,children:s,containerRef:m})=>{const{isDarkMode:d}=l(),b=g=>{g.target===g.currentTarget&&t()};return e?r.jsx(T,{onClick:b,role:"presentation",children:r.jsxs(I,{ref:m,role:"dialog","aria-modal":"true","aria-labelledby":"modal-title",tabIndex:"-1",$isDarkMode:d,children:[r.jsxs(B,{$isDarkMode:d,children:[r.jsx(C,{id:"modal-title",$isDarkMode:d,children:a}),r.jsx(H,{onClick:t,"aria-label":"Close modal",type:"button",$isDarkMode:d,children:r.jsx(S,{})})]}),r.jsx(L,{children:s})]})}):null},E=o.div`
  background: ${e=>e.$isDarkMode?"#374151":"#f9fafb"};
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid ${e=>e.$isDarkMode?"#4b5563":"#e5e7eb"};
`,F=o.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  margin: 0 0 1rem 0;
`,N=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${e=>e.$isDarkMode?"#4b5563":"#e5e7eb"};
  
  &:last-child {
    border-bottom: none;
  }
`,P=o.span`
  color: ${e=>e.$isDarkMode?"#9ca3af":"#6b7280"};
  font-size: 0.875rem;
`,G=o.span`
  font-weight: 500;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  font-size: 0.875rem;
`,p=({title:e,children:t})=>{const{isDarkMode:a}=l();return r.jsxs(E,{$isDarkMode:a,children:[r.jsx(F,{$isDarkMode:a,children:e}),t]})},i=({label:e,children:t})=>{const{isDarkMode:a}=l();return r.jsxs(N,{$isDarkMode:a,children:[r.jsxs(P,{$isDarkMode:a,children:[e,":"]}),r.jsx(G,{$isDarkMode:a,children:t})]})},R=o.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${e=>{switch(e.health){case"healthy":return"background: #d1fae5; color: #065f46;";case"warning":return"background: #fef3c7; color: #92400e;";case"critical":return"background: #fee2e2; color: #991b1b;";default:return"background: #f3f4f6; color: #374151;"}}}
`,k=({health:e,children:t})=>r.jsx(R,{health:e,children:t||e}),V=({tree:e})=>r.jsxs(p,{title:"Basic Information",children:[r.jsx(i,{label:"Tree ID",children:e.name}),r.jsx(i,{label:"Species",children:e.species}),r.jsxs(i,{label:"Current Height",children:[e.height,"m"]}),r.jsx(i,{label:"Health Status",children:r.jsx(k,{health:e.health,children:e.health})}),r.jsx(i,{label:"Planted Date",children:"March 15, 2023"})]}),W=({tree:e})=>r.jsxs(p,{title:"Location & Contract",children:[r.jsx(i,{label:"Latitude",children:e.lat.toFixed(6)}),r.jsx(i,{label:"Longitude",children:e.lng.toFixed(6)}),r.jsxs(i,{label:"Forest",children:["Forest ",e.id<=4?"A":"B"]}),r.jsx(i,{label:"Contract Status",children:r.jsx("span",{className:"px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs",children:"Active"})}),r.jsx(i,{label:"Last Inspection",children:"Jan 15, 2024"})]}),A=o.div`
  margin-bottom: 2rem;
`,q=o.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  margin: 0 0 1rem 0;
`,J=o(w)`
  border-radius: 0.5rem;
  overflow: hidden;
`,K=o.thead``,U=({measurementHistory:e})=>{const{isDarkMode:t}=l();return r.jsxs(A,{children:[r.jsx(q,{$isDarkMode:t,children:"Measurement History (Last 10 Entries)"}),r.jsxs(J,{children:[r.jsx(K,{children:r.jsxs(u,{children:[r.jsx(c,{children:"Date"}),r.jsx(c,{children:"Height (m)"}),r.jsx(c,{children:"Diameter (cm)"}),r.jsx(c,{children:"Health"})]})}),r.jsx("tbody",{children:e.slice(0,10).map((a,s)=>r.jsxs(u,{children:[r.jsx(h,{children:j(a.date)}),r.jsx(h,{children:a.height}),r.jsx(h,{children:a.diameter}),r.jsx(h,{children:r.jsx(k,{health:a.health,children:a.health})})]},s))})]})]})},O=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`,Q=o.div`
  background: ${e=>e.$isDarkMode?"#374151":"#f9fafb"};
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  border: 1px solid ${e=>e.$isDarkMode?"#4b5563":"#e5e7eb"};
`,X=o.div`
  width: 100%;
  height: 100px;
  background: ${e=>e.$isDarkMode?"#4b5563":"#e5e7eb"};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${e=>e.$isDarkMode?"#9ca3af":"#6b7280"};
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`,Y=()=>r.jsx("svg",{className:"w-8 h-8",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"})}),f=({caption:e})=>{const{isDarkMode:t}=l();return r.jsxs(Q,{$isDarkMode:t,children:[r.jsx(X,{$isDarkMode:t,role:"img","aria-label":`${e} placeholder image`,children:r.jsx(Y,{})}),r.jsx("div",{style:{fontSize:"0.75rem",color:t?"#9ca3af":"#6b7280"},children:e})]})},Z=()=>r.jsxs(O,{children:[r.jsx(f,{caption:"Latest Photo"}),r.jsx(f,{caption:"Growth Progress"}),r.jsx(f,{caption:"Planting Day"})]}),_=o.button`
  padding: 0.75rem 1.5rem;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #059669;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`,ee=o($)`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,re=()=>r.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"})}),oe=()=>r.jsx("svg",{className:"w-4 h-4 mr-2 inline",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"})}),te=({tree:e,onShare:t})=>r.jsxs("div",{className:"flex justify-end space-x-3",children:[r.jsxs(ee,{to:`/tree/${e.id}`,children:[r.jsx(re,{}),"View Full Page"]}),r.jsxs(_,{onClick:t,children:[r.jsx(oe,{}),"Share Tree"]})]}),ae=o.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`,ne=o.div`
  margin-bottom: 2rem;
`,ie=o.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  margin: 0 0 1rem 0;
`,le=({tree:e,isOpen:t,onClose:a})=>{const{containerRef:s}=M({onEscape:a,trapFocus:!0,autoFocus:!0}),{isDarkMode:m}=l(),d=D(e,t),b=y(e);return e?r.jsxs(z,{isOpen:t,onClose:a,title:e.name,containerRef:s,children:[r.jsxs(ae,{children:[r.jsx(V,{tree:e}),r.jsx(W,{tree:e})]}),r.jsx(U,{measurementHistory:d}),r.jsxs(ne,{children:[r.jsx(ie,{$isDarkMode:m,children:"Tree Images"}),r.jsx(Z,{})]}),r.jsx(te,{tree:e,onShare:b})]}):null};export{k as H,le as T,y as u};
