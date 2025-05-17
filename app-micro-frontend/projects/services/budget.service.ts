import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BalanceResponse {
	message: string | null;
	glAccount: string;
	status: string;
	fundingReferenceNo?: string;
	amount: number;
}

@Injectable({
	providedIn: 'root',
})
export class BudgetService {
	private museBudgetBalanceUrl = '/nest-api/api/muse/budget/balance';
	private museFundBalanceUrl = '/nest-api/api/muse/fund/balance';
	private ermsBudgetFundBalanceUrl = '/nest-api/api/erms/budget/fund/balance';

	constructor(private http: HttpClient) {}

	getBudgetBalance(
		glCode: string[],
		financialYear: string,
		budgetSystem: string,
	): Observable<BalanceResponse[]> {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
		});

		const body = {
			glCode,
			financialYear,
			messageType: 'BUDGET_BALANCE_REQUEST',
		};
		if (budgetSystem == 'MUSE') {
			return this.http.post<any>(
				environment.AUTH_URL + this.museBudgetBalanceUrl,
				body,
				{ headers },
			);
		} else if (budgetSystem == 'ERMS###ERMS_CLOUD_01') {
			return this.getErmsBudgetFundBalance(glCode, budgetSystem).pipe(
				map((response) => [
					{
						message: '',
						glAccount: glCode[0],
						status: 'Success',
						amount: response.budgetBalance,
					},
				]),
			);
		} else {
			return of<BalanceResponse[]>([
				{
					message: '',
					glAccount: glCode[0],
					status: 'Failed',
					amount: 0,
				},
			]);
		}
	}

	getFundBalance(
		glCode: string[],
		financialYear: string,
		budgetSystem: string,
	): Observable<BalanceResponse[]> {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
		});

		const body = {
			glCode,
			financialYear,
			messageType: 'FUND_BALANCE_REQUEST',
		};
		if (budgetSystem == 'MUSE') {
			return this.http.post<any>(
				environment.AUTH_URL + this.museFundBalanceUrl,
				body,
				{ headers },
			);
		} else if (budgetSystem == 'ERMS###ERMS_CLOUD_01') {
			return this.getErmsBudgetFundBalance(glCode, budgetSystem).pipe(
				map((response) => [
					{
						message: '',
						glAccount: glCode[0],
						status: 'Success',
						amount: response.fundBalance,
					},
				]),
			);
		} else {
			return of<BalanceResponse[]>([
				{
					message: '',
					glAccount: glCode[0],
					status: 'Failed',
					amount: 0,
				},
			]);
		}
	}

	getErmsBudgetFundBalance(glCode: string[], budgetSystem: string) {
		const headers = new HttpHeaders({
			'Content-Type': 'application/json',
		});

		const body = {
			glCode,
			budgetSystem,
		};
		return this.http.post<any>(
			environment.AUTH_URL + this.ermsBudgetFundBalanceUrl,
			body,
			{ headers },
		);
	}

	getValueByIndexFromMuseGL(
		glAccountCode: string,
		index: number,
	): string | null {
		// Split the string by the '|' separator
		const parts = glAccountCode.split('|');

		// Check if the index is within the range of the array
		if (index >= 0 && index < parts.length) {
			return parts[index];
		} else {
			// Return null if the index is out of range
			return null;
		}
	}

	getSubBudgetClassFromGL(glAccountCode: string): string | null {
		return this.getValueByIndexFromMuseGL(glAccountCode, 6);
	}

	getDepartmentCodeFromGL(glAccountCode: string): string | null {
		return this.getValueByIndexFromMuseGL(glAccountCode, 1);
	}

	// Method to get class names for a given category
	getClassNamesForCategory(category: string): string[] | undefined {
		return this.categoryClasses[category];
	}

	// Method to get the list of main categories
	getMainCategories(): string[] {
		return Object.keys(this.categoryClasses);
	}
	private categoryClasses: { [key: string]: string[] } = {
		Inventory: [
			'Consumable',
			'Fuel',
			'Oil and Lubricants',
			'Spareparts and tyres',
			'IT and Computer Accessories',
			'Food stuff',
		],
		Asset: [
			'Office Equipment',
			'Furniture and Fittings',
			'MOTOR VEHICLE/MOTOR CYCLE/ PLANTS/ MACHINERY',
			'Building',
			'Infrastructure',
			'Biological Assets',
			'Land',
		],
		Service: ['Service'],
		Expense: ['Expense'],
		'Work in Progress': [
			'Dwelling - WIP',
			'Building other than Dwelling - WIP',
			'Other structure - WIP',
			'Transportation equipment - WIP',
			'Machinery and Equipment other than Transport Equipment - WIP',
			'Machinery and equipment not elsewhere classified - WIP',
			'WIP',
		],
	};
}
