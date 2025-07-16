import{j as n,d as e,r as u}from"./index-DJ39NcK9.js";const x=e.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${o=>{switch(o.action){case"CREATE":return"background: #d1fae5; color: #065f46;";case"UPDATE":return"background: #dbeafe; color: #1e40af;";case"DELETE":return"background: #fee2e2; color: #991b1b;";case"LOGIN":return"background: #fef3c7; color: #92400e;";case"LOGOUT":return"background: #f3f4f6; color: #374151;";default:return"background: #f3f4f6; color: #374151;"}}}
`,E=({action:o,children:r})=>n.jsx(x,{action:o,children:r||o}),g=({currentPage:o,totalPages:r,maxVisiblePages:t=5})=>{const i=u.useMemo(()=>{const c=[];for(let d=0;d<Math.min(t,r);d++){const a=o-2+d;a>0&&a<=r&&c.push(a)}return c},[o,r,t]),f=o>1,s=o>1,p=o<r,m=o<r;return{pageNumbers:i,canGoFirst:f,canGoPrevious:s,canGoNext:p,canGoLast:m}},h=e.div`
  font-size: 0.875rem;
  color: #6b7280;
`,k=({startIndex:o,pageSize:r,totalItems:t})=>{const i=Math.min(o+r,t);return n.jsxs(h,{children:["Showing ",o+1," to ",i," of ",t," entries"]})},w=e.button`
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
`,v=({pageNumbers:o,currentPage:r,onPageChange:t})=>n.jsx(n.Fragment,{children:o.map(i=>n.jsx(w,{onClick:()=>t(i),className:r===i?"active":"",children:i},i))}),y=e.div`
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,j=e.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
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
`,F=({currentPage:o,totalPages:r,startIndex:t,pageSize:i,totalItems:f,onPageChange:s})=>{const{pageNumbers:p,canGoFirst:m,canGoPrevious:c,canGoNext:d,canGoLast:a}=g({currentPage:o,totalPages:r});return n.jsxs(y,{children:[n.jsx(k,{startIndex:t,pageSize:i,totalItems:f}),n.jsxs(j,{children:[n.jsx(l,{onClick:()=>s(1),disabled:!m,children:"First"}),n.jsx(l,{onClick:()=>s(o-1),disabled:!c,children:"Previous"}),n.jsx(v,{pageNumbers:p,currentPage:o,onPageChange:s}),n.jsx(l,{onClick:()=>s(o+1),disabled:!d,children:"Next"}),n.jsx(l,{onClick:()=>s(r),disabled:!a,children:"Last"})]})]})},b=`
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
`,L=e.div`
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
`;const S=e.input`
  ${b}
  min-width: 200px;
  flex: 1;
`;e.input`
  ${b}
  width: 100%;
`;const N=e.select`
  ${b}
  cursor: pointer;
`;e.textarea`
  ${b}
  width: 100%;
  min-height: 100px;
  resize: vertical;
`;const z=e.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
`;e(z)`
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
`;export{E as A,L as F,F as P,S,N as a};
