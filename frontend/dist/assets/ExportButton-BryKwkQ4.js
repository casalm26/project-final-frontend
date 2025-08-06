import{A as C,r as m,j as e,d as o,i as x}from"./index-CGkKx7Xv.js";const f=new C,k={exportTreesCSV:(t={},r="trees_export.csv")=>f.downloadFile("/exports/trees/csv",t,r),exportTreesXLSX:(t={},r="trees_export.xlsx")=>f.downloadFile("/exports/trees/xlsx",t,r),exportForestAnalytics:(t={},r="forest_analytics.xlsx")=>f.downloadFile("/exports/forest-analytics",t,r)},L=o.div`
  position: relative;
  display: inline-block;
`,X=o.button`
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
`,V=o.div`
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
`,j=o.button`
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
`;const D=o.div`
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
`,F=o.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  z-index: 50;
  
  ${t=>t.type==="success"&&`
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  `}
  
  ${t=>t.type==="error"&&`
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `}
`,_=({filters:t={},onExportStart:r,onExportComplete:n,onExportError:i})=>{const[p,d]=m.useState(!1),[u,l]=m.useState(!1),[h,g]=m.useState(null),b=()=>{const s={};return t.selectedForests&&t.selectedForests.length>0&&(s.forestIds=t.selectedForests.join(",")),t.dateRange&&(s.startDate=x(t.dateRange.startDate),s.endDate=x(t.dateRange.endDate)),t.species&&(s.species=t.species),t.health&&(s.health=t.health),s},c=(s,a)=>{g({message:s,type:a}),setTimeout(()=>g(null),3e3)},w=async()=>{d(!1),l(!0);try{r&&r();const s=b(),a=`nanwa_trees_export_${x(new Date)}.csv`;await k.exportTreesCSV(s,a),c("CSV exported successfully","success"),n&&n("csv")}catch(s){console.error("CSV export error:",s),c(s.message||"CSV export failed","error"),i&&i(s)}finally{l(!1)}},y=async()=>{d(!1),l(!0);try{r&&r();const s=b(),a=`nanwa_trees_export_${x(new Date)}.xlsx`;await k.exportTreesXLSX(s,a),c("XLSX exported successfully","success"),n&&n("xlsx")}catch(s){console.error("XLSX export error:",s),c(s.message||"XLSX export failed","error"),i&&i(s)}finally{l(!1)}},S=()=>{u||d(!p)},v=s=>{s.target.closest(".export-container")||d(!1)};return p?document.addEventListener("click",v):document.removeEventListener("click",v),e.jsxs(L,{className:"export-container",children:[e.jsx(X,{onClick:S,disabled:u,children:u?e.jsxs(e.Fragment,{children:[e.jsx(D,{}),"Exporting..."]}):e.jsxs(e.Fragment,{children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),"Export Data",e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]})}),p&&e.jsxs(V,{children:[e.jsxs(j,{onClick:w,children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Export as CSV"}),e.jsx("div",{className:"text-xs text-gray-500",children:"Comma-separated values"})]})]}),e.jsxs(j,{onClick:y,children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"})}),e.jsxs("div",{children:[e.jsx("div",{className:"font-medium",children:"Export as XLSX"}),e.jsx("div",{className:"text-xs text-gray-500",children:"Excel spreadsheet"})]})]})]}),h&&e.jsx(F,{type:h.type,children:h.message})]})};export{_ as E};
