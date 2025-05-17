import {VerticalTabsStep} from "../../vertical-tabs/interfaces/vertical-tabs-step";
const generalItems: VerticalTabsStep[] = [
  {
    label: "Business Registration",
    id: "business-registration",
    isActive: true,
  },
  {
    label: "Associates Details",
    id: "associate-details",
    isActive: false,
  },
  {
    label: "Business Owners",
    id: "business-owners",
    isActive: false,
  },
  {
    label: "Tax Details",
    id: "tax-details",
    isActive: false,
  }
];

const individualItems: VerticalTabsStep[] = [
  {
    label: "Business Registration",
    id: "business-registration",
    isActive: true,
  },
  {
    label: "Tax Details",
    id: "tax-details",
    isActive: false,
  },
  {
    label: "Curriculum Vitae",
    id: "curriculum-vitae",
    isActive: false,
  }
];

export const additionalDetailConstant = {
  generalItems,
  individualItems
}
