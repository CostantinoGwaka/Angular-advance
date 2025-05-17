import { Injectable } from '@angular/core';
import {
	GET_CURRENCY_CONVERSION_RATE,
	GET_EXCHANGE_RATES_PAGINATED,
} from 'src/app/modules/nest-tender-initiation/store/submission/works-financial/works-financila.graphql';
import { GraphqlService } from '../../services/graphql.service';
import { NotificationService } from '../../services/notification.service';
import { ApolloNamespace } from '../../apollo.config';
import { map, Observable } from 'rxjs';

export interface ExchangeRatesResult {
	success: boolean;
	deleteOld?: boolean;
	data?: ExchangeRate;
	message?: string;
	exchangedAmount?: number;
}

export interface ExchangeRate {
	currencyUuid: string;
	currencyCode: string;
	transactionDate: string;
	currencyId: number;
	sellingRate: number;
	buyingRate: number;
}

@Injectable({
	providedIn: 'root',
})
export class ExchangeRateServiceService {
	constructor(
		private apollo: GraphqlService,
		private notificationService: NotificationService
	) {}

	async getExchangeRate(
		currency: string,
		date: string
	): Promise<ExchangeRatesResult> {
		try {
			let res: any = await this.apollo.fetchData({
				query: GET_CURRENCY_CONVERSION_RATE,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					convertingDTO: {
						currencyCode: currency,
						transactionDate: date,
					},
				},
			});
			if (res?.data.results.code == 9000) {
				return {
					success: true,
					data: res.data.results.data,
				};
			} else {
				return {
					success: false,
					message: 'Failed to get exchange rate',
				};
			}
		} catch (e) {
			return {
				success: false,
				deleteOld: false,
				message: 'Failed to get exchange rate',
			};
		}
	}

	/**
	 * Converts a given amount from a specified currency to TZS.
	 * @param amount The amount to convert.
	 * @param fromCurrency The currency code of the amount (e.g., "USD", "EUR").
	 * @returns A promise that resolves to the converted amount in TZS.
	 */
	convertToTZS(
		amount: number,
		fromCurrency: string
	): Observable<{
		exchangedAmount: number;
		currencyUuid: string;
		currencyCode: string;
		transactionDate: string;
		currencyId: number;
		sellingRate: number;
		buyingRate: number;
	}> {
		try {
			// Fetch exchange rates from the API

			return this.apollo
				.fetchDataObservable({
					query: GET_CURRENCY_CONVERSION_RATE,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						convertingDTO: {
							currencyCode: fromCurrency,
							transactionDate: new Date().toISOString().split('T')[0],
						},
					},
				})
				.pipe(
					map((response: any) => {
						var data = response.data?.results?.data;
						return {
							...data,
							exchangedAmount: data.sellingRate
								? amount * data.sellingRate
								: amount,
						};
					})
				);
		} catch (error) {
			console.error('Error converting currency:', error);
			throw new Error('Failed to convert currency to TZS.');
		}
	}
}
