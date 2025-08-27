import{d as o,r as x,m as c,j as r,o as j}from"./index-tEqMizXb.js";import{u as $}from"./useKeyboardNavigation-DT9lybaQ.js";const n=()=>{const e=document.documentElement.classList.contains("dark");return{containerBg:e?"#1f2937":"#ffffff",containerBorder:e?"#374151":"#e5e7eb",containerShadow:e?"0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)":"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",headerBg:e?"#374151":"#f9fafb",headerBorder:e?"#4b5563":"#e5e7eb",headerText:e?"#f9fafb":"#111827",cellText:e?"#e5e7eb":"#111827",cellBorder:e?"#4b5563":"#f3f4f6",cellHover:e?"#374151":"#f9fafb",cellHeaderText:e?"#d1d5db":"#374151",cellHeaderHover:e?"#4b5563":"#f3f4f6",mutedText:e?"#9ca3af":"#6b7280",sortIcon:e?"#6b7280":"#9ca3af"}};o.div`
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
`;const M=o.table`
  width: 100%;
  border-collapse: collapse;
`;o.thead`
  background: ${()=>n().headerBg};
  border-bottom: 1px solid ${()=>n().headerBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
`;const g=o.tr`
  border-bottom: 1px solid ${()=>n().cellBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
  
  &:hover {
    background: ${()=>n().cellHover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`,h=o.th`
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
`,m=o.td`
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
`;const D=[{date:"2024-01-15",height:1.5,diameter:7.3,health:"healthy"},{date:"2024-02-15",height:1.6,diameter:7.4,health:"healthy"},{date:"2024-03-15",height:1.7,diameter:7.5,health:"healthy"},{date:"2024-04-15",height:1.8,diameter:7.6,health:"healthy"},{date:"2024-05-15",height:1.9,diameter:7.7,health:"healthy"},{date:"2024-06-15",height:2,diameter:7.8,health:"healthy"},{date:"2024-07-15",height:2.1,diameter:7.9,health:"healthy"},{date:"2024-08-15",height:2.2,diameter:8,health:"healthy"},{date:"2024-09-15",height:2.3,diameter:8.1,health:"healthy"},{date:"2024-10-15",height:2.4,diameter:8.2,health:"healthy"}],y=(e,t)=>{const[a,s]=x.useState([]);return x.useEffect(()=>{e&&t&&s(D)},[e,t]),a},v=o.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  outline: none;
`,w=o.div`
  background: ${e=>e.$isDarkMode?"#1f2937":"white"};
  border-radius: 0.75rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  outline: none;
`,T=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${e=>e.$isDarkMode?"#374151":"#e5e7eb"};
  background: ${e=>e.$isDarkMode?"#111827":"#f9fafb"};
  border-radius: 0.75rem 0.75rem 0 0;
`,I=o.h2`
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
`,B=o.div`
  padding: 1.5rem;
`,C=()=>r.jsx("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})}),L=({isOpen:e,onClose:t,title:a,children:s,containerRef:d})=>{const{isDarkMode:l}=c(),k=f=>{f.target===f.currentTarget&&t()};return e?r.jsx(v,{onClick:k,role:"presentation",children:r.jsxs(w,{ref:d,role:"dialog","aria-modal":"true","aria-labelledby":"modal-title",tabIndex:"-1",$isDarkMode:l,children:[r.jsxs(T,{$isDarkMode:l,children:[r.jsx(I,{id:"modal-title",$isDarkMode:l,children:a}),r.jsx(H,{onClick:t,"aria-label":"Close modal",type:"button",$isDarkMode:l,children:r.jsx(C,{})})]}),r.jsx(B,{children:s})]})}):null},z=o.div`
  background: ${e=>e.$isDarkMode?"#374151":"#f9fafb"};
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid ${e=>e.$isDarkMode?"#4b5563":"#e5e7eb"};
`,S=o.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  margin: 0 0 1rem 0;
`,E=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${e=>e.$isDarkMode?"#4b5563":"#e5e7eb"};
  
  &:last-child {
    border-bottom: none;
  }
`,F=o.span`
  color: ${e=>e.$isDarkMode?"#9ca3af":"#6b7280"};
  font-size: 0.875rem;
`,P=o.span`
  font-weight: 500;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  font-size: 0.875rem;
`,u=({title:e,children:t})=>{const{isDarkMode:a}=c();return r.jsxs(z,{$isDarkMode:a,children:[r.jsx(S,{$isDarkMode:a,children:e}),t]})},i=({label:e,children:t})=>{const{isDarkMode:a}=c();return r.jsxs(E,{$isDarkMode:a,children:[r.jsxs(F,{$isDarkMode:a,children:[e,":"]}),r.jsx(P,{$isDarkMode:a,children:t})]})},G=o.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${e=>{switch(e.health){case"healthy":return"background: #d1fae5; color: #065f46;";case"warning":return"background: #fef3c7; color: #92400e;";case"critical":return"background: #fee2e2; color: #991b1b;";default:return"background: #f3f4f6; color: #374151;"}}}
`,p=({health:e,children:t})=>r.jsx(G,{health:e,children:t||e}),N=({tree:e})=>r.jsxs(u,{title:"Basic Information",children:[r.jsx(i,{label:"Tree ID",children:e.name}),r.jsx(i,{label:"Species",children:e.species}),r.jsxs(i,{label:"Current Height",children:[e.height,"m"]}),r.jsx(i,{label:"Health Status",children:r.jsx(p,{health:e.health,children:e.health})}),r.jsx(i,{label:"Planted Date",children:"March 15, 2023"})]}),R=({tree:e})=>r.jsxs(u,{title:"Location & Contract",children:[r.jsx(i,{label:"Latitude",children:e.lat.toFixed(6)}),r.jsx(i,{label:"Longitude",children:e.lng.toFixed(6)}),r.jsxs(i,{label:"Forest",children:["Forest ",e.id<=4?"A":"B"]}),r.jsx(i,{label:"Contract Status",children:r.jsx("span",{className:"px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs",children:"Active"})}),r.jsx(i,{label:"Last Inspection",children:"Jan 15, 2024"})]}),A=o.div`
  margin-bottom: 2rem;
`,V=o.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  margin: 0 0 1rem 0;
`,W=o(M)`
  border-radius: 0.5rem;
  overflow: hidden;
`,J=o.thead``,K=({measurementHistory:e})=>{const{isDarkMode:t}=c(),a=[...e].sort((s,d)=>new Date(d.date)-new Date(s.date));return r.jsxs(A,{children:[r.jsx(V,{$isDarkMode:t,children:"Measurement History (Last 10 Entries)"}),r.jsxs(W,{children:[r.jsx(J,{children:r.jsxs(g,{children:[r.jsx(h,{children:"Date"}),r.jsx(h,{children:"Height (m)"}),r.jsx(h,{children:"Diameter (cm)"}),r.jsx(h,{children:"Health"})]})}),r.jsx("tbody",{children:a.slice(0,10).map((s,d)=>r.jsxs(g,{children:[r.jsx(m,{children:j(s.date)}),r.jsx(m,{children:s.height}),r.jsx(m,{children:s.diameter}),r.jsx(m,{children:r.jsx(p,{health:s.health,children:s.health})})]},d))})]})]})},q=o.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`,O=o.div`
  background: ${e=>e.$isDarkMode?"#374151":"#f9fafb"};
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  border: 1px solid ${e=>e.$isDarkMode?"#4b5563":"#e5e7eb"};
`,Q=o.div`
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
`,U=()=>r.jsx("svg",{className:"w-8 h-8",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"})}),b=({caption:e})=>{const{isDarkMode:t}=c();return r.jsxs(O,{$isDarkMode:t,children:[r.jsx(Q,{$isDarkMode:t,role:"img","aria-label":`${e} placeholder image`,children:r.jsx(U,{})}),r.jsx("div",{style:{fontSize:"0.75rem",color:t?"#9ca3af":"#6b7280"},children:e})]})},X=()=>r.jsxs(q,{children:[r.jsx(b,{caption:"Latest Photo"}),r.jsx(b,{caption:"Growth Progress"}),r.jsx(b,{caption:"Planting Day"})]}),Y=o.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`,Z=o.div`
  margin-bottom: 2rem;
`,_=o.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  margin: 0 0 1rem 0;
`,oe=({tree:e,isOpen:t,onClose:a})=>{const{containerRef:s}=$({onEscape:a,trapFocus:!0,autoFocus:!0}),{isDarkMode:d}=c(),l=y(e,t);return e?r.jsxs(L,{isOpen:t,onClose:a,title:e.name,containerRef:s,children:[r.jsxs(Y,{children:[r.jsx(N,{tree:e}),r.jsx(R,{tree:e})]}),r.jsx(K,{measurementHistory:l}),r.jsxs(Z,{children:[r.jsx(_,{$isDarkMode:d,children:"Tree Images"}),r.jsx(X,{})]})]}):null};export{oe as T};
