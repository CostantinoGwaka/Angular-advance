export const tenderSubCategoryGoods =  [
  "Standard Invitation for Quotation - Goods",
  "Supply and Installation - Information Systems",
  "Supply and Installation - Plants and Equipment",
  "Petroleum and Gas",
  "Commodities",
  "Textbooks and Reading Materials",
  "Health Sector Goods",
  "General Goods",
  "Procurement of Pesticides",
  "Micro Value Form - Goods",
  "Standard Invitation for Minor Value Procurement - Goods",
  "Mini Competition Quotation - Goods",
  "Kotesheni ya ununuzi wa Bidhaa"
];
export const tenderSubCategoryWorks = [
  "Design and Build",
  "Standard Invitation for Quotations - Works",
  "Works Subcontracts",
  "Small Works",
  "Medium and Large Works",
  "Standard Invitation for Minor Value Procurement - Works",
  "Nyaraka Sanifu Za Mwaliko Wa Kotesheni (Makundi Maalum)",
  "Nyaraka Sanifu Za Mwaliko Wa Kotesheni - Ununuzi Wa Kandarasi Ndogo Ndogo Za Ujenzi",
  "Micro Value Form - Works"
];

export const tenderSubCategoryConsultancy = [
  "Standard Request for Proposals - Timebased contracts",
  "Standard Request for Proposal-Lumpsum Contracts",
  "Standard Request for Proposal-Individual"
];

export const tenderSubCategoryNonConsultancy = [
  "Standard Invitation for Minor Value Procurement - Non Consultancy",
  "General Non-Consultancy",
  "Standard Invitation for Quotation- Non-consultancy",
  "Kotesheni ya Huduma zisizo za Kitaalam",
  "Micro Value Form - Non Consultancy",
  "Mini Competition Quotation - Non consultancy"
];

export const frameworkSubCategoryGoods = [
'Closed Framework Contracts for Supplies of Goods',
'Open Framework Contracts for Supplies of Goods'
];

export const frameworkSubCategoryWorks = [
  'Closed Framework Contracts for Works',
  'Open Framework Contracts for Works'
];

export const frameworkSubCategoryConsultancy = [

];

export const frameworkSubCategoryNonConsultancy = [
  'Closed Framework Contract for Non Consultancy',
  'Open Framework Contract for Non Consultancy'
];


export const preQualificationSubCategoryGoods = [
'Prequalification Documents for Goods'
];

export const preQualificationSubCategoryWorks = [
'Standard Prequalification Document for Procurement of Works'
];

export const preQualificationSubCategoryConsultancy = [
'Standard Prequalification Document for Consultancy'
];

export const preQualificationSubCategoryNonConsultancy = [
  'Standard Pre-qualification Document - Non Consultancy'
];


export const subCategory:any = {
  tendering:{
    G:tenderSubCategoryGoods,
    W:tenderSubCategoryWorks,
    C:tenderSubCategoryConsultancy,
    NC:tenderSubCategoryNonConsultancy
  },
  preQualification:{
    G:preQualificationSubCategoryGoods,
    W:preQualificationSubCategoryWorks,
    C:preQualificationSubCategoryConsultancy,
    NC:preQualificationSubCategoryNonConsultancy
  },
  frameworks:{
    G:frameworkSubCategoryGoods,
    W:frameworkSubCategoryWorks,
    C:frameworkSubCategoryConsultancy,
    NC:frameworkSubCategoryNonConsultancy
  }
}


