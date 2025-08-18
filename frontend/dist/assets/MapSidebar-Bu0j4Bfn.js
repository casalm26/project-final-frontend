import{R as v,j as e,p as y,d as r,L as z,q as L}from"./index-DpfrmWgL.js";import{H as w}from"./TreeDetailModal-Cjn3fHnN.js";const C=v.forwardRef(({loading:o,loadingText:i="Loading...",children:n,...p},g)=>e.jsx(y,{ref:g,loading:o,...p,children:o?i:n}));C.displayName="LoadingButton";r.div`
  position: relative;
  display: inline-block;
`;r.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;r.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  z-index: 50;
  margin-top: 0.5rem;
  overflow: hidden;
  color: #111827; /* ensure readable text on white in dark mode */
`;r.button`
  width: 100%;
  padding: 0.75rem 1rem;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #111827;
  
  &:hover {
    background: #f9fafb;
  }
  
  &:focus {
    outline: none;
    background: #f0fdf4;
  }
`;r.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
`;r.div`
  width: 20px;
  height: 20px;
  border: 2px solid #f3f4f6;
  border-top: 2px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;r.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  z-index: 50;
  
  ${o=>o.type==="success"&&`
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  `}
  
  ${o=>o.type==="error"&&`
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `}
`;r.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${o=>{switch(o.action){case"CREATE":return"background: #d1fae5; color: #065f46;";case"UPDATE":return"background: #dbeafe; color: #1e40af;";case"DELETE":return"background: #fee2e2; color: #991b1b;";case"LOGIN":return"background: #fef3c7; color: #92400e;";case"LOGOUT":return"background: #f3f4f6; color: #374151;";default:return"background: #f3f4f6; color: #374151;"}}}
`;r.div`
  font-size: 0.875rem;
  color: #6b7280;
`;r.button`
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &.active {
    background: #10b981;
    color: white;
    border-color: #10b981;
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
  }
`;r.nav`
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;r.ul`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
`;r.button`
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #f9fafb;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
  }
`;const h=`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &:disabled {
    background-color: #f3f4f6;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;r.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;r.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;r.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;r.input`
  ${h}
  min-width: 200px;
  flex: 1;
`;r.input`
  ${h}
  width: 100%;
`;r.select`
  ${h}
  cursor: pointer;
`;r.textarea`
  ${h}
  width: 100%;
  min-height: 100px;
  resize: vertical;
`;const T=r.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;r(T)`
  &::after {
    content: ' *';
    color: #ef4444;
  }
`;r.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;r.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;r.input.attrs({type:"checkbox"})`
  width: 1rem;
  height: 1rem;
  accent-color: #10b981;
  cursor: pointer;
`;r.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;r.input.attrs({type:"radio"})`
  width: 1rem;
  height: 1rem;
  accent-color: #10b981;
  cursor: pointer;
`;r.fieldset`
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0;
  
  legend {
    font-size: 0.875rem;
    font-weight: 600;
    color: #374151;
    padding: 0 0.5rem;
  }
`;r.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;const I=({className:o="",...i})=>e.jsx("svg",{className:o,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",...i,children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 12H5M12 19l-7-7 7-7"})}),H=r.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
`,$=r.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,B=r.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
`,f=r.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #374151;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #e5e7eb;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`,M=r(z)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background: #059669;
  }
`,D=()=>e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 19l-7-7 7-7"})}),S=()=>e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})}),N=()=>e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"})}),q=({onPrevious:o,onNext:i,onShare:n,hasPrevious:p,hasNext:g})=>e.jsx(H,{children:e.jsxs($,{children:[e.jsxs(M,{to:"/map",children:[e.jsx(I,{}),"Back to Map"]}),e.jsxs(B,{children:[e.jsxs(f,{onClick:o,disabled:!p,children:[e.jsx(D,{}),"Previous"]}),e.jsxs(f,{onClick:i,disabled:!g,children:["Next",e.jsx(S,{})]}),e.jsxs(f,{onClick:n,children:[e.jsx(N,{}),"Share"]})]})]})}),E=r.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`,t=r.div`
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`,d=r.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`,a=r.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`,R=r.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
`,A=r.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`,J=({tree:o})=>e.jsxs(A,{children:[e.jsx(R,{children:"Tree Information"}),e.jsxs(E,{children:[e.jsxs(t,{children:[e.jsx(d,{children:"Current Height"}),e.jsxs(a,{children:[o.height,"m"]})]}),e.jsxs(t,{children:[e.jsx(d,{children:"Health Status"}),e.jsx(a,{children:e.jsx(w,{health:o.health,children:o.health})})]}),e.jsxs(t,{children:[e.jsx(d,{children:"Species"}),e.jsx(a,{children:o.species})]}),e.jsxs(t,{children:[e.jsx(d,{children:"Planted Date"}),e.jsx(a,{children:"Mar 15, 2023"})]})]})]}),G=r.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`,x=r.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`,u=r.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
`,j=r.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`,s=r.div`
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`,l=r.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`,c=r.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`,K=({tree:o})=>e.jsxs(G,{children:[e.jsxs(x,{children:[e.jsx(u,{children:"Location"}),e.jsxs(j,{children:[e.jsxs(s,{children:[e.jsx(l,{children:"Latitude"}),e.jsx(c,{children:o.lat.toFixed(6)})]}),e.jsxs(s,{children:[e.jsx(l,{children:"Longitude"}),e.jsx(c,{children:o.lng.toFixed(6)})]})]})]}),e.jsxs(x,{children:[e.jsx(u,{children:"Contract Details"}),e.jsxs(j,{children:[e.jsxs(s,{children:[e.jsx(l,{children:"Status"}),e.jsx(c,{children:e.jsx("span",{className:"px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs",children:"Active"})})]}),e.jsxs(s,{children:[e.jsx(l,{children:"Last Inspection"}),e.jsx(c,{children:"Jan 15, 2024"})]})]})]})]}),P=r.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`,W=r.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
`,O=r.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`,F=r.thead`
  background: #f9fafb;
`,k=r.tr`
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`,b=r.td`
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  color: #111827;
`,m=r.th`
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`,Q=({measurements:o})=>e.jsxs(P,{children:[e.jsx(W,{children:"Measurement History"}),e.jsxs(O,{children:[e.jsx(F,{children:e.jsxs(k,{children:[e.jsx(m,{children:"Date"}),e.jsx(m,{children:"Height (m)"}),e.jsx(m,{children:"Diameter (cm)"}),e.jsx(m,{children:"Health"})]})}),e.jsx("tbody",{children:o.slice(0,10).map((i,n)=>e.jsxs(k,{children:[e.jsx(b,{children:L(i.date)}),e.jsx(b,{children:i.height}),e.jsx(b,{children:i.diameter}),e.jsx(b,{children:e.jsx(w,{health:i.health,children:i.health})})]},n))})]})]}),X=r.div`
  min-height: 100vh;
  background-color: #f9fafb;
`,Y=r.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`,Z=r.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`,_=r.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
`,ee=r.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
`,re=r.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`,oe=r.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;r.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
  
  @media (prefers-color-scheme: dark) {
    background: #1f2937;
    border-bottom-color: #374151;
  }
  
  .dark & {
    background: #1f2937;
    border-bottom-color: #374151;
  }
`;r.aside`
  background: white;
  border-right: 1px solid #e5e7eb;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 10;
  
  @media (prefers-color-scheme: dark) {
    background: #1f2937;
    border-right-color: #374151;
  }
  
  .dark & {
    background: #1f2937;
    border-right-color: #374151;
  }
`;export{I as B,re as C,Y as M,X as P,q as T,Z as a,_ as b,ee as c,oe as d,J as e,Q as f,K as g};
