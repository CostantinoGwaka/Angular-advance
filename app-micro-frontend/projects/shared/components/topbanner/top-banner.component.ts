import { TranslationService } from '../../../services/translation.service';
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
import {
	fadeIn,
	ROUTE_ANIMATIONS_ELEMENTS,
} from '../../animations/router-animation';
import { JsonPipe, Location, NgClass, NgTemplateOutlet } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { HasPermissionDirective } from '../../directives/has-permission.directive';
import { MatIconModule } from '@angular/material/icon';
import { LoaderComponent } from '../loader/loader.component';
import { HasPermissionAndFeatureDirective } from '../../directives/has-permission-and-feature.directive';
import { HasAccessFeatureDirective } from '../../directives/has-access-feature.directive';

export interface CreateDropDown {
	id: string;
	name: string;
	label: string;
	icon: string;
}

@Component({
	selector: 'app-top-banner',
	templateUrl: './top-banner.component.html',
	styleUrls: ['./top-banner.component.scss'],
	animations: [fadeIn],
	standalone: true,
	imports: [
		MatIconModule,
		HasPermissionDirective,
		MatButtonModule,
		NgClass,
		MatMenuModule,
		MatProgressBarModule,
		TranslatePipe,
		JsonPipe,
		LoaderComponent,
		NgTemplateOutlet,
		HasPermissionAndFeatureDirective,
		HasAccessFeatureDirective
	],
})
export class TopBannerComponent implements OnInit, OnChanges, OnDestroy {
	@Input() title = '';
	@Input() subTitle = '';
	@Input() titleStyle = '';
	@Input() subTitleStyle = '';
	@Input() image = '';
	@Input() url = '';
	@Input() useDropdownOnCreate = false;
	@Input() showHelp = false;
	@Input() hideAdd = true;
	@Input() hideButtonIcon = false;
	@Input() viewDetails = false;
	@Input() loading = false;
	@Input() addPermission: string[] = [];
	@Input() addHasFeatureAndPermission: boolean = false;
	@Input() addFeatureAndPermission: string[] = [];
	@Input() menuItems: any[] = [];
	@Input() btnAddText: string = 'SYSTEM_CREATE';
	@Input() btnAddIcon: string = 'add';
	@Input() dropMenuOnCreate: any = [];
	check = false;
	twoPath: boolean = false;
	value: string;
	value2: string;
	@Output() addClicked = new EventEmitter();
	@Output() onButtonMenuAction = new EventEmitter();
	routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
	urlSubscription: Subscription;
	displayTitle = '';

	constructor(
		private location: Location,
		private route: ActivatedRoute,
		private translationService: TranslationService,
	) { }

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['title']) {
			this.initializer(true);
		}
	}

	ngOnInit() {
		this.initializer(false);
	}

	initializer(destroySubscription: boolean = false) {
		this.urlSubscription = this.route.url.subscribe((params) => {
			this.displayTitle = '';
			try {
				if (params.length > 1) {
					let path = params[0].path;
					let key: string = '';
					this.twoPath = true;
					if (path == 'profile-information') {
						key = 'TENDERER_PROFILE_BUSINESS_QUALIFICATION_INFORMATION';
						this.check = true;
					} else if (path == 'wallet') {
						this.check = false;
						path = 'billing';
					} else {
						this.check = false;
					}
					this.check
						? this.getKeySubRoute(key, this.title)
						: this.getNormalSubRoute(path, this.title);
				} else {
					this.value = this.title;
					this.twoPath = false;
				}
			} catch (e) { }
		});
		if (destroySubscription) {
			this.urlSubscription.unsubscribe();
		}
	}

	getKeySubRoute(key, subRoute) {
		this.value = key;
		this.value2 = subRoute;
	}

	getNormalSubRoute(path, subRoute) {
		this.value = this.sanitizeParentTitle(path);
		this.value2 = subRoute;
	}

	sanitizeParentTitle(path: string) {
		path = path.replace(/-/gi, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
		return path.charAt(0).toUpperCase() + path.substring(1, path.length);
	}

	openHelp() {
		// this.commonService.showHelp(this.title);
	}

	add() {
		this.addClicked.emit();
	}

	buttonMenuAction(event: any) {
		this.onButtonMenuAction.emit(event);
	}

	goBack() {
		this.location.back();
	}

	ngOnDestroy(): void {
		if (this.urlSubscription) {
			this.urlSubscription.unsubscribe();
		}
	}
}
