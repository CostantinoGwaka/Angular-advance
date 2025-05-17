import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
	MatBottomSheet,
	MatBottomSheetConfig,
} from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Tenderer } from 'src/app/modules/nest-tenderer-management/store/tenderer/tenderer.model';
import { GraphqlService } from '../../../../services/graphql.service';
import { NotificationService } from '../../../../services/notification.service';
import { SettingsService } from '../../../../services/settings.service';
import { fadeIn } from 'src/app/shared/animations/router-animation';
import { AddGovernmentComponent } from './add-government/add-government.component';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';
import { MustHaveFilter } from '../../paginated-data-table/must-have-filters.model';
import { FieldRequestInput } from '../../paginated-data-table/field-request-input.model';
import { DataRequestInput } from '../../paginated-data-table/data-page.model';
import {
	CREATE_TENDERER_GOV_COMPLIANCE,
	DELETE_TENDERER_GOVERNMENT_COMPLIANCE,
	GET_SAVED_GOV_COMPLIANCES_TENDERER,
} from 'src/app/modules/nest-tenderer-management/store/gov-compliance/gov-compliance.graphql';
import * as moment from 'moment';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe } from '@angular/common';
import { AlertDialogService } from '../../alert-dialog/alert-dialog-service.service';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
	selector: 'app-government-tenderer',
	templateUrl: './government-tenderer.component.html',
	styleUrls: ['./government-tenderer.component.scss'],
	animations: [fadeIn],
	standalone: true,
	imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
})
export class GovernmentTendererComponent implements OnInit {
	loading: boolean = false;
	fetchingAttachment: { [id: string]: boolean } = {};
	currentTab: string = 'business-registration';
	isIndividualRegistration: boolean = false;
	searchSearch: boolean = false;
	noData: boolean = false;
	complianceCheckData: any;
	@Input() tenderer: Tenderer;
	@Input() user: User;
	@Input() tendererSide: boolean = false;
	@Input() tendererUuid;
	@Input() embassy: boolean = false;
	@Input() ppra: boolean = false;

	showDelete: boolean = false;
	showDeletes: any = {};
	showConfirm = false;
	showDeleteConfirm: { [id: string]: boolean } = {};
	deleting: { [id: string]: boolean } = {};
	matDialogRef = {} as MatDialogRef<AddGovernmentComponent>;
	dataSaved: any[] = [];
	deletingGovCompliance = false;
	constructor(
		private http: HttpClient,
		private apollo: GraphqlService,
		private settingService: SettingsService,
		private _dialogRef: MatDialog,
		private _bottomSheet: MatBottomSheet,
		private notificationService: NotificationService,
		private alertDialogService: AlertDialogService,
	) {}

	ngOnInit(): void {
		this.getSaveGovCompliance();
	}

	// Simulate fetching data from an API or database
	fetchData() {
		// Mocking data for demonstration
		this.dataSaved = Array.from({ length: 5 }).map((_, index) => ({
			governmentCompliance: {
				procuringEntity: {
					name: `Procuring Entity ${index + 1}`,
				},
				complianceCheckUrl: `https://example.com/check/${index}`,
			},
			registrationNumber: `Reg-${index + 1}`,
			registrationStatus: 'Registered',
			complianceStatus: 'Compliant',
			createdAt: new Date().toISOString(),
			uuid: `uuid-${index + 1}`,
		}));
	}

	addGovernmentCompliance() {
		const config = new MatBottomSheetConfig();
		config.autoFocus = 'dialog';
		config.closeOnNavigation = false;
		config.data = {
			tenderer: this.tenderer,
		};
		config.panelClass = ['bottom__sheet'];
		this._bottomSheet
			.open(AddGovernmentComponent, config)
			.afterDismissed()
			.subscribe(async (refresh) => {
				this.getSaveGovCompliance().then();
			});
	}

	formatDate(date: string) {
		return moment(date).format('ll');
	}

	async reloadDataRegistration(setting, govNumber, uuid) {
		this.searchSearch = true;
		this.fetchingAttachment[uuid] = true;

		const data = await firstValueFrom(
			this.http
				.post<any>(setting?.governmentCompliance?.registrationCheckUrl, {
					regNo: `${govNumber}`,
				})
				.pipe(
					timeout(60000),
					catchError((error) => {
						if (error.name === 'TimeoutError') {
							this.searchSearch = false;
							this.fetchingAttachment[uuid] = false;
							return throwError('Request timed out');
						}
						this.searchSearch = false;
						this.fetchingAttachment[uuid] = false;
						return throwError(error);
					}),
				),
		);
		if (data) {
			this.searchSearch = false;
			this.fetchingAttachment[uuid] = false;
			//data found
			this.complianceCheckData = data;
			this.notificationService.successMessage(
				this.complianceCheckData?.message +
					' : ' +
					this.complianceCheckData?.description,
			);
			try {
				if (
					this.complianceCheckData?.regNo ||
					this.complianceCheckData?.employer_number
				) {
					const response = await this.apollo.mutate({
						mutation: CREATE_TENDERER_GOV_COMPLIANCE,
						apolloNamespace: ApolloNamespace.uaa,
						variables: {
							governmentComplianceRequestDTO: {
								complianceStatus: 'NOT_COMPLY',
								governmentComplianceUuid: setting?.governmentCompliance?.uuid,
								registrationNumber:
									this.complianceCheckData?.employer_number ??
									this.complianceCheckData?.regNo,
								registrationStatus:
									this.complianceCheckData?.message == 'NOT_REGISTERED'
										? 'NOT_REGISTERED'
										: 'REGISTERED',
								tendererUuid: this.user?.tenderer?.uuid,
								uuid: uuid,
							},
						},
					});

					if (response.data.createTendererGovernmentCompliance.code == 9005) {
						this.notificationService.errorMessage(
							response.data.createTendererGovernmentCompliance.message,
						);
					}
					this.getSaveGovCompliance();
				}
			} catch (e) {
				this.notificationService.errorMessage('Failed to save');
			}
			// return this.complianceCheckData;
		} else {
			this.searchSearch = false;
			this.fetchingAttachment[uuid] = false;
			this.noData = true;
			//data not found
		}
	}

	async deleteCompliance(uuid: string): Promise<void> {
		this.alertDialogService
			.openDialog({
				title: 'Delete Compliance',
				status: 'warning',
				showCancelBtn: false,
				message: 'Are you sure you want to delete this compliance?',
			})
			.then(async (success) => {
				if (success) {
					try {
						this.deletingGovCompliance = true;
						let response: any = await this.apollo.mutate({
							mutation: DELETE_TENDERER_GOVERNMENT_COMPLIANCE,
							apolloNamespace: ApolloNamespace.uaa,
							variables: {
								governmentComplianceUuid: uuid,
							},
						});
						this.deletingGovCompliance = false;

						if (response.data.deleteTendererGovernmentCompliance.code == 9005) {
							this.notificationService.errorMessage(
								response.data?.deleteTendererGovernmentCompliance?.message ??
									'Failed to delete compliance',
							);
						} else if (
							response.data.deleteTendererGovernmentCompliance.code == 9000
						) {
							this.notificationService.successMessage(
								response.data?.deleteTendererGovernmentCompliance?.message ??
									'Deleted successfully',
							);
							await this.getSaveGovCompliance();
						}
					} catch (error) {
						this.deletingGovCompliance = false;

						this.notificationService.errorMessage(
							'Failed to delete compliance',
						);
						console.error(error);
					}
				}
			});
	}

	async reloadData(setting, govNumber, uuid) {
		this.searchSearch = true;
		this.fetchingAttachment[uuid] = true;
		let contact = '';
		try {
			const data = await firstValueFrom(
				this.http
					.post<any>(setting.governmentCompliance?.complianceCheckUrl, {
						regNo: `${govNumber}`,
					})
					.pipe(
						timeout(60000),
						catchError((error) => {
							if (error.name === 'TimeoutError') {
								this.searchSearch = false;
								this.fetchingAttachment[uuid] = false;
								return throwError('Request timed out');
							}
							this.searchSearch = false;
							this.fetchingAttachment[uuid] = false;
							return throwError(error);
						}),
					),
			);
			if (data) {
				this.searchSearch = false;
				this.fetchingAttachment[uuid] = false;
				//data found
				this.complianceCheckData = data;
				if (
					this.complianceCheckData?.employer_number ||
					this.complianceCheckData?.nssf_employer_number
				) {
					if (this.complianceCheckData?.message) {
						//update infor
						const response = await this.apollo.mutate({
							mutation: CREATE_TENDERER_GOV_COMPLIANCE,
							apolloNamespace: ApolloNamespace.uaa,
							variables: {
								governmentComplianceRequestDTO: {
									complianceStatus:
										this.complianceCheckData?.message == 'UN_COMPLIED'
											? 'NOT_COMPLY'
											: 'COMPLY',
									governmentComplianceUuid: setting?.governmentCompliance?.uuid,
									registrationNumber:
										this.complianceCheckData?.employer_number ??
										this.complianceCheckData?.nssf_employer_number,
									// registrationStatus: (this.complianceCheckData?.status == 'Partially Registered' || this.complianceCheckData?.status == 0) ? "NOT_REGISTERED" : "REGISTERED",
									tendererUuid: this.user?.tenderer?.uuid,
									uuid: uuid,
								},
							},
						});

						if (response.data.createTendererGovernmentCompliance.code == 9005) {
							this.notificationService.errorMessage(
								response.data.createTendererGovernmentCompliance.message,
							);
						} else {
							if (this.complianceCheckData?.message == 'COMPLIED') {
								this.notificationService.successMessage(
									this.complianceCheckData?.description ??
										response.data.createTendererGovernmentCompliance.message,
								);
							}
							if (
								setting?.governmentCompliance?.description?.includes('National')
							) {
								contact =
									'Please contact NSSF Help Desk 0756-140-140 or 0800-116-773 or via eservices@nssf.or.tz';
							} else {
								contact =
									'Please contact WCF Help Desk 0800-110-028 or 0800-110-029';
							}
							if (this.complianceCheckData?.message == 'UN_COMPLIED') {
								this.alertDialogService
									.openDialog({
										title: 'Compliance Status',
										status: 'warning',
										showCancelBtn: false,
										message:
											'You are not complied with this government complance, ' +
											contact,
									})
									.then(async (action) => {});
							}
							this.getSaveGovCompliance();
						}
					}
				}
				this.searchSearch = false;
				this.fetchingAttachment[uuid] = false;
				this.noData = true;
			}
		} catch (e) {
			console.log(e);
			this.searchSearch = false;
			this.fetchingAttachment[uuid] = false;
			this.noData = true;
			this.notificationService.errorMessage('Something went wrong...', e);
		}
	}

	async getSaveGovCompliance() {
		let filters: MustHaveFilter[] = [];
		let fields: FieldRequestInput[] = [];
		let pageSize = 200;
		let input: DataRequestInput = {
			page: 1,
			pageSize: pageSize,
			fields: [],
			mustHaveFilters: [],
		};
		this.loading = true;
		try {
			const result: any = await this.apollo.fetchData({
				query: GET_SAVED_GOV_COMPLIANCES_TENDERER,
				apolloNamespace: ApolloNamespace.uaa,
				variables: {
					input: input,
				},
			});
			const gov: any[] = result.data?.items.rows;
			this.dataSaved = gov || [];
			this.loading = false;
		} catch (e) {
			this.notificationService.errorMessage(e.message);
			this.loading = false;
		}
	}
}
