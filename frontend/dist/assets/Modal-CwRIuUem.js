import{d as e,j as t}from"./index-bfSkSDqu.js";const r=()=>{const o=document.documentElement.classList.contains("dark");return{containerBg:o?"#1f2937":"#ffffff",containerBorder:o?"#374151":"#e5e7eb",containerShadow:o?"0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)":"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",headerBg:o?"#374151":"#f9fafb",headerBorder:o?"#4b5563":"#e5e7eb",headerText:o?"#f9fafb":"#111827",cellText:o?"#e5e7eb":"#111827",cellBorder:o?"#4b5563":"#f3f4f6",cellHover:o?"#374151":"#f9fafb",cellHeaderText:o?"#d1d5db":"#374151",cellHeaderHover:o?"#4b5563":"#f3f4f6",mutedText:o?"#9ca3af":"#6b7280",sortIcon:o?"#6b7280":"#9ca3af"}},h=e.div`
  background: ${()=>r().containerBg};
  border-radius: 0.75rem;
  box-shadow: ${()=>r().containerShadow};
  border: 1px solid ${()=>r().containerBorder};
  overflow: hidden;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`,k=e.div`
  background: ${()=>r().headerBg};
  padding: 1.5rem;
  border-bottom: 1px solid ${()=>r().headerBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`,v=e.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${()=>r().headerText};
  margin: 0;
  transition: color 0.2s ease;
`,T=e.table`
  width: 100%;
  border-collapse: collapse;
`,w=e.thead`
  background: ${()=>r().headerBg};
  border-bottom: 1px solid ${()=>r().headerBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
`,j=e.tr`
  border-bottom: 1px solid ${()=>r().cellBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
  
  &:hover {
    background: ${()=>r().cellHover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`,B=e.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${()=>r().cellHeaderText};
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background: ${()=>r().cellHeaderHover};
  }
`,$=e.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${()=>r().cellText};
  vertical-align: top;
  transition: color 0.2s ease;
`,y=e.div`
  text-align: center;
  padding: 3rem;
  color: ${()=>r().mutedText};
  transition: color 0.2s ease;
`,H=e.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: ${()=>r().sortIcon};
  transition: color 0.2s ease;
`,c=e.div`
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
`,b=e.div`
  background: white;
  border-radius: 0.75rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  outline: none;
`,f=e.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0.75rem 0.75rem 0 0;
`,g=e.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`,x=e.button`
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
  
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.45);
  }
`,m=e.div`
  padding: 1.5rem;
`,p=()=>t.jsx("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})}),C=({isOpen:o,onClose:a,title:s,children:d,containerRef:l})=>{const i=n=>{n.target===n.currentTarget&&a()};return o?t.jsx(c,{onClick:i,role:"presentation",children:t.jsxs(b,{ref:l,role:"dialog","aria-modal":"true","aria-labelledby":"modal-title",tabIndex:"-1",children:[t.jsxs(f,{children:[t.jsx(g,{id:"modal-title",children:s}),t.jsx(x,{onClick:a,"aria-label":"Close modal",type:"button",children:t.jsx(p,{})})]}),t.jsx(m,{children:d})]})}):null};export{y as E,C as M,H as S,T,w as a,j as b,B as c,$ as d,h as e,k as f,v as g};
