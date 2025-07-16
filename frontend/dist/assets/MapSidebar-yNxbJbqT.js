import{r as x,j as e,d as t,p as f,L as j,u}from"./index-DJ39NcK9.js";import{u as k}from"./useKeyboardNavigation-C5b08Ak3.js";import{b as g,c as i,d as l,T as v}from"./Table-BCdM5JW5.js";const w=[{date:"2024-01-15",height:2.4,diameter:8.2,health:"healthy"},{date:"2024-02-15",height:2.3,diameter:8.1,health:"healthy"},{date:"2024-03-15",height:2.2,diameter:8,health:"healthy"},{date:"2024-04-15",height:2.1,diameter:7.9,health:"warning"},{date:"2024-05-15",height:2,diameter:7.8,health:"warning"},{date:"2024-06-15",height:1.9,diameter:7.7,health:"warning"},{date:"2024-07-15",height:1.8,diameter:7.6,health:"critical"},{date:"2024-08-15",height:1.7,diameter:7.5,health:"critical"},{date:"2024-09-15",height:1.6,diameter:7.4,health:"critical"},{date:"2024-10-15",height:1.5,diameter:7.3,health:"critical"}],y=(r,n)=>{const[o,s]=x.useState([]);return x.useEffect(()=>{r&&n&&s(w)},[r,n]),o},L=r=>x.useCallback(()=>{r&&(navigator.share?navigator.share({title:`Tree Details - ${r.name}`,text:`Check out this tree: ${r.name} (${r.species})`,url:window.location.href}):(navigator.clipboard.writeText(window.location.href),alert("Tree URL copied to clipboard!")))},[r]),M=t.div`
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
`,C=t.div`
  background: white;
  border-radius: 0.75rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
`,N=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 0.75rem 0.75rem 0 0;
`,H=t.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`,T=t.button`
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
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`,I=t.div`
  padding: 1.5rem;
`,z=()=>e.jsx("svg",{className:"w-6 h-6",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M6 18L18 6M6 6l12 12"})}),B=({isOpen:r,onClose:n,title:o,children:s,containerRef:d})=>{const c=m=>{m.target===m.currentTarget&&n()};return r?e.jsx(M,{onClick:c,children:e.jsxs(C,{ref:d,role:"dialog","aria-modal":"true","aria-labelledby":"modal-title",children:[e.jsxs(N,{children:[e.jsx(H,{id:"modal-title",children:o}),e.jsx(T,{onClick:n,"aria-label":"Close modal",children:e.jsx(z,{})})]}),e.jsx(I,{children:s})]})}):null},S=t.div`
  background: #f9fafb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
`,V=t.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`,W=t.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
  
  &:last-child {
    border-bottom: none;
  }
`,D=t.span`
  color: #6b7280;
  font-size: 0.875rem;
`,A=t.span`
  font-weight: 500;
  color: #111827;
  font-size: 0.875rem;
`,p=({title:r,children:n})=>e.jsxs(S,{children:[e.jsx(V,{children:r}),n]}),a=({label:r,children:n})=>e.jsxs(W,{children:[e.jsxs(D,{children:[r,":"]}),e.jsx(A,{children:n})]}),P=t.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  
  ${r=>{switch(r.health){case"healthy":return"background: #d1fae5; color: #065f46;";case"warning":return"background: #fef3c7; color: #92400e;";case"critical":return"background: #fee2e2; color: #991b1b;";default:return"background: #f3f4f6; color: #374151;"}}}
`,b=({health:r,children:n})=>e.jsx(P,{health:r,children:n||r}),E=({tree:r})=>e.jsxs(p,{title:"Basic Information",children:[e.jsx(a,{label:"Tree ID",children:r.name}),e.jsx(a,{label:"Species",children:r.species}),e.jsxs(a,{label:"Current Height",children:[r.height,"m"]}),e.jsx(a,{label:"Health Status",children:e.jsx(b,{health:r.health,children:r.health})}),e.jsx(a,{label:"Planted Date",children:"March 15, 2023"})]}),F=({tree:r})=>e.jsxs(p,{title:"Location & Contract",children:[e.jsx(a,{label:"Latitude",children:r.lat.toFixed(6)}),e.jsx(a,{label:"Longitude",children:r.lng.toFixed(6)}),e.jsxs(a,{label:"Forest",children:["Forest ",r.id<=4?"A":"B"]}),e.jsx(a,{label:"Contract Status",children:e.jsx("span",{className:"px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs",children:"Active"})}),e.jsx(a,{label:"Last Inspection",children:"Jan 15, 2024"})]}),$=t.div`
  margin-bottom: 2rem;
`,G=t.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`,R=t(v)`
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`,J=t.thead`
  background: #f3f4f6;
`,K=({measurementHistory:r})=>e.jsxs($,{children:[e.jsx(G,{children:"Measurement History (Last 10 Entries)"}),e.jsxs(R,{children:[e.jsx(J,{children:e.jsxs(g,{children:[e.jsx(i,{children:"Date"}),e.jsx(i,{children:"Height (m)"}),e.jsx(i,{children:"Diameter (cm)"}),e.jsx(i,{children:"Health"})]})}),e.jsx("tbody",{children:r.slice(0,10).map((n,o)=>e.jsxs(g,{children:[e.jsx(l,{children:f(n.date)}),e.jsx(l,{children:n.height}),e.jsx(l,{children:n.diameter}),e.jsx(l,{children:e.jsx(b,{health:n.health,children:n.health})})]},o))})]})]}),U=t.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`,q=t.div`
  background: #f9fafb;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  border: 1px solid #e5e7eb;
`,O=t.div`
  width: 100%;
  height: 100px;
  background: #e5e7eb;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`,Q=()=>e.jsx("svg",{className:"w-8 h-8",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"})}),h=({caption:r})=>e.jsxs(q,{children:[e.jsx(O,{children:e.jsx(Q,{})}),e.jsx("div",{className:"text-xs text-gray-600",children:r})]}),X=()=>e.jsxs(U,{children:[e.jsx(h,{caption:"Latest Photo"}),e.jsx(h,{caption:"Growth Progress"}),e.jsx(h,{caption:"Planting Day"})]}),Y=t.button`
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
`,Z=t(j)`
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`,_=()=>e.jsx("svg",{className:"w-4 h-4",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"})}),ee=()=>e.jsx("svg",{className:"w-4 h-4 mr-2 inline",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"})}),re=({tree:r,onShare:n})=>e.jsxs("div",{className:"flex justify-end space-x-3",children:[e.jsxs(Z,{to:`/tree/${r.id}`,children:[e.jsx(_,{}),"View Full Page"]}),e.jsxs(Y,{onClick:n,children:[e.jsx(ee,{}),"Share Tree"]})]}),te=t.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`,ne=t.div`
  margin-bottom: 2rem;
`,oe=t.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`,ce=({tree:r,isOpen:n,onClose:o})=>{const{containerRef:s}=k({onEscape:o,trapFocus:!0,autoFocus:!0}),d=y(r,n),c=L(r);return r?e.jsxs(B,{isOpen:n,onClose:o,title:r.name,containerRef:s,children:[e.jsxs(te,{children:[e.jsx(E,{tree:r}),e.jsx(F,{tree:r})]}),e.jsx(K,{measurementHistory:d}),e.jsxs(ne,{children:[e.jsx(oe,{children:"Tree Images"}),e.jsx(X,{})]}),e.jsx(re,{tree:r,onShare:c})]}):null},ae=t.header`
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
`,he=()=>{const{user:r,logout:n,isAdmin:o}=u(),s=async()=>{await n()};return e.jsx(ae,{children:e.jsx("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("div",{className:"flex items-center",children:e.jsx("h1",{className:"text-2xl font-bold text-green-600",children:"Nanwa Map View"})}),e.jsxs("div",{className:"flex items-center space-x-4",children:[e.jsxs("div",{className:"text-sm text-gray-700",children:["Welcome, ",e.jsx("span",{className:"font-medium",children:r==null?void 0:r.name}),o()&&e.jsx("span",{className:"ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full",children:"Admin"})]}),e.jsx("button",{onClick:s,className:"text-gray-700 hover:text-green-600 transition-colors",children:e.jsx("svg",{className:"h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"})})})]})]})})})},se=t.aside`
  background: white;
  border-right: 1px solid #e5e7eb;
  width: 250px;
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  overflow-y: auto;
  z-index: 10;
`,xe=()=>{const{isAdmin:r}=u();return e.jsx(se,{children:e.jsx("div",{className:"p-6",children:e.jsxs("nav",{className:"space-y-2",children:[e.jsxs("a",{href:"/dashboard",className:"flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors",children:[e.jsxs("svg",{className:"mr-3 h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"})]}),"Dashboard"]}),e.jsxs("a",{href:"#map",className:"flex items-center px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg",children:[e.jsxs("svg",{className:"mr-3 h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:[e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"}),e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M15 11a3 3 0 11-6 0 3 3 0 016 0z"})]}),"Map View"]}),e.jsxs("a",{href:"#export",className:"flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors",children:[e.jsx("svg",{className:"mr-3 h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),"Data Export"]}),r()&&e.jsxs("a",{href:"#audit",className:"flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors",children:[e.jsx("svg",{className:"mr-3 h-5 w-5",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"})}),"Audit Log"]})]})})})};export{b as H,he as M,ce as T,xe as a,L as u};
