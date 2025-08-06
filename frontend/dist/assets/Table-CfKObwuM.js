import{d as r}from"./index-CGkKx7Xv.js";const e=()=>{const o=document.documentElement.classList.contains("dark");return{containerBg:o?"#1f2937":"#ffffff",containerBorder:o?"#374151":"#e5e7eb",containerShadow:o?"0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)":"0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",headerBg:o?"#374151":"#f9fafb",headerBorder:o?"#4b5563":"#e5e7eb",headerText:o?"#f9fafb":"#111827",cellText:o?"#e5e7eb":"#111827",cellBorder:o?"#4b5563":"#f3f4f6",cellHover:o?"#374151":"#f9fafb",cellHeaderText:o?"#d1d5db":"#374151",cellHeaderHover:o?"#4b5563":"#f3f4f6",mutedText:o?"#9ca3af":"#6b7280",sortIcon:o?"#6b7280":"#9ca3af"}},t=r.div`
  background: ${()=>e().containerBg};
  border-radius: 0.75rem;
  box-shadow: ${()=>e().containerShadow};
  border: 1px solid ${()=>e().containerBorder};
  overflow: hidden;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`,n=r.div`
  background: ${()=>e().headerBg};
  padding: 1.5rem;
  border-bottom: 1px solid ${()=>e().headerBorder};
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease, border-color 0.2s ease;
`,s=r.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${()=>e().headerText};
  margin: 0;
  transition: color 0.2s ease;
`,d=r.table`
  width: 100%;
  border-collapse: collapse;
`,c=r.thead`
  background: ${()=>e().headerBg};
  border-bottom: 1px solid ${()=>e().headerBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
`,l=r.tr`
  border-bottom: 1px solid ${()=>e().cellBorder};
  transition: background-color 0.2s ease, border-color 0.2s ease;
  
  &:hover {
    background: ${()=>e().cellHover};
  }
  
  &:last-child {
    border-bottom: none;
  }
`,i=r.th`
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${()=>e().cellHeaderText};
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease, color 0.2s ease;
  
  &:hover {
    background: ${()=>e().cellHeaderHover};
  }
`,b=r.td`
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: ${()=>e().cellText};
  vertical-align: top;
  transition: color 0.2s ease;
`,f=r.div`
  text-align: center;
  padding: 3rem;
  color: ${()=>e().mutedText};
  transition: color 0.2s ease;
`,g=r.span`
  margin-left: 0.5rem;
  font-size: 0.75rem;
  color: ${()=>e().sortIcon};
  transition: color 0.2s ease;
`;export{f as E,g as S,d as T,c as a,l as b,i as c,b as d,t as e,n as f,s as g};
