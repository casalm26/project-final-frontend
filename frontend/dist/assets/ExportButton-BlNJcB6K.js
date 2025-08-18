import{r as u,j as e,d as o,l as g}from"./index-CJti3Ljs.js";import{e as b}from"./dataService-2Ma-xxGM.js";const y=o.div`
  position: relative;
  display: inline-block;
`,L=o.button`
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
`,S=o.div`
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
`,k=o.button`
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
`;o.div`
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
`;const C=o.div`
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
`,V=o.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  z-index: 50;
  
  ${r=>r.type==="success"&&`
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  `}
  
  ${r=>r.type==="error"&&`
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `}
`,M=({onExportStart:r,onExportComplete:n,onExportError:a})=>{const[c,i]=u.useState(!1),[p,d]=u.useState(!1),[x,m]=u.useState(null),f=()=>({}),l=(s,t)=>{m({message:s,type:t}),setTimeout(()=>m(null),3e3)},v=async()=>{i(!1),d(!0);try{r&&r();const s=f(),t=`nanwa_trees_export_${g(new Date)}.csv`;await b.exportTreesCSV(s,t),l("CSV exported successfully","success"),n&&n("csv")}catch(s){console.error("CSV export error:",s),l(s.message||"CSV export failed","error"),a&&a(s)}finally{d(!1)}},j=async()=>{i(!1),d(!0);try{r&&r();const s=f(),t=`nanwa_trees_export_${g(new Date)}.xlsx`;await b.exportTreesXLSX(s,t),l("XLSX exported successfully","success"),n&&n("xlsx")}catch(s){console.error("XLSX export error:",s),l(s.message||"XLSX export failed","error"),a&&a(s)}finally{d(!1)}},w=()=>{p||i(!c)},h=s=>{s.target.closest(".export-container")||i(!1)};return c?document.addEventListener("click",h):document.removeEventListener("click",h),e.jsxs(y,{className:"export-container",children:[e.jsx(L,{onClick:w,disabled:p,children:p?e.jsxs(e.Fragment,{children:[e.jsx(C,{}),"Exporting..."]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),"Export Data",e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]})}),c&&e.jsxs(S,{children:[e.jsxs(k,{onClick:v,children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Export as CSV"}),e.jsx("div",{className:"text-xs",children:"Comma-separated values"})]})]}),e.jsxs(k,{onClick:j,children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"})}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Export as XLSX"}),e.jsx("div",{className:"text-xs",children:"Excel spreadsheet"})]})]})]}),x&&e.jsx(V,{type:x.type,children:x.message})]})};export{M as E};
