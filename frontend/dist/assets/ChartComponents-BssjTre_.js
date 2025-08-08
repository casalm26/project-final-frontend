import{j as n,d as r}from"./index-bfSkSDqu.js";const j=r.div`
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
`,C=r.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,w=r.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
`,d=r.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
`,l=r.div`
  text-align: center;
  margin-bottom: 1rem;
`,m=r.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: #10b981;
  line-height: 1;
`,g=r.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
`,x=r.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`,p=r.div`
  display: flex;
  align-items: center;
`,h=r.div`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  margin-right: 0.5rem;
  background-color: ${t=>t.color};
`,b=r.span`
  font-size: 0.875rem;
  color: #374151;
`,u=(t,e,o)=>e?e(t):`${t}${o}`,v=({active:t,payload:e,label:o,valueFormatter:s,unit:i=""})=>t&&e&&e.length?n.jsxs(d,{children:[n.jsx("p",{className:"font-medium",children:o}),e.map((a,c)=>n.jsx("p",{className:"text-sm text-gray-600",children:u(a.value,s,i)},c))]}):null,y=({value:t,label:e})=>n.jsxs(l,{children:[n.jsxs(m,{children:[t,"%"]}),n.jsx(g,{children:e})]}),L=({data:t})=>n.jsx(x,{children:t.map((e,o)=>n.jsxs(p,{children:[n.jsx(h,{color:e.color}),n.jsxs(b,{children:[e.name," (",e.value,"%)"]})]},o))});export{j as C,C as a,w as b,y as c,v as d,L as e};
