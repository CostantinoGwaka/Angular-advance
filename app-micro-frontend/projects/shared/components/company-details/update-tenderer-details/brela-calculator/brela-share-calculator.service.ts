import { Injectable } from '@angular/core';


type Company = {
  name: string;
  countryCode: "TZ" | "NOT TZ";
  percentage: number;
  owned_by?: Company[];
};

type OwnershipResult = {
  localOwnership: number;
  status: "Locally Owned" | "Foreign Owned";
  reason: string[];
};

@Injectable({
  providedIn: 'root'
})
export class BrelaShareCalculatorService {

  constructor() { }


  computeLocalOwnership(company: Company): { localOwnership: number; reason: string[] } {
    if (!company.owned_by || company.owned_by.length === 0) {
      // If the company is foreign, it is automatically foreign-owned
      return {
        localOwnership: company.countryCode === "TZ" ? 100 : 0,
        reason: [`${company.name} is ${company.countryCode === "TZ" ? "locally" : "foreign"} registered`],
      };
    }

    let totalLocalOwnership = 0;
    let reasons: string[] = [];

    for (const owner of company.owned_by) {
      let ownerResult = this.computeLocalOwnership(owner);
      let ownerContribution = (ownerResult.localOwnership * owner.percentage) / 100;
      totalLocalOwnership += ownerContribution;

      reasons.push(`${owner.name} contributes ${ownerContribution.toFixed(2)}% local ownership (${owner.percentage}% share of ${ownerResult.localOwnership.toFixed(2)}%)`);
      reasons = reasons.concat(ownerResult.reason);
    }

    return { localOwnership: totalLocalOwnership, reason: reasons };
  }

  computeLocalOwnershipCalculation(company: Company): { localOwnership: number; reason: string[] } {

    if (!company.owned_by || company.owned_by.length === 0) {
      // If the company is foreign, it is automatically foreign-owned
      return {
        localOwnership: company.countryCode === "TZ" ? 100 : 0,
        reason: [],
      };
    }

    let totalLocalOwnership = 0;
    let reasons: string[] = [];

    for (const owner of company.owned_by) {
      let ownerResult = this.computeLocalOwnershipCalculation(owner);
      let ownerContribution = (ownerResult.localOwnership * owner.percentage) / 100;
      totalLocalOwnership += ownerContribution;

      reasons.push(`${owner.name} contributes ${ownerContribution.toFixed(2)}% local ownership (${owner.percentage}% share of ${ownerResult.localOwnership.toFixed(2)}%)`);
      reasons = reasons.concat(ownerResult.reason);
    }

    return { localOwnership: totalLocalOwnership, reason: reasons };
  }

  getCompanyOwnership(company_ownership: Company[]): OwnershipResult {
    let totalLocalOwnership = 0;
    let reasons: string[] = [];

    // Traverse all listed companies and calculate their contribution
    for (const company of company_ownership) {
      let ownerResult = this.computeLocalOwnership(company);
      let contribution = (ownerResult.localOwnership * company.percentage) / 100;
      totalLocalOwnership += contribution;

      reasons.push(`${company.name} contributes ${contribution.toFixed(2)}% local ownership (${company.percentage}% share of ${ownerResult.localOwnership.toFixed(2)}%)`);
      reasons = reasons.concat(ownerResult.reason);
    }

    return {
      localOwnership: totalLocalOwnership,
      status: totalLocalOwnership >= 51 ? "Locally Owned" : "Foreign Owned",
      reason: reasons,
    };
  }

  getCalculations(company_ownership: any[]): string[] {
    const calculations: string[] = [];

    for (const company of company_ownership) {
      const ownerResult = this.computeLocalOwnershipCalculation(company);
      const contribution = (ownerResult.localOwnership * company.percentage) / 100;
      calculations.push(
        `${company.name} contributes: ${contribution.toFixed(2)}% local ownership (`
        + `${company.percentage}% share of ${ownerResult.localOwnership.toFixed(2)}%)`
      );
      calculations.push(...ownerResult.reason);
    }

    return calculations;
  }
}
