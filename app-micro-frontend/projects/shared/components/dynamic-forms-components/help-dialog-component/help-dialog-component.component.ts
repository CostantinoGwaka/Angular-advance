import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom, map, Observable, of } from 'rxjs';
import { GraphqlOperationService } from '../../../../services/graph-operation.service';
import { GraphqlService } from '../../../../services/graphql.service';
import { fadeIn } from 'src/app/shared/animations/router-animation';
import { DOCUMENT, AsyncPipe, TitleCasePipe } from '@angular/common';
import { AuthUser } from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.model";
import { select, Store } from "@ngrx/store";
import { selectModifiedAuthUsers } from "../../../../modules/nest-uaa/store/user-management/auth-user/auth-user.selectors";
import { ApplicationState } from "../../../../store";
import { first } from "rxjs/operators";
import { AuthService } from "../../../../services/auth.service";
import { StorageService } from '../../../../services/storage.service';
import { WithLoadingPipe } from '../../with-loading.pipe';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';



export interface HelpDialogData {
  label: string,
  hint?: string
  key: string
}

@Component({
  selector: 'app-help-dialog-component',
  templateUrl: './help-dialog-component.component.html',
  styleUrls: ['./help-dialog-component.component.scss'],
  animations: [fadeIn],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatInputModule, TextFieldModule, FormsModule, AsyncPipe, TitleCasePipe, WithLoadingPipe]
})
export class HelpDialogComponent implements OnInit {
  field: HelpDialogData;
  helpTextData$: Observable<any>
  isAdmin = true;
  textValue = '';
  example = '';
  url = '';
  uuid?: String;
  saving = false;
  hasAccess: boolean = false;
  user$: Observable<AuthUser>;
  currentUser: AuthUser;

  constructor(
    private graphqlService: GraphqlService,
    private storageService: StorageService,
    private graphqlOperationService: GraphqlOperationService,
    private store: Store<ApplicationState>,
    private router: Router,
    private authService: AuthService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(MAT_DIALOG_DATA) public data: HelpDialogData) {
    this.field = data;
    this.url = this.router.url;
    this.user$ = this.store.pipe(select(selectModifiedAuthUsers), map(users => users[0]));

  }

  ngOnInit(): void {
    this.initializer().then();
  }
  async initializer() {
    this.currentUser = await firstValueFrom(this.user$.pipe(first(i => !!i && !!i.procuringEntity)));
    this.hasAccess = localStorage.getItem('anaweza') == 'ndio' ? true : false;
    // this.hasAccess = await this.authService.hasPermission('ROLE_STNG_UAA_STNG_MNG_INPT_HINTS');
    // const hostUrl = this.document.location?.hostname;
    // if (hostUrl == 'nest.go.tz' && this.currentUser?.procuringEntity?.uuid === 'eb3a2300-27c2-437f-a34e-9c77df5fa784') {
    //   this.hasAccess = true;
    // }
    this.getHelpText();
  }
  getHelpText() {
    this.saving = true;
    this.helpTextData$ = of(null);
    setTimeout(() => {
      this.helpTextData$ = this.graphqlOperationService.fetchData(
        {
          apolloNamespace: ApolloNamespace.template,
          hideSuccessNotifications: true,
          withData: true,
          fetchPolicy: 'network-only',
          responseFields: "uuid textValue example",
          graphName: 'findHelpTextLabelByUrlAndKey', inputs: [{
            inputType: "String",
            key: this.field.key
          },
          {
            inputType: "String",
            url: this.url.split("&")[0]
          }]
        }
      ).pipe(map((response) => {
        this.textValue = response.data?.textValue || '';
        this.example = response.data?.example || '';
        this.uuid = response.data?.uuid;
        this.saving = false;
        return this.textValue;
      }));

    }, 1);

  }


  async saveHelpText() {
    this.saving = true;
    const response = await firstValueFrom(this.graphqlOperationService.mutate({
      apolloNamespace: ApolloNamespace.template,
      graphName: 'createUpdateHelpTextLabel',
      inputs: [{
        inputType: 'HelpTextLabelDtoInput',
        helpTextLabelDto: {
          key: this.field.key,
          textValue: this.textValue,
          url: this.url.split("&")[0],
          uuid: this.uuid,
          example: this.example
        }
      }]
    }));
    this.saving = false;
  }
}
