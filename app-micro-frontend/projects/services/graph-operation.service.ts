import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { Apollo } from 'apollo-angular';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
	DataPage,
	DataRequestInput,
} from '../shared/components/paginated-data-table/data-page.model';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { SettingsService } from './settings.service';
import { environment } from '../../environments/environment';

export const basePageableGraphqlField = `
currentPage
first
hasNext
hasPrevious
last
numberOfRecords
pageSize
recordsFilteredCount
totalPages
totalRecords
`;

export const baselField = `
  message
  code
  status
`;

export interface InputParameters {
	[key: string]: any;
	inputType: string;
}

/** Parameters used to query or mutate graphql data
 *
 * Used in Paginated and Non Paginated Queries
 *
 * (NOTE: DONT MODIFY THIS SERVICE)
 */
export interface GraphParameters {
	/** Graphql Name(String): Found in graph schema, e.g getEquipmentTypes */
	graphName: string;
	/** Response Fields(String): These are fields found in data response
	 * Note: Separate the fields by space, e.g uid code name */
	responseFields?: string;
	/** Either show or Hide errors notifications */
	hideErrorNotifications?: boolean;
	/** Either show or Hide success notifications */
	hideSuccessNotifications?: boolean;
	/** Pass only one graphParameters Per Type Pleasseeee...
	 * e.g [{depId:5, inputType: "Int"},{name:"Juma",inputType:"String"}]
	 */
	inputs?: InputParameters[];
	/** For Watch Query */
	watch?: boolean;
	/** There is 'data' before reacing response*/
	withData?: boolean;
	/** Poll interval network in milliseconds*/
	pollInterval?: number;
	/** instead of receiving value from data, this is alternative name*/
	returnDataAs?: string;

	fetchPolicy?: 'cache-first' | 'network-only' | 'cache-and-network';
	apolloNamespace?: string;
}

export const emptyDataPage: DataPage = {
	totalPages: 0,
	totalRecords: 0,
	currentPage: 0,
	isLast: true,
	isFirst: true,
	hasNext: false,
	hasPrevious: false,
	numberOfRecords: 0,
	recordsFilteredCount: 0,
	pageSize: 0,
	rows: [],
	metaData: [],
};

@Injectable({
	providedIn: 'root',
})
export class GraphqlOperationService {
	latestPaginatedData: any;
	constructor(
		private apollo: Apollo,
		private notificationService: NotificationService,
		private settingsService: SettingsService,
		private authService: AuthService
	) {}

	public getSegment(parameters: any) {
		let segment = 'default';
		if (
			!environment.ACTIVATE_API_INTEGRATION &&
			!environment.USE_ENUMS_FROM_API_INTEGRATION
		) {
			segment = parameters.apolloNamespace || 'default';
		}

		// console.log(environment.ACTIVATE_API_INTEGRATION);
		// console.log(environment.USE_ENUMS_FROM_API_INTEGRATION);
		//
		// console.log(parameters);
		// console.log(segment);

		return segment;
	}

	private checkInputs(inputs?: InputParameters[]) {
		let inputParams = '';
		let inputParamsReverse = '';
		let inputValue: { [key: string]: any } = {};
		inputs?.forEach((i) => {
			const key = Object.keys(i).find((o) => o != 'inputType');
			if (key) {
				inputParams = inputParams + `$${key}: ${i.inputType},`;
				inputParamsReverse = inputParamsReverse + `${key}: $${key},`;
				inputValue[key] = i[key];
			}
		});

		return {
			inputParams,
			inputParamsReverse,
			inputValue,
		};
	}

	public queryGraphs(parameters: GraphParameters): DocumentNode {
		let responseDTO = ``;

		if (parameters.responseFields) {
			responseDTO = parameters.withData
				? ` data { ${parameters.responseFields} }  status`
				: `${parameters.responseFields}`;
		}
		const inputParams = this.checkInputs(parameters.inputs).inputParams;
		const inputParamsReverse = this.checkInputs(
			parameters.inputs
		).inputParamsReverse;
		const queryGraph =
			inputParams != ''
				? `${parameters.graphName}(${inputParams})`
				: `${parameters.graphName}`;
		const queryGraphname = inputParams
			? `${parameters.graphName}(${inputParamsReverse})`
			: `${parameters.graphName}`;
		return gql`
      query ${queryGraph}{
        ${queryGraphname}{
          ${responseDTO}
      }
  }`;
	}

	public queryGraphPaginated(parameters: GraphParameters): DocumentNode {
		const inputParams = this.checkInputs(parameters.inputs).inputParams;
		const inputParamsReverse = this.checkInputs(
			parameters.inputs
		).inputParamsReverse;
		let responseDTO = `${basePageableGraphqlField}`;
		if (parameters.responseFields) {
			let data = parameters.returnDataAs
				? `
      ${parameters.returnDataAs}:data {${parameters.responseFields}  }`
				: `data { ${parameters.responseFields}  }`;
			responseDTO = `${basePageableGraphqlField} ${data}`;
		}
		if (inputParams) {
			return gql`
      query ${parameters.graphName}($input: DataRequestInputInput, ${inputParams}){
      ${parameters.graphName}(withMetaData:false, input: $input,${inputParamsReverse}){
          ${responseDTO}
      }
  }`;
		}
		return gql`
      query ${parameters.graphName}($input: DataRequestInputInput){
      ${parameters.graphName}(withMetaData:false, input: $input){
        ${responseDTO}
      }
  }`;
	}

	public mutationGraph(parameters: GraphParameters): DocumentNode {
		const inputParams = this.checkInputs(parameters.inputs).inputParams;
		const inputParamsReverse = this.checkInputs(
			parameters.inputs
		).inputParamsReverse;
		let responseDTO = `${baselField}`;
		if (parameters?.responseFields == 'data') {
			responseDTO = `${baselField} data`;
		} else if (parameters.responseFields) {
			responseDTO = `${baselField} data {
        ${parameters.responseFields}
   }`;
		}
		return gql`
      mutation ${parameters.graphName}(${inputParams} ){
        ${parameters.graphName}(${inputParamsReverse}){
          ${responseDTO}
        }
    }`;
	}

	/// Used in Data Paginated Data Table and Paginated Select
	queryPaginatedFromDataTable(
		input: DataRequestInput,
		fetchPolicy: string,
		parameters?: GraphParameters
	): Observable<any> {
		if (parameters) {
			parameters.hideSuccessNotifications = true;
			const inputValue = this.checkInputs(parameters.inputs).inputValue;
			const query = this.queryGraphPaginated(parameters);
			if (query) {
				let queryParam: any = {
					fetchPolicy: fetchPolicy,
					query,
					variables: {
						input,
					},
				};
				if (parameters.inputs) {
					queryParam = {
						fetchPolicy: fetchPolicy,
						query,
						variables: {
							...inputValue,
							input,
						},
					};
				}
				if (parameters.watch) {
					return this.apolloWatchQuery(
						queryParam,
						parameters,
						this.getSegment(parameters)
					);
				} else {
					return this.apolloQuery(
						queryParam,
						parameters,
						this.getSegment(parameters)
					);
				}
			}
		}
		return of(emptyDataPage);
	}
	/// Querying
	fetchData(parameters: GraphParameters): Observable<any> {
		const inputValue = this.checkInputs(parameters.inputs).inputValue;
		const query = this.queryGraphs(parameters);

		if (query) {
			let queryParam: any = { query };
			if (parameters.inputs) {
				queryParam = {
					query,
					fetchPolicy: parameters.fetchPolicy,
					variables: {
						...inputValue,
					},
				};
			}
			if (parameters.watch) {
				return this.apolloWatchQuery(
					queryParam,
					parameters,
					this.getSegment(parameters)
				);
			} else {
				return this.apolloQuery(
					queryParam,
					parameters,
					this.getSegment(parameters)
				);
			}
		}

		return of(emptyDataPage);
	}

	/// Querying Paginated
	fetchDataPaginated(parameters: GraphParameters): Observable<any> {
		if (this.queryGraphPaginated(parameters)) {
			const inputValue = this.checkInputs(parameters.inputs).inputValue;
			let queryParam: any = {
				fetchPolicy: parameters.fetchPolicy,
				query: this.queryGraphPaginated(parameters),
			};
			if (parameters.inputs) {
				queryParam = {
					...queryParam,
					variables: { ...inputValue },
				};
			}
			if (parameters.watch) {
				return this.apolloWatchQuery(
					queryParam,
					parameters,
					this.getSegment(parameters)
				);
			} else {
				return this.apolloQuery(
					queryParam,
					parameters,
					this.getSegment(parameters)
				);
			}
		}

		return of(emptyDataPage);
	}

	private apolloWatchQuery(
		queryParam: any,
		parameters: GraphParameters,
		segment: any
	): Observable<any> {
		return this.apollo
			.use(segment)
			.watchQuery<any>({
				...queryParam,
				pollInterval: parameters.pollInterval,
				fetchPolicy: parameters.fetchPolicy || 'cache-and-network',
			})
			.valueChanges.pipe(
				catchError((error) => {
					console.error(error);
					if (!parameters.hideErrorNotifications) {
						this.notificationService.errorMessage(
							`Error occurred, ${parameters.graphName} operation failed`
						);
					}
					return of(emptyDataPage);
				}),
				map((res: any) => {
					const data = res.data;
					if (data) {
						let result = data;
						if (this.settingsService.isObject(data)) {
							result = Object.values(data)[0];
						}
						if (result?.status) {
							if (!parameters.hideSuccessNotifications) {
								this.notificationService.successMessage('Successfully');
							}
							this.latestPaginatedData = { ...result, success: result.status };
							return { ...result, success: result.status };
						} else if (
							typeof result?.status === 'boolean' &&
							result?.status === false &&
							!parameters.hideErrorNotifications &&
							result.message
						) {
							this.notificationService.errorMessage(result.message);
						}
					}
					return emptyDataPage;
				})
			);
	}

	private apolloQuery(
		queryParam: any,
		parameters: GraphParameters,
		segment: any
	): Observable<any> {
		return this.apollo
			.use(segment)
			.query(queryParam)
			.pipe(
				catchError((error) => {
					console.error(error);
					// if (!parameters.hideErrorNotifications) {
					//   this.notificationService.errorMessage(`Error occured, ${parameters.graphName} operation failed`);
					// }
					return of(emptyDataPage);
				}),
				map((res: any) => {
					const data = res.data;
					if (data) {
						let result = data;
						if (this.settingsService.isObject(data)) {
							result = Object.values(data)[0];
						}

						if (result?.status) {
							if (!parameters.hideSuccessNotifications) {
								this.notificationService.successMessage('Successfully');
							}
							this.latestPaginatedData = { ...result, success: result.status };
							return { ...result, success: result.status };
						} else if (
							typeof result?.status === 'boolean' &&
							result?.status === false &&
							!parameters.hideErrorNotifications &&
							result?.message
						) {
							this.notificationService.errorMessage(result?.message);
						}
					}
					return data[parameters?.graphName];
				})
			);
	}

	mutate(parameters: GraphParameters): Observable<DataPage> {
		const inputValue = this.checkInputs(parameters.inputs).inputValue;
		if (this.mutationGraph(parameters)) {
			return this.apollo
				.use(this.getSegment(parameters))
				.mutate({
					mutation: this.mutationGraph(parameters),
					variables: {
						...inputValue,
					},
				})
				.pipe(
					catchError((error) => {
						if (error) {
							console.error(error);
						}
						if (!parameters.hideErrorNotifications) {
							this.notificationService.errorMessage(
								`Error occured, ${parameters.graphName} operation failed`
							);
						}
						return of(emptyDataPage);
					}),
					map((response: any) => {
						if (response.errors) {
							console.error(response.errors);
						}
						let result = response.data;

						const isObject = this.settingsService.isObject(response?.data);
						if (isObject) {
							result = Object.values(response.data)[0];
						}
						if (isObject) {
							if (result?.status) {
								if (!parameters.hideSuccessNotifications) {
									this.notificationService.successMessage('Successfully');
								}
								return isObject
									? { ...result, success: result?.status }
									: { data: result, success: result?.status };
							} else {
								if (
									typeof result?.status === 'boolean' &&
									result?.status === false &&
									!parameters.hideErrorNotifications
								) {
									this.notificationService.errorMessage(
										result?.message || 'Operation Failed'
									);
								}
								return isObject
									? { ...result, success: result?.status }
									: { data: result, success: result?.status };
							}
						} else {
							return {
								data: response?.data || null,
								message: response?.message || '',
								status: response?.status || false,
								success: response?.status || false,
							};
						}
					})
				);
		}

		return of(emptyDataPage);
	}

	//   private enumGraph(enumString: string): DocumentNode {
	//     return gql`
	//      query getEnums{
	//   __type(name:"${enumString}"){
	//     name
	//     enumValues{
	//       name
	//     }
	//   }
	// }
	//     `;
	//   }
	private enumGraph(enumString: string): DocumentNode {
		return environment.USE_ENUMS_FROM_API_INTEGRATION
			? gql`
	  query getConstantValue{
	    getConstantValue(enumName:"${enumString}")
	  }
	`
			: gql`
	   query getEnumValues{
	     getEnumValues(enumType:"${enumString}"){
		 code
		 data
		 }
	   }`;
	}

	// private enumGraph(enumString: string): DocumentNode {
	// 	return gql`
	//   query getEnumValues{
	//     getEnumValues(enumName:"${enumString}")
	//   }
	// `;
	// }
	private propertyTypeGraph(name: string): DocumentNode {
		return gql`
     query getPropertyType
      {
      __type(name:"${name}") {
          kind
          name
          fields {
            name
            type {
              name
            }
          }
        }
      }

    `;
	}

	getEnums(
		enumType: string,
		apolloNamespace: ApolloNamespace,
		hideNotifications?: boolean
	): Observable<any> {
		return this.apollo
			.use(this.getSegment({ apolloNamespace }))
			.query({
				query: this.enumGraph(enumType),
			})
			.pipe(
				catchError((error) => {
					console.error(error);
					if (!hideNotifications) {
						this.notificationService.errorMessage(
							`Error occurred,getting ${enumType}`
						);
					}
					return of([]);
				}),
				map(({ data }: any) => {
					return (
						(environment.USE_ENUMS_FROM_API_INTEGRATION
							? data?.getConstantValue
							: data.getEnumValues?.data) || []
					)?.map((item: any) => ({
						// ...item,
						name: this.settingsService.toTitleCase(item.replace(/_/g, ' ')),
						value: item,
					}));
				})
			);
	}
	getPropertySchema(
		name: string,
		apolloNamespace: ApolloNamespace,
		hideNotifications?: boolean
	): Observable<any> {
		return this.apollo
			.use(this.getSegment({ apolloNamespace }))
			.query({
				query: this.propertyTypeGraph(name),
			})
			.pipe(
				catchError((error) => {
					console.error(error);
					if (!hideNotifications) {
						this.notificationService.errorMessage(
							`Error occurred,getting ${name}`
						);
					}
					return of([]);
				}),
				map(({ data }: any) => {
					return data.__type?.fields;
				})
			);
	}
}
