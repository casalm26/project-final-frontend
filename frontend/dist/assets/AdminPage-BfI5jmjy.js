import{j as e,n as k,r as d,e as I,u as v,d as a,N as E}from"./index-CGkKx7Xv.js";import{E as y,T as M,a as N,b as S,c as T,d as m,S as O,e as P,f as D,g as U}from"./Table-CfKObwuM.js";import{F as _,S as W,a as z,A as H,P as B}from"./FormElements-BsiOcVAQ.js";import"./vendor-BtP0CW_r.js";const p={CREATE:"CREATE",UPDATE:"UPDATE",DELETE:"DELETE",LOGIN:"LOGIN",LOGOUT:"LOGOUT"},F=[{value:"",label:"All Actions"},{value:p.CREATE,label:"Create"},{value:p.UPDATE,label:"Update"},{value:p.DELETE,label:"Delete"},{value:p.LOGIN,label:"Login"},{value:p.LOGOUT,label:"Logout"}],w=10,R=({searchTerm:t,setSearchTerm:s,actionFilter:r,setActionFilter:o})=>e.jsxs(_,{children:[e.jsx(W,{type:"text",placeholder:"Search by user, action, or details...",value:t,onChange:n=>s(n.target.value)}),e.jsx(z,{value:r,onChange:n=>o(n.target.value),children:F.map(n=>e.jsx("option",{value:n.value,children:n.label},n.value))})]}),G={ASC:"asc"},f={NONE:"⇅",ASC:"↑",DESC:"↓"},Z=(t,s,r)=>s!==t?f.NONE:r===G.ASC?f.ASC:f.DESC,A=({field:t,sortField:s,sortDirection:r,onSort:o,children:n})=>e.jsxs(T,{onClick:()=>o(t),children:[n," ",e.jsx(O,{children:Z(t,s,r)})]}),K=({sortField:t,sortDirection:s,onSort:r})=>e.jsx(N,{children:e.jsxs(S,{children:[e.jsx(A,{field:"timestamp",sortField:t,sortDirection:s,onSort:r,children:"Timestamp"}),e.jsx(A,{field:"user",sortField:t,sortDirection:s,onSort:r,children:"User"}),e.jsx(A,{field:"action",sortField:t,sortDirection:s,onSort:r,children:"Action"}),e.jsx(A,{field:"resource",sortField:t,sortDirection:s,onSort:r,children:"Resource"}),e.jsx(T,{children:"Details"}),e.jsx(T,{children:"IP Address"})]})}),V=({log:t})=>e.jsxs(S,{children:[e.jsx(m,{children:k(t.timestamp)}),e.jsx(m,{children:t.user}),e.jsx(m,{children:e.jsx(H,{action:t.action,children:t.action})}),e.jsx(m,{children:t.resource}),e.jsx(m,{children:t.details}),e.jsx(m,{children:t.ipAddress})]},t.id),X=({logs:t,sortField:s,sortDirection:r,onSort:o})=>t.length===0?e.jsx(y,{children:e.jsx("p",{children:"No audit logs found matching your criteria."})}):e.jsxs(M,{children:[e.jsx(K,{sortField:s,sortDirection:r,onSort:o}),e.jsx("tbody",{children:t.map(n=>e.jsx(V,{log:n},n.id))})]}),$=[{id:1,timestamp:"2024-01-15T10:30:00Z",user:"admin@nanwa.com",action:"CREATE",resource:"Tree",resourceId:"tree_001",details:"Created new tree record for Forest A",ipAddress:"192.168.1.100",userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"},{id:2,timestamp:"2024-01-15T10:25:00Z",user:"user@nanwa.com",action:"UPDATE",resource:"Tree",resourceId:"tree_002",details:"Updated height measurement from 2.3m to 2.4m",ipAddress:"192.168.1.101",userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},{id:3,timestamp:"2024-01-15T10:20:00Z",user:"admin@nanwa.com",action:"DELETE",resource:"Forest",resourceId:"forest_003",details:"Deleted forest record due to data cleanup",ipAddress:"192.168.1.100",userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"},{id:4,timestamp:"2024-01-15T10:15:00Z",user:"user@nanwa.com",action:"LOGIN",resource:"Authentication",resourceId:"auth_session_001",details:"User logged in successfully",ipAddress:"192.168.1.101",userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"},{id:5,timestamp:"2024-01-15T10:10:00Z",user:"admin@nanwa.com",action:"UPDATE",resource:"User",resourceId:"user_001",details:"Updated user permissions to admin level",ipAddress:"192.168.1.100",userAgent:"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"},{id:6,timestamp:"2024-01-15T10:05:00Z",user:"system",action:"CREATE",resource:"Measurement",resourceId:"measurement_001",details:"Automated measurement recorded for tree batch",ipAddress:"127.0.0.1",userAgent:"System/1.0"},{id:7,timestamp:"2024-01-15T10:00:00Z",user:"user@nanwa.com",action:"LOGOUT",resource:"Authentication",resourceId:"auth_session_002",details:"User logged out",ipAddress:"192.168.1.101",userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}],q=()=>{const[t,s]=d.useState([]),[r,o]=d.useState(!1),n=async()=>{o(!0);try{await new Promise(i=>setTimeout(i,500)),s($)}catch(i){console.error("Failed to fetch audit logs:",i)}finally{o(!1)}};return d.useEffect(()=>{n()},[]),{auditLogs:t,loading:r,refetchAuditLogs:n}},J=t=>{const[s,r]=d.useState(""),[o,n]=d.useState(""),[i,h]=d.useState("timestamp"),[l,g]=d.useState("desc"),b=d.useMemo(()=>t.filter(c=>{const x=s===""||c.user.toLowerCase().includes(s.toLowerCase())||c.details.toLowerCase().includes(s.toLowerCase())||c.resource.toLowerCase().includes(s.toLowerCase()),u=o===""||c.action===o;return x&&u}).sort((c,x)=>{const u=c[i],j=x[i];return l==="asc"?u>j?1:-1:u<j?1:-1}),[t,s,o,i,l]);return{searchTerm:s,setSearchTerm:r,actionFilter:o,setActionFilter:n,sortField:i,sortDirection:l,filteredAndSortedLogs:b,handleSort:c=>{i===c?g(l==="asc"?"desc":"asc"):(h(c),g("desc"))}}},Q=(t,s=w)=>{const[r,o]=d.useState(1),n=Math.ceil(t.length/s),i=(r-1)*s,h=t.slice(i,i+s);return d.useEffect(()=>{o(1)},[t.length]),{currentPage:r,setCurrentPage:o,totalPages:n,startIndex:i,paginatedData:h,pageSize:s}},Y=()=>{const{auditLogs:t,loading:s}=q(),{searchTerm:r,setSearchTerm:o,actionFilter:n,setActionFilter:i,sortField:h,sortDirection:l,filteredAndSortedLogs:g,handleSort:b}=J(t),{currentPage:L,setCurrentPage:c,totalPages:x,startIndex:u,paginatedData:j,pageSize:C}=Q(g,w);return e.jsxs(P,{children:[e.jsxs(D,{children:[e.jsx(U,{children:"Audit Log"}),e.jsx(R,{searchTerm:r,setSearchTerm:o,actionFilter:n,setActionFilter:i})]}),s?e.jsx(I,{text:"Loading audit logs..."}):e.jsx(X,{logs:j,sortField:h,sortDirection:l,onSort:b}),e.jsx(B,{currentPage:L,totalPages:x,startIndex:u,pageSize:C,totalItems:g.length,onPageChange:c})]})},ee=a.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
`,te=a.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`,se=a.a`
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
`,re=a.span`
  padding: 0.5rem 1rem;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
`,ne=a.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`,oe=a.span`
  font-size: 0.875rem;
  color: #374151;
`,ae=a.button`
  color: #374151;
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: color 0.2s;
  
  &:hover {
    color: #10b981;
  }
`,ie=()=>e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 19l-7-7m0 0l7-7m-7 7h18"})}),ce=()=>e.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"})}),de=()=>{const{user:t,logout:s}=v(),r=async()=>{await s()};return e.jsx(ee,{children:e.jsxs(te,{children:[e.jsxs(se,{href:"/dashboard",children:[e.jsx(ie,{}),"Back to Dashboard"]}),e.jsxs(ne,{children:[e.jsx(re,{children:"Admin Panel"}),e.jsxs(oe,{children:["Welcome, ",e.jsx("strong",{children:t==null?void 0:t.name})]}),e.jsx(ae,{onClick:r,"aria-label":"Logout",children:e.jsx(ce,{})})]})]})})},le=a.div`
  background: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`,ue=a.div`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
`,me=a.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`,he=a.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  
  ${t=>{switch(t.type){case"users":return"background: #dbeafe; color: #1e40af;";case"actions":return"background: #d1fae5; color: #065f46;";case"errors":return"background: #fee2e2; color: #991b1b;";case"activity":return"background: #fef3c7; color: #92400e;";default:return"background: #f3f4f6; color: #374151;"}}}
`,ge=({icon:t,value:s,label:r,type:o})=>e.jsxs(le,{children:[e.jsx(he,{type:o,children:t}),e.jsx(ue,{children:s}),e.jsx(me,{children:r})]}),xe=a.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`,pe=()=>e.jsx("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"})}),je=()=>e.jsx("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"})}),Ae=()=>e.jsx("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"})}),be=()=>e.jsx("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M13 10V3L4 14h7v7l9-11h-7z"})}),fe=()=>{const t=[{icon:e.jsx(pe,{}),value:"42",label:"Active Users",type:"users"},{icon:e.jsx(je,{}),value:"1,247",label:"Total Actions Today",type:"actions"},{icon:e.jsx(Ae,{}),value:"3",label:"Failed Actions",type:"errors"},{icon:e.jsx(be,{}),value:"98.5%",label:"System Uptime",type:"activity"}];return e.jsx(xe,{children:t.map((s,r)=>e.jsx(ge,{icon:s.icon,value:s.value,label:s.label,type:s.type},r))})},Te=a.div`
  min-height: 100vh;
  background-color: #f9fafb;
`,Le=a.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`,ve=a.div`
  margin-bottom: 2rem;
`,Se=a.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 1rem 0;
`,we=a.p`
  color: #6b7280;
  font-size: 1.125rem;
  margin: 0;
`,Ce=({children:t})=>e.jsx(Te,{children:t}),ke=({title:t,description:s})=>e.jsxs(ve,{children:[e.jsx(Se,{children:t}),e.jsx(we,{children:s})]}),Ie=({children:t})=>e.jsx(Le,{children:t}),Oe=()=>{const{isAdmin:t}=v();return t()?e.jsxs(Ce,{children:[e.jsx(de,{}),e.jsxs(Ie,{children:[e.jsx(ke,{title:"System Administration",description:"Monitor system activity and user actions with comprehensive audit logging."}),e.jsx(fe,{}),e.jsx(Y,{})]})]}):e.jsx(E,{to:"/dashboard",replace:!0})};export{Oe as AdminPage};
