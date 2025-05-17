import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnInit,
	Output,
} from '@angular/core';
import { User } from 'src/app/modules/nest-uaa/store/user-management/user/user.model';
import { GraphqlService } from '../../../services/graphql.service';
import { NotificationService } from '../../../services/notification.service';
import { DynamicFormService } from '../dynamic-forms-components/dynamic-form.service';
import {
	FieldConfig,
	FieldType,
} from '../dynamic-forms-components/field.interface';
import {
	FIND_USERS_BY_INSTITUTION_UUID_FOR_USER_PICKING,
	GET_PROCURING_ENTITIES_FOR_USER_PICKING,
	USER_PICKER_GET_PE_USERS_BY_INSTITUTION_AND_ROLE_NAME,
} from './store/user-picker-model.graphql';

import {
	MAT_DIALOG_DATA,
	MatDialogModule,
	MatDialogRef,
} from '@angular/material/dialog';
import { UserPickerModalData } from './user-picker-modal.service';
import { select, Store } from '@ngrx/store';
import { first, firstValueFrom, map, Observable } from 'rxjs';
import { AuthUser } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.model';
import { selectModifiedAuthUsers } from 'src/app/modules/nest-uaa/store/user-management/auth-user/auth-user.selectors';
import { ApplicationState } from 'src/app/store';
import { GET_TENDERER_USER_BY_TENDERER } from 'src/app/modules/nest-uaa/store/user-management/user/user.graphql';
import { SearchPipe } from '../../pipes/search.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoaderComponent } from '../loader/loader.component';
import { PaginatedSelectComponent } from '../dynamic-forms-components/paginated-select/paginated-select.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ApolloNamespace } from '../../../apollo.config';

@Component({
	selector: 'app-user-picker-modal',
	templateUrl: './user-picker-modal.component.html',
	standalone: true,
	imports: [
    MatDialogModule,
    MatCheckboxModule,
    FormsModule,
    PaginatedSelectComponent,
    LoaderComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    SearchPipe
],
})
export class UserPickerModalComponent implements OnInit {
	@Output() closeForm = new EventEmitter<boolean>();
	selectedPeUid: string;
	selectedTE: string;
	loading = false;
	savingData = false;
	searchString: string;
	@Input() selectedUuid: string;
	users: User[] = [];
	user: User;
	isValidSelection: boolean = false;
	loadingUsers: boolean = false;
	selectedMembers: any[];
	isSaving: boolean = false;
	institutionUuid: string;
	tendererUserUuid: string;
	user$: Observable<AuthUser>;
	authUser: AuthUser;
	selectedInstitution: any;
	selectFromOtherInstitutions: boolean = false;
	userUuid: string;

	rolesString: string = '';

	constructor(
		private dynamicFormService: DynamicFormService,
		private apollo: GraphqlService,
		private notificationService: NotificationService,
		@Inject(MAT_DIALOG_DATA)
		public data: UserPickerModalData,
		private dialogRef: MatDialogRef<UserPickerModalComponent>,
		private store: Store<ApplicationState>
	) {
		this.user$ = this.store.pipe(
			select(selectModifiedAuthUsers),
			map((users) => users[0] as AuthUser)
		);
	}

	institutionField: FieldConfig = {
		type: FieldType.select,
		label: 'Select User Institution',
		key: 'userInstitutionUuid',
		query: GET_PROCURING_ENTITIES_FOR_USER_PICKING,
		apolloNamespace: ApolloNamespace.uaa,
		searchFields: ['name', 'acronym'],
		options: [],
		optionName: 'name,acronym',
		optionValue: 'uuid',
		mapFunction: (item) => {
			return {
				uuid: item.uuid,
				name: item.name,
			};
		},
		useObservable: true,
		validations: [],
		rowClass: 'col12',
	};

	tendererUsersField: FieldConfig = {
		type: FieldType.select,
		label: 'Select User',
		key: 'userUuid',
		query: GET_TENDERER_USER_BY_TENDERER,
		apolloNamespace: ApolloNamespace.uaa,
		searchFields: ['firstName', 'middleName', 'lastName'],
		options: [],
		optionName: 'fullName',
		optionValue: 'uuid',
		mapFunction: (item) => {
			return {
				uuid: item.uuid,
				fullName: `${item.firstName} ${item.middleName} ${item.lastName}`,
			};
		},
		useObservable: true,
		validations: [],
		rowClass: 'col12',
	};

	ngOnInit(): void {
		this.init();
	}

	onSelectFromOtherInstitutions(event: any) {
		this.selectFromOtherInstitutions = event.checked;
		this.selectedInstitution = null;
		this.users = [];
		this.user = null;
		if (!this.selectFromOtherInstitutions) {
			this.getUsersByPEUuid(this.authUser.procuringEntity.uuid);
		}
	}

	async init() {
		this.authUser = await firstValueFrom(
			this.user$.pipe(
				first((i) => !!i && (!!i.procuringEntity || !!i.tenderer))
			)
		);
		if (this.data.institutionType === 'PE') {
			this.getUsersByPEUuid(this.authUser.procuringEntity.uuid);
		}
		this.rolesString = this.data.roles
			?.join(', ')
			.toLowerCase()
			.replace('_', ' ')
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	async onPESelected(event: any) {
		this.selectedInstitution = event.object;
		this.getUsersByPEUuid(event.value);
	}

	async onTendererUserSelected(event: any) {
		this.user = event.object;
	}

	getUsersByPEUuid(peUuid: string) {
		this.loadingUsers = true;
		this.user = null;
		this.users = [];

		let query: any;
		let apolloNamespace: ApolloNamespace;
		let variables: any;

		if (this.data.roles?.length > 0) {
			query = USER_PICKER_GET_PE_USERS_BY_INSTITUTION_AND_ROLE_NAME;
			apolloNamespace = ApolloNamespace.uaa;
			variables = {
				roleName: this.data.roles[0],
				procuringEntityUuid: peUuid,
			};
		} else {
			query = FIND_USERS_BY_INSTITUTION_UUID_FOR_USER_PICKING;
      apolloNamespace = ApolloNamespace.uaa;
			variables = {
				procuringEntityUuid: peUuid,
			};
		}

		try {
			this.apollo
				.fetchData({
					query: query,
					apolloNamespace: apolloNamespace,
					variables,
				})
				.then((response: any) => {
					this.setUsers(response.data.results?.dataList);
				});
		} catch (e) {}
		this.loadingUsers = false;
	}

	onSelectedUser(event: any) {
		this.user = this.users.find((i) => i.uuid === event.value);
	}

	selectUser() {
		this.dialogRef.close({
			user: this.user,
			institution: this.selectedInstitution,
		});
	}

	setUsers(_users: any[]) {
		if (_users?.length > 0) {
			if (this.data.allowSelfSelection) {
				this.users = _users.filter((user) =>
					this.data.allowSelfSelection ? user.uuid !== this.authUser.uuid : true
				);
			} else {
				this.users = _users;
			}
		} else {
			if (this.selectedInstitution) {
				this.notificationService.errorMessage('No users found');
			}
		}
	}
}
