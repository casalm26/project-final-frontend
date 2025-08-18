import{r as h,o as s,j as r,d as t,s as j,L as p}from"./index-CJti3Ljs.js";import{u as k}from"./useKeyboardNavigation-C8Cgseht.js";import{b as m,c as d,d as l,T as M,M as $}from"./Modal-DbylYopw.js";const w=[{date:"2024-01-15",height:2.4,diameter:8.2,health:"healthy"},{date:"2024-02-15",height:2.3,diameter:8.1,health:"healthy"},{date:"2024-03-15",height:2.2,diameter:8,health:"healthy"},{date:"2024-04-15",height:2.1,diameter:7.9,health:"warning"},{date:"2024-05-15",height:2,diameter:7.8,health:"warning"},{date:"2024-06-15",height:1.9,diameter:7.7,health:"warning"},{date:"2024-07-15",height:1.8,diameter:7.6,health:"critical"},{date:"2024-08-15",height:1.7,diameter:7.5,health:"critical"},{date:"2024-09-15",height:1.6,diameter:7.4,health:"critical"},{date:"2024-10-15",height:1.5,diameter:7.3,health:"critical"}],D=(e,a)=>{const[o,n]=h.useState([]);return h.useEffect(()=>{e&&a&&n(w)},[e,a]),o},v=e=>h.useCallback(()=>{e&&(navigator.share?navigator.share({title:`Tree Details - ${e.name}`,text:`Check out this tree: ${e.name} (${e.species})`,url:window.location.href}):(navigator.clipboard.writeText(window.location.href),alert("Tree URL copied to clipboard!")))},[e]),y=t.div`
  background: ${e=>e.$isDarkMode?"#374151":"#f9fafb"};
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid ${e=>e.$isDarkMode?"#4b5563":"#e5e7eb"};
`,T=t.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  margin: 0 0 1rem 0;
`,I=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${e=>e.$isDarkMode?"#4b5563":"#e5e7eb"};
  
  &:last-child {
    border-bottom: none;
  }
`,L=t.span`
  color: ${e=>e.$isDarkMode?"#9ca3af":"#6b7280"};
  font-size: 0.875rem;
`,C=t.span`
  font-weight: 500;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  font-size: 0.875rem;
`,x=({title:e,children:a})=>{const{isDarkMode:o}=s();return r.jsxs(y,{$isDarkMode:o,children:[r.jsx(T,{$isDarkMode:o,children:e}),a]})},i=({label:e,children:a})=>{const{isDarkMode:o}=s();return r.jsxs(I,{$isDarkMode:o,children:[r.jsxs(L,{$isDarkMode:o,children:[e,":"]}),r.jsx(C,{$isDarkMode:o,children:a})]})},S=t.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${e=>{switch(e.health){case"healthy":return"background: #d1fae5; color: #065f46;";case"warning":return"background: #fef3c7; color: #92400e;";case"critical":return"background: #fee2e2; color: #991b1b;";default:return"background: #f3f4f6; color: #374151;"}}}
`,g=({health:e,children:a})=>r.jsx(S,{health:e,children:a||e}),H=({tree:e})=>r.jsxs(x,{title:"Basic Information",children:[r.jsx(i,{label:"Tree ID",children:e.name}),r.jsx(i,{label:"Species",children:e.species}),r.jsxs(i,{label:"Current Height",children:[e.height,"m"]}),r.jsx(i,{label:"Health Status",children:r.jsx(g,{health:e.health,children:e.health})}),r.jsx(i,{label:"Planted Date",children:"March 15, 2023"})]}),z=({tree:e})=>r.jsxs(x,{title:"Location & Contract",children:[r.jsx(i,{label:"Latitude",children:e.lat.toFixed(6)}),r.jsx(i,{label:"Longitude",children:e.lng.toFixed(6)}),r.jsxs(i,{label:"Forest",children:["Forest ",e.id<=4?"A":"B"]}),r.jsx(i,{label:"Contract Status",children:r.jsx("span",{className:"px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs",children:"Active"})}),r.jsx(i,{label:"Last Inspection",children:"Jan 15, 2024"})]}),B=t.div`
  margin-bottom: 2rem;
`,F=t.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  margin: 0 0 1rem 0;
`,P=t(M)`
  border-radius: 0.5rem;
  overflow: hidden;
`,E=t.thead``,N=({measurementHistory:e})=>{const{isDarkMode:a}=s();return r.jsxs(B,{children:[r.jsx(F,{$isDarkMode:a,children:"Measurement History (Last 10 Entries)"}),r.jsxs(P,{children:[r.jsx(E,{children:r.jsxs(m,{children:[r.jsx(d,{children:"Date"}),r.jsx(d,{children:"Height (m)"}),r.jsx(d,{children:"Diameter (cm)"}),r.jsx(d,{children:"Health"})]})}),r.jsx("tbody",{children:e.slice(0,10).map((o,n)=>r.jsxs(m,{children:[r.jsx(l,{children:j(o.date)}),r.jsx(l,{children:o.height}),r.jsx(l,{children:o.diameter}),r.jsx(l,{children:r.jsx(g,{health:o.health,children:o.health})})]},n))})]})]})},G=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`,R=t.div`
  background: ${e=>e.$isDarkMode?"#374151":"#f9fafb"};
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  border: 1px solid ${e=>e.$isDarkMode?"#4b5563":"#e5e7eb"};
`,V=t.div`
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
`,A=()=>r.jsx("svg",{className:"w-8 h-8",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"})}),c=({caption:e})=>{const{isDarkMode:a}=s();return r.jsxs(R,{$isDarkMode:a,children:[r.jsx(V,{$isDarkMode:a,role:"img","aria-label":`${e} placeholder image`,children:r.jsx(A,{})}),r.jsx("div",{style:{fontSize:"0.75rem",color:a?"#9ca3af":"#6b7280"},children:e})]})},W=()=>r.jsxs(G,{children:[r.jsx(c,{caption:"Latest Photo"}),r.jsx(c,{caption:"Growth Progress"}),r.jsx(c,{caption:"Planting Day"})]}),J=t.button`
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
`,K=t(p)`
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
`,U=()=>r.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"})}),q=()=>r.jsx("svg",{className:"w-4 h-4 mr-2 inline",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:r.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"})}),Q=({tree:e,onShare:a})=>r.jsxs("div",{className:"flex justify-end space-x-3",children:[r.jsxs(K,{to:`/tree/${e.id}`,children:[r.jsx(U,{}),"View Full Page"]}),r.jsxs(J,{onClick:a,children:[r.jsx(q,{}),"Share Tree"]})]}),X=t.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`,Y=t.div`
  margin-bottom: 2rem;
`,Z=t.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  margin: 0 0 1rem 0;
`,re=({tree:e,isOpen:a,onClose:o})=>{const{containerRef:n}=k({onEscape:o,trapFocus:!0,autoFocus:!0}),{isDarkMode:u}=s(),f=D(e,a),b=v(e);return e?r.jsxs($,{isOpen:a,onClose:o,title:e.name,containerRef:n,children:[r.jsxs(X,{children:[r.jsx(H,{tree:e}),r.jsx(z,{tree:e})]}),r.jsx(N,{measurementHistory:f}),r.jsxs(Y,{children:[r.jsx(Z,{$isDarkMode:u,children:"Tree Images"}),r.jsx(W,{})]}),r.jsx(Q,{tree:e,onShare:b})]}):null};export{g as H,re as T,v as u};
