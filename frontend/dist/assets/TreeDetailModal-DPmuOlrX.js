import{r as m,j as e,d as t,p as f,L as j}from"./index-CGkKx7Xv.js";import{u as p}from"./useKeyboardNavigation-Bh0nMcUg.js";import{b as g,c as s,d as l,T as w}from"./Table-CfKObwuM.js";const k=[{date:"2024-01-15",height:2.4,diameter:8.2,health:"healthy"},{date:"2024-02-15",height:2.3,diameter:8.1,health:"healthy"},{date:"2024-03-15",height:2.2,diameter:8,health:"healthy"},{date:"2024-04-15",height:2.1,diameter:7.9,health:"warning"},{date:"2024-05-15",height:2,diameter:7.8,health:"warning"},{date:"2024-06-15",height:1.9,diameter:7.7,health:"warning"},{date:"2024-07-15",height:1.8,diameter:7.6,health:"critical"},{date:"2024-08-15",height:1.7,diameter:7.5,health:"critical"},{date:"2024-09-15",height:1.6,diameter:7.4,health:"critical"},{date:"2024-10-15",height:1.5,diameter:7.3,health:"critical"}],v=(r,n)=>{const[a,i]=m.useState([]);return m.useEffect(()=>{r&&n&&i(k)},[r,n]),a},y=r=>m.useCallback(()=>{r&&(navigator.share?navigator.share({title:`Tree Details - ${r.name}`,text:`Check out this tree: ${r.name} (${r.species})`,url:window.location.href}):(navigator.clipboard.writeText(window.location.href),alert("Tree URL copied to clipboard!")))},[r]),T=t.div`
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
`,C=t.div`
  background: white;
  border-radius: 0.75rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
`,I=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0.75rem 0.75rem 0 0;
`,L=t.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`,M=t.button`
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
    color: #111827;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`,H=t.div`
  padding: 1.5rem;
`,S=()=>e.jsx("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})}),B=({isOpen:r,onClose:n,title:a,children:i,containerRef:d})=>{const c=x=>{x.target===x.currentTarget&&n()};return r?e.jsx(T,{onClick:c,children:e.jsxs(C,{ref:d,role:"dialog","aria-modal":"true","aria-labelledby":"modal-title",children:[e.jsxs(I,{children:[e.jsx(L,{id:"modal-title",children:a}),e.jsx(M,{onClick:n,"aria-label":"Close modal",children:e.jsx(S,{})})]}),e.jsx(H,{children:i})]})}):null},z=t.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
`,D=t.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`,N=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`,F=t.span`
  color: #6b7280;
  font-size: 0.875rem;
`,P=t.span`
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
`,u=({title:r,children:n})=>e.jsxs(z,{children:[e.jsx(D,{children:r}),n]}),o=({label:r,children:n})=>e.jsxs(N,{children:[e.jsxs(F,{children:[r,":"]}),e.jsx(P,{children:n})]}),$=t.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${r=>{switch(r.health){case"healthy":return"background: #d1fae5; color: #065f46;";case"warning":return"background: #fef3c7; color: #92400e;";case"critical":return"background: #fee2e2; color: #991b1b;";default:return"background: #f3f4f6; color: #374151;"}}}
`,b=({health:r,children:n})=>e.jsx($,{health:r,children:n||r}),E=({tree:r})=>e.jsxs(u,{title:"Basic Information",children:[e.jsx(o,{label:"Tree ID",children:r.name}),e.jsx(o,{label:"Species",children:r.species}),e.jsxs(o,{label:"Current Height",children:[r.height,"m"]}),e.jsx(o,{label:"Health Status",children:e.jsx(b,{health:r.health,children:r.health})}),e.jsx(o,{label:"Planted Date",children:"March 15, 2023"})]}),G=({tree:r})=>e.jsxs(u,{title:"Location & Contract",children:[e.jsx(o,{label:"Latitude",children:r.lat.toFixed(6)}),e.jsx(o,{label:"Longitude",children:r.lng.toFixed(6)}),e.jsxs(o,{label:"Forest",children:["Forest ",r.id<=4?"A":"B"]}),e.jsx(o,{label:"Contract Status",children:e.jsx("span",{className:"px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs",children:"Active"})}),e.jsx(o,{label:"Last Inspection",children:"Jan 15, 2024"})]}),R=t.div`
  margin-bottom: 2rem;
`,V=t.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`,W=t(w)`
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`,A=t.thead`
  background: #f3f4f6;
`,J=({measurementHistory:r})=>e.jsxs(R,{children:[e.jsx(V,{children:"Measurement History (Last 10 Entries)"}),e.jsxs(W,{children:[e.jsx(A,{children:e.jsxs(g,{children:[e.jsx(s,{children:"Date"}),e.jsx(s,{children:"Height (m)"}),e.jsx(s,{children:"Diameter (cm)"}),e.jsx(s,{children:"Health"})]})}),e.jsx("tbody",{children:r.slice(0,10).map((n,a)=>e.jsxs(g,{children:[e.jsx(l,{children:f(n.date)}),e.jsx(l,{children:n.height}),e.jsx(l,{children:n.diameter}),e.jsx(l,{children:e.jsx(b,{health:n.health,children:n.health})})]},a))})]})]}),K=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`,U=t.div`
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  border: 1px solid #e5e7eb;
`,q=t.div`
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
`,O=()=>e.jsx("svg",{className:"w-8 h-8",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"})}),h=({caption:r})=>e.jsxs(U,{children:[e.jsx(q,{children:e.jsx(O,{})}),e.jsx("div",{className:"text-xs text-gray-600",children:r})]}),Q=()=>e.jsxs(K,{children:[e.jsx(h,{caption:"Latest Photo"}),e.jsx(h,{caption:"Growth Progress"}),e.jsx(h,{caption:"Planting Day"})]}),X=t.button`
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
`,Y=t(j)`
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
`,Z=()=>e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"})}),_=()=>e.jsx("svg",{className:"w-4 h-4 mr-2 inline",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"})}),ee=({tree:r,onShare:n})=>e.jsxs("div",{className:"flex justify-end space-x-3",children:[e.jsxs(Y,{to:`/tree/${r.id}`,children:[e.jsx(Z,{}),"View Full Page"]}),e.jsxs(X,{onClick:n,children:[e.jsx(_,{}),"Share Tree"]})]}),re=t.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`,te=t.div`
  margin-bottom: 2rem;
`,ne=t.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`,se=({tree:r,isOpen:n,onClose:a})=>{const{containerRef:i}=p({onEscape:a,trapFocus:!0,autoFocus:!0}),d=v(r,n),c=y(r);return r?e.jsxs(B,{isOpen:n,onClose:a,title:r.name,containerRef:i,children:[e.jsxs(re,{children:[e.jsx(E,{tree:r}),e.jsx(G,{tree:r})]}),e.jsx(J,{measurementHistory:d}),e.jsxs(te,{children:[e.jsx(ne,{children:"Tree Images"}),e.jsx(Q,{})]}),e.jsx(ee,{tree:r,onShare:c})]}):null};export{b as H,se as T,y as u};
