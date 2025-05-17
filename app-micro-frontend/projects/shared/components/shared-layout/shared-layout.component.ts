import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import {
  formSize,
  ROUTE_ANIMATIONS_ELEMENTS,
  tableSize,
} from '../../animations/router-animation';
import { fadeIn } from '../../animations/basic-animation';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { ApplicationState } from '../../../store';
import { submissionProgressBarStatus } from '../percentage-progress-bar/store/submission-progress/submission-progress.selectors';
import { ActivatedRoute } from '@angular/router';
import { showPercentageProgressBar } from '../percentage-progress-bar/store/submission-progress/submission-progress.actions';
import { evaluationProgressBarStatus } from '../percentage-progress-bar/store/evaluation-progress/evaluation-progress.selectors';
import { showEvaluationProgressBar } from '../percentage-progress-bar/store/evaluation-progress/evaluation-progress.actions';
import { Meta, Title } from '@angular/platform-browser';
import { NestUtils } from '../../utils/nest.utils';
import { Back } from '../../../store/router/router.action';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { EvaluationProgressBarComponent } from '../percentage-progress-bar/evaluation-progress-bar/evaluation-progress-bar.component';
import { SubmissionProgressBarComponent } from '../percentage-progress-bar/submission-progress-bar/submission-progress-bar.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TopBannerComponent } from '../topbanner/top-banner.component';
import { NgClass, AsyncPipe } from '@angular/common';
import { NotificationBannerComponent } from '../notification-banner/notification-banner.component';
import { StorageService } from '../../../services/storage.service';
import { HasPermissionDirective } from '../../directives/has-permission.directive';

@Component({
	selector: 'app-shared-layout',
	templateUrl: './shared-layout.component.html',
	styleUrls: ['./shared-layout.component.scss'],
	animations: [formSize, tableSize, fadeIn],
	standalone: true,
	imports: [
		TopBannerComponent,
		NgClass,
		MatButtonModule,
		MatIconModule,
		MatDividerModule,
		MatProgressBarModule,
		MatCardModule,
		SubmissionProgressBarComponent,
		EvaluationProgressBarComponent,
		AsyncPipe,
		TranslatePipe,
		NotificationBannerComponent,
		HasPermissionDirective,
	],
})
export class SharedLayoutComponent implements OnInit, OnChanges, OnDestroy {
	@Input() Analysis: string = null;
	@Input() page_title = null;
	@Input() subTitle: string = '';
	@Input() titleStyle: string = '';
	@Input() subTitleStyle: string = '';
	@Input() loading = false;
	@Input() formTitle: string = '';
	@Input() addPermission: string[] = [];
	@Input() addHasFeatureAndPermission: boolean = false;
	@Input() addFeatureAndPermission: string[] = [];
	@Input() helpText: string = '';
	@Input() showHelp = true;
	@Input() menus = [];
	@Input() dropMenuOnCreate: any[] = [];
	@Input() useDropdownOnCreate?: any;
	@Input() useBottomProgressBar?: boolean = false;
	@Input() viewDetails = false;
	@Input() hideAdd = false;
	@Input() hideButtonIcon = false;
	@Input() btnAddText: string = 'SYSTEM_CREATE';
	@Input() btnAddIcon: string = 'add';
	@Input() smallForm = true;
	@Input() useStoreBackDispatch = false;
	@Input() hideBreadcrumb = false;
	@Output() addItem = new EventEmitter();
	@Output() closeDetails = new EventEmitter();
	@Output() evaluationCompleted = new EventEmitter();
	@Output() buttonMenuAction = new EventEmitter();
	@Input() animationSize: 'eighty' | 'sixty' | 'largeForm' | 'full' = 'sixty';
	@Input() image: any;

	subscriptions: Subscription[] = [];
	routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
	showSubmissionProgressBar$: Observable<boolean>;
	showEvaluationProgressBar$: Observable<boolean>;

	constructor(
		private activeRoute: ActivatedRoute,
		private store: Store<ApplicationState>,
		private titleService: Title,
		private meta: Meta,
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['formTitle']) {
			this.formTitle = changes['formTitle'].currentValue;
		}
		if (changes['Analysis'] || changes['page_title']) {
			this.setPageTitleAndDescription();
		}
	}

	setPageTitleAndDescription() {
		let title = this.page_title ? this.page_title : this.Analysis;
		this.titleService.setTitle(NestUtils.setPageTitle(title, this.meta));
	}

	ngOnInit() {
		/** Get url path segments and check page path */
		const segments = this.activeRoute.snapshot.url.map(
			(segment) => segment.path,
		);
		const page = segments[segments.length - 1];
		if (page === 'submission') {
			this.showSubmissionProgressBar$ = this.store.pipe(
				select(submissionProgressBarStatus),
			);

			this.store.dispatch(
				showEvaluationProgressBar({ showEvaluationProgressBar: false }),
			);

			this.subscriptions.push(
				this.showSubmissionProgressBar$.subscribe((status) => {
					if (status) {
						this.subscriptions.push(
							this.activeRoute.queryParams.subscribe((items) => {
								const action = items['action'] ?? '';
								if (action !== 'submission') {
									this.store.dispatch(
										showPercentageProgressBar({
											showPercentageProgressBar: false,
										}),
									);
								}
							}),
						);
					}
				}),
			);
		} else if (page === 'evaluation' || page === 'pre-qualification-process') {
			this.showEvaluationProgressBar$ = this.store.pipe(
				select(evaluationProgressBarStatus),
			);
			this.store.dispatch(
				showPercentageProgressBar({ showPercentageProgressBar: false }),
			);
			this.subscriptions.push(
				this.showEvaluationProgressBar$.subscribe((status) => {
					if (status) {
						this.subscriptions.push(
							this.activeRoute.queryParams.subscribe((items) => {
								const action = items['action'] ?? '';
								if (action !== 'evaluate') {
									this.store.dispatch(
										showEvaluationProgressBar({
											showEvaluationProgressBar: false,
										}),
									);
								}
							}),
						);
					}
				}),
			);
		} else {
			/// Hide both progress bars
			this.store.dispatch(
				showPercentageProgressBar({ showPercentageProgressBar: false }),
			);
			this.store.dispatch(
				showEvaluationProgressBar({ showEvaluationProgressBar: false }),
			);
		}
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((subscription) => {
			subscription.unsubscribe();
		});
	}

	closeForm() {
		if (!this.useStoreBackDispatch) {
			this.closeDetails.emit();
		} else {
			this.store.dispatch(new Back());
		}
	}

	add() {
		this.addItem.emit();
	}

	onButtonMenuAction($event) {
		this.buttonMenuAction.emit($event);
	}
}
