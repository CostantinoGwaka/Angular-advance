import { NotificationService } from '../../../services/notification.service';
import {
	Component,
	EventEmitter,
	OnInit,
	Output,
	Input,
	SimpleChanges,
	HostListener,
	ElementRef,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeInOut } from '../../animations/router-animation';
import { fadeIn } from '../../animations/basic-animation';
import { GraphqlService } from '../../../services/graphql.service';
import {
	GET_BOQ_SUB_ITEMS,
	GET_CURRENCY,
} from '../../../modules/nest-tender-initiation/store/settings/boqs/boq-sub-items/boq-sub-item.graphql';

import { FormsModule } from '@angular/forms';
import { SimpleInputModelComponentData } from '../text-input-model/text-input-model.component';
import { MatIconModule } from '@angular/material/icon';
import {
	ExchangeRateServiceService,
	ExchangeRatesResult,
} from '../../exchange-rate/exchange-rate.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-currency-change',
	templateUrl: './currency-change.component.html',
	styleUrls: ['./currency-change.component.scss'],
	animations: [fadeInOut, fadeIn],
	standalone: true,
	imports: [MatIconModule, FormsModule, MatProgressSpinnerModule],
})
export class CurrencyChangeComponent implements OnInit {
	@Input() isEvaluating: boolean;
	@Input() selectedCurrency: string;
	@Input() exchangeRate: number;
	@Input() localCurrencyOnly: boolean = false;
	@Input() allowExchangeRateSetting: boolean = false;
	@Input() exchangeRateDate: string = new Date().toISOString().split('T')[0];
	@Output() onCurrencyChange: EventEmitter<any> = new EventEmitter<any>();
	@Output() onExchangeRateChanged: EventEmitter<any> =
		new EventEmitter<number>();
	@Output() onExchangeRateFetched: EventEmitter<ExchangeRatesResult> =
		new EventEmitter<ExchangeRatesResult>();
	currencyListVisible: boolean = false;
	loadingCurrencies: boolean = false;
	allCurrencies: { code: string; name: string }[] = [];
	currencies: { code: string; name: string }[] = [];
	localCurrency = 'TZS';

	fetchingExchangeRate: boolean = false;
	failedToGetExchangeRate: boolean = false;

	previousCurrency: string;
	previousExchangeRate: number;

	constructor(
		private apollo: GraphqlService,
		private notificationService: NotificationService,
		private exchangeRateServiceService: ExchangeRateServiceService,
		private elRef: ElementRef
	) {}

	async initializer(): Promise<void> {
		await this.getCurrencyData(null);
		if (this.localCurrencyOnly) {
			this.currencies = this.allCurrencies.filter(
				(currency) => currency.code === 'TZS'
			);
		}
	}

	@HostListener('document:click', ['$event'])
	onDocumentClick(event: MouseEvent) {
		const currencyListElement = document.getElementById('currency-list');
		const currencySelectorElement =
			document.getElementById('currency-selector');
		if (
			currencyListElement &&
			!currencyListElement.contains(event.target as Node) &&
			!currencySelectorElement.contains(event.target as Node)
		) {
			this.closeSelector();
		}
	}

	ngOnInit(): void {
		this.initializer().then();
		if (!this.allowExchangeRateSetting) {
			this.setLocalExchangeRate(false);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['localCurrencyOnly']) {
			this.currencies = this.allCurrencies.filter(
				(currency) => currency.code === 'TZS'
			);
			if (this.localCurrencyOnly && !this.selectedCurrency) {
				this.onSelectingCurrency('TZS');
			}
		}
		if (changes['allowExchangeRateSetting']) {
			if (!this.allowExchangeRateSetting) {
				this.setLocalExchangeRate(false);
			}
		}
	}

	setLocalExchangeRate(deleteOld: boolean) {
		this.exchangeRate = 1;
		this.onExchangeRateFetched.emit({
			success: true,
			deleteOld: deleteOld,
			data: {
				buyingRate: 1,
				sellingRate: 1,
				currencyUuid: '',
				currencyCode: 'TZS',
				transactionDate: '',
				currencyId: 0,
			},
		});
		this.onExchangeRateChanged.emit(this.exchangeRate);
	}

	openSelector() {
		this.currencyListVisible = true;
	}

	closeSelector() {
		this.currencyListVisible = false;
	}

	onSelectingCurrency(currency: string) {
		if (!this.allowExchangeRateSetting) {
			this.selectedCurrency = currency;
			this.exchangeRate = 1;
			this.closeSelector();
			this.onCurrencyChange.emit(currency);
			this.onExchangeRateChanged.emit(this.exchangeRate);
			return;
		}

		currency = currency.trim();

		if (this.selectedCurrency == currency) {
			this.closeSelector();
			return;
		}

		if (this.selectedCurrency) {
			this.notificationService.showConfirmMessage({
				title:
					'Are you sure you want to change currency from ' +
					this.selectedCurrency +
					' to ' +
					currency +
					'?',
				message: 'Changing currency will delete any filled prices',
				acceptButtonText: 'Yes and delete',
				cancelButtonText: 'No',
				confirmationText: 'DELETE',
				isWarning: true,
				onConfirm: () => {
					this.applySelectedCurrency(currency, true);
				},
			});
		} else {
			this.applySelectedCurrency(currency, false);
		}
	}

	applySelectedCurrency(currency: string, deleteOld: boolean) {
		this.selectedCurrency = currency;
		this.closeSelector();
		if (this.selectedCurrency == this.localCurrency) {
			this.setLocalExchangeRate(deleteOld);
		} else {
			if (this.allowExchangeRateSetting) {
				this.fetchExchangeRate(deleteOld);
			} else {
				this.exchangeRate = 1;
				this.onCurrencyChange.emit(currency);
				this.onExchangeRateChanged.emit(this.exchangeRate);
			}
		}
	}

	searchCurrencies(event: any) {
		this.getCurrencyData(event.target.value.toUpperCase()).then();
	}

	async getCurrencyData(filterValue: any) {
		this.loadingCurrencies = true;
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_CURRENCY,
				apolloNamespace: ApolloNamespace.app,
				variables: {
					input: {
						fields: [
							{
								fieldName: 'sortNumber',
								isSortable: true,
								orderDirection: 'ASC',
							},
						],
						mustHaveFilters:
							filterValue != null && filterValue != ''
								? [
										{
											fieldName: 'code',
											operation: 'EQ',
											value1: filterValue,
										},
								  ]
								: [],
						page: 1,
						pageSize: 10,
					},
				},
			});
			this.allCurrencies = response.data.items.rows.map((currency: any) => ({
				code: currency.code.trim(),
				name: currency.code.trim(),
			}));
			this.currencies = this.allCurrencies;
			this.loadingCurrencies = false;
		} catch (e) {
			this.loadingCurrencies = false;
		}
	}

	async fetchExchangeRate(deleteOld: boolean) {
		this.fetchingExchangeRate = true;
		this.failedToGetExchangeRate = false;

		try {
			let exchangeRateResults =
				await this.exchangeRateServiceService.getExchangeRate(
					this.selectedCurrency,
					this.exchangeRateDate
				);
			exchangeRateResults = {
				...exchangeRateResults,
				deleteOld: deleteOld,
			};

			if (exchangeRateResults.success) {
				this.exchangeRate = exchangeRateResults.data.buyingRate;
				this.onCurrencyChange.emit(this.selectedCurrency);
				this.onExchangeRateFetched.emit(exchangeRateResults);
			} else {
				this.failedToGetExchangeRate = true;
				this.notificationService.showConfirmMessage({
					title: 'Failed to get exchange rate',
					message: exchangeRateResults.message,
					acceptButtonText: 'Try again',
					cancelButtonText: 'Use TZS',
					isWarning: true,
					onConfirm: () => {
						this.fetchExchangeRate(deleteOld);
					},
					onCancel: () => {
						this.setLocalExchangeRate(deleteOld);
					},
				});
			}
		} catch (e) {
			this.failedToGetExchangeRate = true;
			console.error(e);
		}

		this.fetchingExchangeRate = false;
	}
}
