import{j as r,d as e,r as u}from"./index-bfSkSDqu.js";const x=e.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${o=>{switch(o.action){case"CREATE":return"background: #d1fae5; color: #065f46;";case"UPDATE":return"background: #dbeafe; color: #1e40af;";case"DELETE":return"background: #fee2e2; color: #991b1b;";case"LOGIN":return"background: #fef3c7; color: #92400e;";case"LOGOUT":return"background: #f3f4f6; color: #374151;";default:return"background: #f3f4f6; color: #374151;"}}}
`,E=({action:o,children:i})=>r.jsx(x,{action:o,children:i||o}),g=({currentPage:o,totalPages:i,maxVisiblePages:t=5})=>{const n=u.useMemo(()=>{const c=[];for(let s=0;s<Math.min(t,i);s++){const d=o-2+s;d>0&&d<=i&&c.push(d)}return c},[o,i,t]),p=o>1,a=o>1,f=o<i,m=o<i;return{pageNumbers:n,canGoFirst:p,canGoPrevious:a,canGoNext:f,canGoLast:m}},h=e.div`
  font-size: 0.875rem;
  color: #6b7280;
`,w=({startIndex:o,pageSize:i,totalItems:t})=>{const n=Math.min(o+i,t);return r.jsxs(h,{"aria-live":"polite",children:["Showing ",o+1," to ",n," of ",t," entries"]})},k=e.button`
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
`,v=({pageNumbers:o,currentPage:i,onPageChange:t})=>r.jsx(r.Fragment,{children:o.map(n=>r.jsx("li",{style:{listStyle:"none"},children:r.jsx(k,{onClick:()=>t(n),className:i===n?"active":"","aria-current":i===n?"page":void 0,"aria-label":`Go to page ${n}`,children:n})},n))}),j=e.nav`
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,y=e.ul`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
`,l=e.button`
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
`,S=({currentPage:o,totalPages:i,startIndex:t,pageSize:n,totalItems:p,onPageChange:a})=>{const{pageNumbers:f,canGoFirst:m,canGoPrevious:c,canGoNext:s,canGoLast:d}=g({currentPage:o,totalPages:i});return r.jsxs(j,{role:"navigation","aria-label":"Pagination",children:[r.jsx(w,{startIndex:t,pageSize:n,totalItems:p}),r.jsxs(y,{children:[r.jsx("li",{children:r.jsx(l,{onClick:()=>a(1),disabled:!m,"aria-label":"Go to first page",children:"First"})}),r.jsx("li",{children:r.jsx(l,{onClick:()=>a(o-1),disabled:!c,"aria-label":"Go to previous page",children:"Previous"})}),r.jsx(v,{pageNumbers:f,currentPage:o,onPageChange:a}),r.jsx("li",{children:r.jsx(l,{onClick:()=>a(o+1),disabled:!s,"aria-label":"Go to next page",children:"Next"})}),r.jsx("li",{children:r.jsx(l,{onClick:()=>a(i),disabled:!d,"aria-label":"Go to last page",children:"Last"})})]})]})},b=`
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
`,F=e.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;e.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;e.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;const L=e.input`
  ${b}
  min-width: 200px;
  flex: 1;
`;e.input`
  ${b}
  width: 100%;
`;const $=e.select`
  ${b}
  cursor: pointer;
`;e.textarea`
  ${b}
  width: 100%;
  min-height: 100px;
  resize: vertical;
`;const G=e.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;e(G)`
  &::after {
    content: ' *';
    color: #ef4444;
  }
`;e.span`
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
`;e.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;e.input.attrs({type:"checkbox"})`
  width: 1rem;
  height: 1rem;
  accent-color: #10b981;
  cursor: pointer;
`;e.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;e.input.attrs({type:"radio"})`
  width: 1rem;
  height: 1rem;
  accent-color: #10b981;
  cursor: pointer;
`;e.fieldset`
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
`;e.span`
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;export{E as A,F,S as P,L as S,$ as a};
