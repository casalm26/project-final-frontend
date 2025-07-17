import{R as w,j as e,o as v,d as r,L as C,p as L}from"./index-Dzr7PBfw.js";import{H as k}from"./MapSidebar-DZT3HTLm.js";const I=w.forwardRef(({loading:n,loadingText:o="Loading...",children:i,...m},g)=>e.jsx(v,{ref:g,loading:n,...m,children:n?o:i}));I.displayName="LoadingButton";const T=({className:n="",...o})=>e.jsx("svg",{className:n,fill:"none",stroke:"currentColor",viewBox:"0 0 24 24","aria-hidden":"true",...o,children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 12H5M12 19l-7-7 7-7"})}),y=r.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
`,z=r.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,H=r.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
`,b=r.button`
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
`,B=r(C)`
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
`,M=()=>e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 19l-7-7 7-7"})}),S=()=>e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5l7 7-7 7"})}),D=()=>e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"})}),J=({onPrevious:n,onNext:o,onShare:i,hasPrevious:m,hasNext:g})=>e.jsx(y,{children:e.jsxs(z,{children:[e.jsxs(B,{to:"/map",children:[e.jsx(T,{}),"Back to Map"]}),e.jsxs(H,{children:[e.jsxs(b,{onClick:n,disabled:!m,children:[e.jsx(M,{}),"Previous"]}),e.jsxs(b,{onClick:o,disabled:!g,children:["Next",e.jsx(S,{})]}),e.jsxs(b,{onClick:i,children:[e.jsx(D,{}),"Share"]})]})]})}),N=r.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`,s=r.div`
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
`,t=r.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
`,d=r.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
`,$=r.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
`,R=r.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`,q=({tree:n})=>e.jsxs(R,{children:[e.jsx($,{children:"Tree Information"}),e.jsxs(N,{children:[e.jsxs(s,{children:[e.jsx(t,{children:"Current Height"}),e.jsxs(d,{children:[n.height,"m"]})]}),e.jsxs(s,{children:[e.jsx(t,{children:"Health Status"}),e.jsx(d,{children:e.jsx(k,{health:n.health,children:n.health})})]}),e.jsxs(s,{children:[e.jsx(t,{children:"Species"}),e.jsx(d,{children:n.species})]}),e.jsxs(s,{children:[e.jsx(t,{children:"Planted Date"}),e.jsx(d,{children:"Mar 15, 2023"})]})]})]}),P=r.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`,p=r.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`,f=r.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
`,j=r.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`,a=r.div`
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
`,K=({tree:n})=>e.jsxs(P,{children:[e.jsxs(p,{children:[e.jsx(f,{children:"Location"}),e.jsxs(j,{children:[e.jsxs(a,{children:[e.jsx(l,{children:"Latitude"}),e.jsx(c,{children:n.lat.toFixed(6)})]}),e.jsxs(a,{children:[e.jsx(l,{children:"Longitude"}),e.jsx(c,{children:n.lng.toFixed(6)})]})]})]}),e.jsxs(p,{children:[e.jsx(f,{children:"Contract Details"}),e.jsxs(j,{children:[e.jsxs(a,{children:[e.jsx(l,{children:"Status"}),e.jsx(c,{children:e.jsx("span",{className:"px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs",children:"Active"})})]}),e.jsxs(a,{children:[e.jsx(l,{children:"Last Inspection"}),e.jsx(c,{children:"Jan 15, 2024"})]})]})]})]}),W=r.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`,A=r.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1.5rem 0;
`,G=r.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`,F=r.thead`
  background: #f9fafb;
`,u=r.tr`
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`,h=r.td`
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  color: #111827;
`,x=r.th`
  padding: 0.75rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
`,O=({measurements:n})=>e.jsxs(W,{children:[e.jsx(A,{children:"Measurement History"}),e.jsxs(G,{children:[e.jsx(F,{children:e.jsxs(u,{children:[e.jsx(x,{children:"Date"}),e.jsx(x,{children:"Height (m)"}),e.jsx(x,{children:"Diameter (cm)"}),e.jsx(x,{children:"Health"})]})}),e.jsx("tbody",{children:n.slice(0,10).map((o,i)=>e.jsxs(u,{children:[e.jsx(h,{children:L(o.date)}),e.jsx(h,{children:o.height}),e.jsx(h,{children:o.diameter}),e.jsx(h,{children:e.jsx(k,{health:o.health,children:o.health})})]},i))})]})]}),Q=r.div`
  min-height: 100vh;
  background-color: #f9fafb;
`,U=r.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`,X=r.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`,Y=r.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
`,Z=r.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
`,_=r.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`,ee=r.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;export{T as B,_ as C,U as M,Q as P,J as T,X as a,Y as b,Z as c,ee as d,q as e,O as f,K as g};
