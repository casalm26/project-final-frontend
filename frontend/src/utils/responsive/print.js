export const printStyles = `
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    
    body {
      font-size: 12pt;
      line-height: 1.4;
    }
    
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
    }
    
    p, li {
      page-break-inside: avoid;
    }
    
    img {
      max-width: 100% !important;
      height: auto !important;
    }
    
    .no-print {
      display: none !important;
    }
  }
`;

export default {
  printStyles,
};