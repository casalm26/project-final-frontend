import{r as c,j as e,d as a,p as b,L as f}from"./index-Cp0G27Fl.js";import{u as j}from"./useKeyboardNavigation-BEEMcJj7.js";import{b as h,c as i,d as s,T as p,M as w}from"./Modal-BNFLubTG.js";const k=[{date:"2024-01-15",height:2.4,diameter:8.2,health:"healthy"},{date:"2024-02-15",height:2.3,diameter:8.1,health:"healthy"},{date:"2024-03-15",height:2.2,diameter:8,health:"healthy"},{date:"2024-04-15",height:2.1,diameter:7.9,health:"warning"},{date:"2024-05-15",height:2,diameter:7.8,health:"warning"},{date:"2024-06-15",height:1.9,diameter:7.7,health:"warning"},{date:"2024-07-15",height:1.8,diameter:7.6,health:"critical"},{date:"2024-08-15",height:1.7,diameter:7.5,health:"critical"},{date:"2024-09-15",height:1.6,diameter:7.4,health:"critical"},{date:"2024-10-15",height:1.5,diameter:7.3,health:"critical"}],v=(t,r)=>{const[o,l]=c.useState([]);return c.useEffect(()=>{t&&r&&l(k)},[t,r]),o},y=t=>c.useCallback(()=>{t&&(navigator.share?navigator.share({title:`Tree Details - ${t.name}`,text:`Check out this tree: ${t.name} (${t.species})`,url:window.location.href}):(navigator.clipboard.writeText(window.location.href),alert("Tree URL copied to clipboard!")))},[t]),T=a.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
`,I=a.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`,L=a.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`,C=a.span`
  color: #6b7280;
  font-size: 0.875rem;
`,H=a.span`
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
`,m=({title:t,children:r})=>e.jsxs(T,{children:[e.jsx(I,{children:t}),r]}),n=({label:t,children:r})=>e.jsxs(L,{children:[e.jsxs(C,{children:[t,":"]}),e.jsx(H,{children:r})]}),S=a.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${t=>{switch(t.health){case"healthy":return"background: #d1fae5; color: #065f46;";case"warning":return"background: #fef3c7; color: #92400e;";case"critical":return"background: #fee2e2; color: #991b1b;";default:return"background: #f3f4f6; color: #374151;"}}}
`,x=({health:t,children:r})=>e.jsx(S,{health:t,children:r||t}),M=({tree:t})=>e.jsxs(m,{title:"Basic Information",children:[e.jsx(n,{label:"Tree ID",children:t.name}),e.jsx(n,{label:"Species",children:t.species}),e.jsxs(n,{label:"Current Height",children:[t.height,"m"]}),e.jsx(n,{label:"Health Status",children:e.jsx(x,{health:t.health,children:t.health})}),e.jsx(n,{label:"Planted Date",children:"March 15, 2023"})]}),B=({tree:t})=>e.jsxs(m,{title:"Location & Contract",children:[e.jsx(n,{label:"Latitude",children:t.lat.toFixed(6)}),e.jsx(n,{label:"Longitude",children:t.lng.toFixed(6)}),e.jsxs(n,{label:"Forest",children:["Forest ",t.id<=4?"A":"B"]}),e.jsx(n,{label:"Contract Status",children:e.jsx("span",{className:"px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs",children:"Active"})}),e.jsx(n,{label:"Last Inspection",children:"Jan 15, 2024"})]}),z=a.div`
  margin-bottom: 2rem;
`,D=a.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`,F=a(p)`
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`,N=a.thead`
  background: #f3f4f6;
`,P=({measurementHistory:t})=>e.jsxs(z,{children:[e.jsx(D,{children:"Measurement History (Last 10 Entries)"}),e.jsxs(F,{children:[e.jsx(N,{children:e.jsxs(h,{children:[e.jsx(i,{children:"Date"}),e.jsx(i,{children:"Height (m)"}),e.jsx(i,{children:"Diameter (cm)"}),e.jsx(i,{children:"Health"})]})}),e.jsx("tbody",{children:t.slice(0,10).map((r,o)=>e.jsxs(h,{children:[e.jsx(s,{children:b(r.date)}),e.jsx(s,{children:r.height}),e.jsx(s,{children:r.diameter}),e.jsx(s,{children:e.jsx(x,{health:r.health,children:r.health})})]},o))})]})]}),$=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`,E=a.div`
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  border: 1px solid #e5e7eb;
`,G=a.div`
  width: 100%;
  height: 100px;
  background: #e5e7eb;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`,R=()=>e.jsx("svg",{className:"w-8 h-8",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"})}),d=({caption:t})=>e.jsxs(E,{children:[e.jsx(G,{children:e.jsx(R,{})}),e.jsx("div",{className:"text-xs text-gray-600",children:t})]}),V=()=>e.jsxs($,{children:[e.jsx(d,{caption:"Latest Photo"}),e.jsx(d,{caption:"Growth Progress"}),e.jsx(d,{caption:"Planting Day"})]}),A=a.button`
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
`,W=a(f)`
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
`,J=()=>e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"})}),K=()=>e.jsx("svg",{className:"w-4 h-4 mr-2 inline",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"})}),U=({tree:t,onShare:r})=>e.jsxs("div",{className:"flex justify-end space-x-3",children:[e.jsxs(W,{to:`/tree/${t.id}`,children:[e.jsx(J,{}),"View Full Page"]}),e.jsxs(A,{onClick:r,children:[e.jsx(K,{}),"Share Tree"]})]}),q=a.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`,Q=a.div`
  margin-bottom: 2rem;
`,X=a.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`,O=({tree:t,isOpen:r,onClose:o})=>{const{containerRef:l}=j({onEscape:o,trapFocus:!0,autoFocus:!0}),g=v(t,r),u=y(t);return t?e.jsxs(w,{isOpen:r,onClose:o,title:t.name,containerRef:l,children:[e.jsxs(q,{children:[e.jsx(M,{tree:t}),e.jsx(B,{tree:t})]}),e.jsx(P,{measurementHistory:g}),e.jsxs(Q,{children:[e.jsx(X,{children:"Tree Images"}),e.jsx(V,{})]}),e.jsx(U,{tree:t,onShare:u})]}):null};export{x as H,O as T,y as u};
