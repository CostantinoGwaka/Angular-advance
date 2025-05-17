import { Injectable } from '@angular/core';
import { firstValueFrom, forkJoin } from 'rxjs';
import {
	CREATE_CONFLICT_OF_INTEREST,
	CREATE_CONFLICT_OF_INTEREST_NEGOTIATION,
	CREATE_CONFLICT_OF_INTEREST_POST_QUALIFICATION,
	CREATE_CONFLICT_OF_INTEREST_STATUS,
	GET_CONFLICT,
	GET_CONFLICT_OF_INTEREST,
	GET_CONFLICT_OF_INTEREST_NEGOTIATION,
	GET_CONFLICT_OF_INTEREST_POST_QUALIFICATION,
} from '../modules/nest-tender-evaluation/store/conflict-of-interest/conflict-of-interest.graphql';
import {
	CREATE_EVALUATION_COMMITEE,
	GET_EVALUATION_COMMITEE,
	GET_EVALUATION_COMMITEE_BY_UUID,
	GET_MY_PREVIOUS_TEAM_TASKS,
	GET_MY_TEAM_ASSIGNMENT_TASK,
	GET_REQUISITION_WITHOUT_EVALUATION_TEAM,
	REPLACE_EVALUATION_COMMITTE,
} from '../modules/nest-tender-evaluation/store/evaluation-commitee/evaluation-commitee.graphql';
import {
	CREATE_NEGOTIATION_TEAM,
	GET_NEGOTIATION_TEAM,
	GET_NEGOTIATION_TEAM_DETAIL_BY_UUID,
	GET_NEGOTIATION_TEAM_TASKS,
	GET_REQUISITION_WITHOUT_NEGOTIATION_TEAM,
} from '../modules/nest-tenderer-negotiation/store/negotiation-team/negotiation-team.graphql';
import {
	CREATE_POST_QUALIFICATION_TEAM,
	GET_POST_QUALIFICATION_TEAM,
	GET_POST_QUALIFICATION_TEAM_BY_UUID,
	GET_POST_QUALIFICATION_TEAM_TASKS,
	GET_REQUISITION_WITHOUT_POST_QUALIFICATION_TEAM,
} from '../modules/nest-tenderer-post-qualification/store/post-qualification-team/post-qualification-team.graphql';
import { ConflictOfInterestDto } from '../shared/components/declaration-of-interest-manager/declaration-of-interest.component';
import { GraphqlService } from './graphql.service';
import { EntityObjectTypeEnum } from '../shared/team-management/store/team.model';
import {
	CREATE_TEAM_ASSIGNMENT_UPDATE,
	GET_FRAMEWORKS_WITHOUT_TEAMS,
} from '../shared/team-management/store/team.graphql';
import { ApolloNamespace } from '../apollo.config';

export enum EntityTypeEnum {
	TENDER = 'TENDER',
	FRAMEWORK = 'FRAMEWORK',
	PLANNED_TENDER = 'PLANNED_TENDER',
	MIN_COMPETITION = 'MIN_COMPETITION',
	CALL_OFF_ORDER = 'CALL_OFF_ORDER',
	CONTRACT = 'CONTRACT',
	MANUFACTURER = 'MANUFACTURER',
}

export enum EntityTypeToEntityModelNameMapping {
	TENDER = 'MergedMainProcurementRequisition',
	PLANNED_TENDER = 'PreQualification',
	FRAMEWORK = 'Framework',
	// CONTRACT = ''
}

export enum TeamTypeEnum {
	EVALUATION_TEAM = 'EVALUATION_TEAM',
	CONTRACT = 'CONTRACT',
	NEGOTIATION_TEAM = 'NEGOTIATION_TEAM',
	INSPECTION_TEAM = 'INSPECTION_TEAM',
	POST_QUALIFICATION_TEAM = 'POST_QUALIFICATION_TEAM',
	PRE_QUALIFICATION_TEAM = 'PRE_QUALIFICATION_TEAM',
	TENDER_BOARD = 'TENDER_BOARD',
}

export interface TeamSelectionModal {
	name: string;
	value: string;
	type: TeamTypeEnum;
	objectType: EntityObjectTypeEnum;
}

@Injectable({
	providedIn: 'root',
})
export class TeamService {
	constructor(private apollo: GraphqlService) {}

	formatTendererResponse(dataList: any[]) {
		return (dataList || []).map((lot: any) => {
			return {
				uuid: lot.uuid,
				name: '(' + lot.lotNumber + ') - ' + lot.lotDescription,
			};
		});
	}

	formatTendererResponseRest(dataList: any[]) {
		return (dataList || [])
			.map((tender: any) => {
				return {
					uuid: tender.tenderUuid,
					evaluationTeamUuid: tender.uuid,
					tenderNumber: tender.tenderNumber,
					descriptionOfTheProcurement: tender.descriptionOfProcurement,
				};
			})
			.map(
				(tender: {
					descriptionOfTheProcurement: string;
					tenderNumber: string;
					evaluationTeamUuid: string;
					uuid: string;
				}) => {
					return {
						name:
							'(' +
							tender.tenderNumber +
							') - ' +
							tender.descriptionOfTheProcurement,
						evaluationTeamUuid: tender.evaluationTeamUuid,
						uuid: tender.uuid,
					};
				}
			);
	}

	async getValidTenderers(
		type: string,
		financialYearCode: string
	): Promise<any[]> {
		switch (type) {
			case 'Evaluation':
				let responseEv: any = await this.apollo.fetchData({
					query: GET_REQUISITION_WITHOUT_EVALUATION_TEAM,
					apolloNamespace: ApolloNamespace.app,
					variables: {
						financialYearCode,
					},
				});
				return this.formatTendererResponse(
					responseEv?.data?.getMergedProcurementRequisitionWithoutTeam
						?.dataList || []
				);
			case 'PostQualification':
				const responsePo: any = await this.apollo.fetchData({
					query: GET_REQUISITION_WITHOUT_POST_QUALIFICATION_TEAM,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						financialYearCode,
					},
				});
				return this.formatTendererResponseRest(
					responsePo?.data?.getTeamsWithoutPostQualification?.dataList || []
				);
			case 'Negotiation':
				const responseNe: any = await this.apollo.fetchData({
					query: GET_REQUISITION_WITHOUT_NEGOTIATION_TEAM,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						financialYearCode,
					},
				});
				return this.formatTendererResponseRest(
					responseNe?.data?.getTeamsWithoutNegotiationTeam?.dataList || []
				);
			case 'Framework':
				const responseFramework: any = await this.apollo.fetchData({
					query: GET_FRAMEWORKS_WITHOUT_TEAMS,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						financialYearCode,
					},
				});
				return this.formatTendererResponse(
					responseFramework?.data?.getFrameworksWithoutTeams?.dataList || []
				);

			default:
				return [];
		}
	}

	async createTeamByEntityType(type: EntityObjectTypeEnum, teamDto: any) {
		const responseEv: any = await this.apollo.mutate({
			// mutation: CREATE_TEAM_UPDATE,
			mutation: CREATE_TEAM_ASSIGNMENT_UPDATE,
			apolloNamespace: ApolloNamespace.submission,
			variables: {
				teamAssignmentDTO: {
					...teamDto,
					uuid: teamDto.uuid,
					entityType: type,
					teamType: TeamTypeEnum.EVALUATION_TEAM,
				},
			},
		});
		return {
			code: responseEv.data.createTeamAssignment.code,
			message: responseEv.data.createTeamAssignment.message,
		};
	}

	async createTeam(type: string, teamDto: any) {
		switch (type) {
			case 'Evaluation':
				const responseEv: any = await this.apollo.mutate({
					mutation: CREATE_EVALUATION_COMMITEE,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						tenderEvaluationCommitteeDto: {
							...teamDto,
							uuid: teamDto.uuid,
							entityType: EntityTypeEnum.TENDER,
							teamType: TeamTypeEnum.EVALUATION_TEAM,
						},
					},
				});
				return {
					code: responseEv.data.createTenderEvaluationCommittee.code,
					message: responseEv.data.createTenderEvaluationCommittee.message,
				};
			case 'PostQualification':
				const responsePo: any = await this.apollo.mutate({
					mutation: CREATE_POST_QUALIFICATION_TEAM,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						postQualificationTeamDto: {
							...teamDto,
							uuid: teamDto.uuid,
							entityType: EntityTypeEnum.TENDER,
							teamType: TeamTypeEnum.POST_QUALIFICATION_TEAM,
						},
					},
				});
				return {
					code: responsePo.data.createPostQualificationTeam.code,
					message: responsePo.data.createPostQualificationTeam.message,
				};
			case 'Negotiation':
				const responseNe: any = await this.apollo.mutate({
					mutation: CREATE_NEGOTIATION_TEAM,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						negotiationTeamDto: {
							...teamDto,
							uuid: teamDto.uuid,
							entityType: EntityTypeEnum.TENDER,
							teamType: TeamTypeEnum.NEGOTIATION_TEAM,
						},
					},
				});
				return {
					code: responseNe.data.createNegotiationTeamInfo.code,
					message: responseNe.data.createNegotiationTeamInfo.message,
				};
			default:
				return '';
		}
	}

	getPeginatedTeams(type: string) {
		switch (type) {
			case 'Evaluation':
				return GET_EVALUATION_COMMITEE;
			case 'PostQualification':
				return GET_POST_QUALIFICATION_TEAM;
			case 'Negotiation':
				return GET_NEGOTIATION_TEAM;
			default:
				return '';
		}
	}

	async getTeamByUuid(type: string, uuid: string) {
		switch (type) {
			case 'Evaluation':
				const responseEv: any = await this.apollo.fetchData({
					query: GET_EVALUATION_COMMITEE_BY_UUID,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						uuid: uuid,
					},
				});
				const dataEv = responseEv.data.getTenderEvaluationCommittee.data;
				return {
					code: responseEv.data.code,
					data: {
						...dataEv,
						members: dataEv.tenderEvaluationCommitteeInfos.map((user: any) => {
							return {
								...user,
								uuid: user.userUuid,
							};
						}),
					},
					message: responseEv.data.message,
				};
			case 'PostQualification':
				const responsePo: any = await this.apollo.fetchData({
					query: GET_POST_QUALIFICATION_TEAM_BY_UUID,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						uuid: uuid,
					},
				});
				const dataPo = responsePo.data.getNegotationTeam.data;
				return {
					code: responsePo.data.code,
					data: {
						...dataPo,
						members: dataPo.postQualificationTeamInfos.map((user: any) => {
							return {
								...user,
								uuid: user.userUuid,
							};
						}),
					},
					message: responsePo.data.message,
				};
			case 'Negotiation':
				const responseNe: any = await this.apollo.fetchData({
					query: GET_NEGOTIATION_TEAM_DETAIL_BY_UUID,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						uuid: uuid,
					},
				});
				const data = responseNe.data.getNegotiationTeamDetailByUuid.data;
				return {
					code: responseNe.data.code,
					data: {
						...data,
						members: data?.negotiationMemberAssignmentList?.map((user: any) => {
							return {
								...user,
								uuid: user.userUuid,
							};
						}),
					},
					message: responseNe.data.message,
				};
			default:
				return {};
		}
	}

	async teamMemberReplacement(
		type: string,
		replacementDto: {
			memberToReplace: any;
			selectedUuid: string;
			replacementReasonUuid: string;
		}
	) {
		switch (type) {
			case 'Evaluation':
				const response: any = await this.apollo.mutate({
					mutation: REPLACE_EVALUATION_COMMITTE,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						memberDto: {
							position: replacementDto.memberToReplace.position,
							userUuid: replacementDto.selectedUuid,
							replacementReasonUuid: replacementDto.replacementReasonUuid,
						},
						committeeUuid: replacementDto.memberToReplace.uuid,
					},
				});
				return {
					code: response.data.replaceTenderEvaluationCommitteeMember.code,
					message: response.data.replaceTenderEvaluationCommitteeMember.message,
				};
			case 'PostQualification':
			// const response: any = await this.apollo.mutate({
			//   mutation: REPLACE_EVALUATION_COMMITTE,
			//   variables:{
			//     memberDto:{
			//       position: this.memberToReplace.position,
			//       userUuid:this.selectedUuid,
			//       replacementReasonUuid:this.replacementReasonUuid
			//     },
			//     committeeUuid:this.memberToReplace.uuid
			//   }
			// });
			case 'Negotiation':
			// const response: any = await this.apollo.mutate({
			//   mutation: REPLACE_EVALUATION_COMMITTE,
			//   variables:{
			//     memberDto:{
			//       position: this.memberToReplace.position,
			//       userUuid:this.selectedUuid,
			//       replacementReasonUuid:this.replacementReasonUuid
			//     },
			//     committeeUuid:this.memberToReplace.uuid
			//   }
			// });
			default:
				return {};
		}
	}

	async updateTeam(type: string) {
		switch (type) {
			case 'Evaluation':
				return {};
			case 'PostQualification':
				return {};
			case 'Negotiation':
				return {};
			default:
				return {};
		}
	}

	async deleteTeam(type: string) {
		switch (type) {
			case 'Evaluation':
				return {};
			case 'PostQualification':
				return {};
			case 'Negotiation':
				return {};
			default:
				return {};
		}
	}

	async getTeamTasks(type: string): Promise<any> {
		switch (type) {
			case 'Evaluation':
				const responseEv: any = await this.apollo.fetchData({
					query: GET_MY_TEAM_ASSIGNMENT_TASK,
					apolloNamespace: ApolloNamespace.submission,
				});
				return {
					data: responseEv.data.getMyTeamAssignmentTask.map((item: any) => ({
						...item,
						members: item.teamMembers,
					})),
				};
			case 'PostQualification':
				const responsePo: any = await this.apollo.fetchData({
					query: GET_POST_QUALIFICATION_TEAM_TASKS,
					apolloNamespace: ApolloNamespace.submission,
				});
				return {
					data: responsePo.data.getMyPostQualificationTeamTasks.map(
						(item: any) => ({
							...item,
							members: item.postQualificationTeamInfos,
						})
					),
				};
			case 'Negotiation':
				const responseNe: any = await this.apollo.fetchData({
					query: GET_NEGOTIATION_TEAM_TASKS,
					apolloNamespace: ApolloNamespace.submission,
				});
				return {
					data: responseNe.data.getMyNegotiationTeamTasks.map((item: any) => ({
						...item,
						members: item.negotiationTeamInfos,
					})),
				};
			default:
				return { data: [] };
		}
	}

	async getMyPreviousTeamTasks(
		entityType: EntityObjectTypeEnum,
		teamType: TeamTypeEnum
	): Promise<any> {
		try {
			const responseEv: any = await this.apollo.fetchData({
				query: GET_MY_PREVIOUS_TEAM_TASKS,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					entityType: entityType,
					teamType: teamType,
				},
			});

			return {
				data: responseEv.data.getMyPreviousTeamTasks.map((item: any) => ({
					...item,
					possibleActions: item.possibleActions ?? null,
					members: item.tenderEvaluationCommitteeInfos,
				})),
			};
		} catch (e) {
			console.error(e);
			return { data: [] };
		}
	}

	async loadConflictOfInterest(type: string, tenderUuid: string) {
		let conflicts = [];
		switch (type) {
			case 'Evaluation':
				try {
					const response: any = await this.apollo.fetchData({
						query: GET_CONFLICT_OF_INTEREST,
						apolloNamespace: ApolloNamespace.submission,
						variables: {
							tenderUuid: tenderUuid,
						},
					});
					conflicts = response.data.getConflictOfInterests;
				} catch (e) {
					console.error(e);
				}
				break;
			case 'PostQualification':
				try {
					const response: any = await this.apollo.fetchData({
						query: GET_CONFLICT_OF_INTEREST_POST_QUALIFICATION,
						apolloNamespace: ApolloNamespace.submission,
						variables: {
							tenderUuid: tenderUuid,
						},
					});
					conflicts = response.data.getConflictOfInterestPostQualifications;
				} catch (e) {
					console.error(e);
				}
				break;
			case 'Negotiation':
				try {
					const response: any = await this.apollo.fetchData({
						query: GET_CONFLICT_OF_INTEREST_NEGOTIATION,
						apolloNamespace: ApolloNamespace.submission,
						variables: {
							tenderUuid: tenderUuid,
						},
					});
					conflicts = response.data.getConflictOfInterestNegotiations;
				} catch (e) {
					console.error(e);
				}
				break;
			default:
				break;
		}
		return conflicts;
	}

	async saveConflictOnInterest(
		type: string,
		dataList: any[],
		teamUuid: string,
		attachmentID: string
	) {
		let code = 0;
		switch (type) {
			case 'Evaluation':
				try {
					const responseEv: any = await firstValueFrom(
						forkJoin(
							dataList.map((conflict: ConflictOfInterestDto) =>
								this.apollo.mutate({
									mutation: CREATE_CONFLICT_OF_INTEREST,
									apolloNamespace: ApolloNamespace.submission,
									variables: {
										conflictOfInterestDto: {
											conflictDeclarationReasonUuids:
												conflict.conflictDeclarationReasonUuids,
											evaluationCommitteeInfoUuid: teamUuid,
											tenderUuid: conflict?.tenderUuid,
											tendererUuid: conflict?.tendererUuid,
											templateUuid: attachmentID,
											hasConflict: true,
										},
									},
								})
							)
						)
					);
					code = responseEv[0].data.createConflictOfInterest.code;
				} catch (e) {
					console.error(e);
					code = 0;
				}
				break;
			case 'PostQualification':
				try {
					const responsePo: any = await firstValueFrom(
						forkJoin(
							dataList.map((conflict: ConflictOfInterestDto) =>
								this.apollo.mutate({
									mutation: CREATE_CONFLICT_OF_INTEREST_POST_QUALIFICATION,
									apolloNamespace: ApolloNamespace.submission,
									variables: {
										conflictOfInterestPostQualificationDto: {
											conflictDeclarationReasonUuids:
												conflict.conflictDeclarationReasonUuids,
											postQualificationTeamInfoUuid: teamUuid,
											tenderUuid: conflict?.tenderUuid,
											tendererUuid: conflict?.tendererUuid,
											templateUuid: attachmentID,
											hasConflict: true,
										},
									},
								})
							)
						)
					);
					code =
						responsePo[0].data.createConflictOfInterestPostQualification.code;
				} catch (e) {
					console.error(e);
					code = 0;
				}
				break;
			case 'Negotiation':
				try {
					const responseNeg: any = await firstValueFrom(
						forkJoin(
							dataList.map((conflict: ConflictOfInterestDto) =>
								this.apollo.mutate({
									mutation: CREATE_CONFLICT_OF_INTEREST_NEGOTIATION,
									apolloNamespace: ApolloNamespace.submission,
									variables: {
										conflictOfInterestNegotiationDto: {
											conflictDeclarationReasonUuids:
												conflict.conflictDeclarationReasonUuids,
											negotiationTeamInfoUuid: teamUuid,
											tenderUuid: conflict?.tenderUuid,
											tendererUuid: conflict?.tendererUuid,
											templateUuid: attachmentID,
											hasConflict: true,
										},
									},
								})
							)
						)
					);
					code = responseNeg[0].data.createConflictOfInterestNegotiation.code;
				} catch (e) {
					console.error(e);
					code = 0;
				}
				break;
			default:
				break;
		}
		return code;
	}

	async deleteConflictOfInterest(type: string) {
		switch (type) {
			case 'Evaluation':
				return {};
			case 'PostQualification':
				return {};
			case 'Negotiation':
				return {};
			default:
				return {};
		}
	}

	async setHasConflictOfInterest(
		type: string,
		tenderUuid: string,
		attachmentUuid: string
	) {
		let code = 0;
		switch (type) {
			case 'Evaluation':
				const responseEv: any = await this.apollo.mutate({
					mutation: CREATE_CONFLICT_OF_INTEREST_STATUS,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						tenderUuid: tenderUuid,
						templateUuid: attachmentUuid,
						hasConflict: true,
					},
				});
				code = responseEv.data.noConflictOfInterest.code;
				break;
			case 'PostQualification':
				const responsePo: any = await this.apollo.mutate({
					mutation: CREATE_CONFLICT_OF_INTEREST_STATUS,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						tenderUuid: tenderUuid,
						templateUuid: attachmentUuid,
						hasConflict: true,
					},
				});
				code = responsePo.data.noConflictOfInterest.code;
				break;
			case 'Negotiation':
				const responseNe: any = await this.apollo.mutate({
					mutation: CREATE_CONFLICT_OF_INTEREST_STATUS,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						tenderUuid: tenderUuid,
						templateUuid: attachmentUuid,
						hasConflict: true,
					},
				});
				code = responseNe.data.noConflictOfInterest.code;
				break;
			default:
				break;
		}
		return code;
	}

	async setHasNoConflictOfInterest(
		type: string,
		tenderUuid: string,
		attachmentUuid: string
	) {
		let code = 0;
		switch (type) {
			case 'Evaluation':
				const responseEv: any = await this.apollo.mutate({
					mutation: CREATE_CONFLICT_OF_INTEREST_STATUS,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						tenderUuid: tenderUuid,
						templateUuid: attachmentUuid,
						hasConflict: false,
					},
				});
				code = responseEv.data.noConflictOfInterest.code;
				break;
			case 'PostQualification':
				const responsePo: any = await this.apollo.mutate({
					mutation: CREATE_CONFLICT_OF_INTEREST_STATUS,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						tenderUuid: tenderUuid,
						templateUuid: attachmentUuid,
						hasConflict: false,
					},
				});
				code = responsePo.data.noConflictOfInterest.code;
				break;
			case 'Negotiation':
				const responseNeg: any = await this.apollo.mutate({
					mutation: CREATE_CONFLICT_OF_INTEREST_STATUS,
					apolloNamespace: ApolloNamespace.submission,
					variables: {
						tenderUuid: tenderUuid,
						templateUuid: attachmentUuid,
						hasConflict: false,
					},
				});
				code = responseNeg.data.noConflictOfInterest.code;
				break;
			default:
				break;
		}
		return code;
	}

	async loadConflictReasons(type: string) {
		try {
			const response: any = await this.apollo.fetchData({
				query: GET_CONFLICT,
				apolloNamespace: ApolloNamespace.submission,
				variables: {
					input: {
						fields: [],
						mustHaveFilters: [],
						page: 1,
						pageSize: 1000,
					},
				},
			});

			switch (type) {
				case 'Evaluation':
					return (
						response?.data?.getConflictDeclarationReasonsPaginated?.data || []
					)
						.filter(
							(conflict: any) =>
								conflict.conflictDeclarationCategory.applyToEvaluationTeam ==
								true
						)
						.map((conflict: any) => ({
							uuid: conflict.uuid,
							reason: conflict.reason,
						}));
				default:
					return (
						response?.data?.getConflictDeclarationReasonsPaginated?.data || []
					)
						.filter(
							(conflict: any) =>
								conflict.conflictDeclarationCategory.applyToEvaluationTeam ==
								false
						)
						.map((conflict: any) => ({
							uuid: conflict.uuid,
							reason: conflict.reason,
						}));
			}
		} catch (e) {
			return [];
		}
	}
}
