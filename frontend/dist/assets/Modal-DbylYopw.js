import{d as o,o as b,j as a}from"./index-CJti3Ljs.js";const r=()=>{const e=document.documentElement.classList.contains("dark");return{containerBg:e?"#1f2937":"#ffffff",containerBorder:e?"#374151":"#e5e7eb",containerShadow:e?"0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)":"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",headerBg:e?"#374151":"#f9fafb",headerBorder:e?"#4b5563":"#e5e7eb",headerText:e?"#f9fafb":"#111827",cellText:e?"#e5e7eb":"#111827",cellBorder:e?"#4b5563":"#f3f4f6",cellHover:e?"#374151":"#f9fafb",cellHeaderText:e?"#d1d5db":"#374151",cellHeaderHover:e?"#4b5563":"#f3f4f6",mutedText:e?"#9ca3af":"#6b7280",sortIcon:e?"#6b7280":"#9ca3af"}},$=o.div`
  background: ${()=>r().containerBg};
  border-radius: 0.75rem;
  box-shadow: ${()=>r().containerShadow};
  border: 1px solid ${()=>r().containerBorder};
  overflow: hidden;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`,v=o.div`
  background: ${()=>r().headerBg};
  padding: 1.5rem;
  border-bottom: 1px solid ${()=>r().headerBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`,M=o.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${()=>r().headerText};
  margin: 0;
  transition: color 0.2s ease;
`,T=o.table`
  width: 100%;
  border-collapse: collapse;
`,w=o.thead`
  background: ${()=>r().headerBg};
  border-bottom: 1px solid ${()=>r().headerBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
`,j=o.tr`
  border-bottom: 1px solid ${()=>r().cellBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
  
  &:hover {
    background: ${()=>r().cellHover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`,B=o.th`
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
`,D=o.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${()=>r().cellText};
  vertical-align: top;
  transition: color 0.2s ease;
`,y=o.div`
  text-align: center;
  padding: 3rem;
  color: ${()=>r().mutedText};
  transition: color 0.2s ease;
`,H=o.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: ${()=>r().sortIcon};
  transition: color 0.2s ease;
`,f=o.div`
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
`,g=o.div`
  background: ${e=>e.$isDarkMode?"#1f2937":"white"};
  border-radius: 0.75rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
  outline: none;
`,x=o.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid ${e=>e.$isDarkMode?"#374151":"#e5e7eb"};
  background: ${e=>e.$isDarkMode?"#111827":"#f9fafb"};
  border-radius: 0.75rem 0.75rem 0 0;
`,m=o.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${e=>e.$isDarkMode?"#f9fafb":"#111827"};
  margin: 0;
`,p=o.button`
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
`,u=o.div`
  padding: 1.5rem;
`,h=()=>a.jsx("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:a.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})}),C=({isOpen:e,onClose:n,title:d,children:i,containerRef:l})=>{const{isDarkMode:t}=b(),c=s=>{s.target===s.currentTarget&&n()};return e?a.jsx(f,{onClick:c,role:"presentation",children:a.jsxs(g,{ref:l,role:"dialog","aria-modal":"true","aria-labelledby":"modal-title",tabIndex:"-1",$isDarkMode:t,children:[a.jsxs(x,{$isDarkMode:t,children:[a.jsx(m,{id:"modal-title",$isDarkMode:t,children:d}),a.jsx(p,{onClick:n,"aria-label":"Close modal",type:"button",$isDarkMode:t,children:a.jsx(h,{})})]}),a.jsx(u,{children:i})]})}):null};export{y as E,C as M,H as S,T,w as a,j as b,B as c,D as d,$ as e,v as f,M as g};
