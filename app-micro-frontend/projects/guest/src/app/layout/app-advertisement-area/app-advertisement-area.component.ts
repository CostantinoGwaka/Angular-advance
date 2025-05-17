import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ImageAdvertisementComponent } from "./image-advertisement/image-advertisement.component";
import { VideoAdvertisementComponent } from "./video-advertisement/video-advertisement.component";
import { TipAdvertisementComponent } from "./tip-advertisement/tip-advertisement.component";
import { NgClass } from "@angular/common";
import { PaginatedDataInput, PaginatedDataService } from "../../../services/paginated-data.service";
import {
	GET_ALL_ADVERTISEMENT_PUBLIC_DATA
} from "../../../modules/nest-settings/store/advertisements/advertisements.graphql";
import { Advertisement } from "../../../modules/nest-settings/store/advertisements/advertisements.model";
import { ApolloNamespace } from "../../../apollo.config";
import {
	VideoAdvertisementSkeletonComponent
} from './video-advertisement-skeleton/video-advertisement-skeleton.component';

@Component({
	selector: 'app-advertisement-area',
	standalone: true,
	imports: [
		ImageAdvertisementComponent,
		VideoAdvertisementComponent,
		TipAdvertisementComponent,
		NgClass,
		VideoAdvertisementSkeletonComponent,
	],
	templateUrl: './app-advertisement-area.component.html',
	styleUrl: './app-advertisement-area.component.scss',
})
export class AppAdvertisementAreaComponent implements OnInit {
	loadingAdverts: boolean = true;
	publicAdvertisements: Advertisement[] = [];
	publicAdvertisement: Advertisement;

	currentActive = 0;
	constructor(private paginatedDataService: PaginatedDataService) { }

	async getAllAdvertisement(): Promise<Advertisement[]> {
		// const paginatedDataInput: PaginatedDataInput = {
		// 	page: 1,
		// 	pageSize: 20,
		// 	fields: [
		// 		{
		// 			fieldName: 'id',
		// 			isSortable: true,
		// 			orderDirection: 'DESC',
		// 		},
		// 	],
		// 	mustHaveFilters: [],
		// 	query: GET_ALL_ADVERTISEMENT_PUBLIC_DATA,
		// 	apolloNamespace: ApolloNamespace.uaa,
		// 	fetchPolicy: 'cache-first',
		// };
		return []; //await this.paginatedDataService.getAllData(paginatedDataInput);
	}

	ngOnInit(): void {
		this.loadingAdverts = true;
		this.getAllAdvertisement().then((data) => {
			if (data) {
				this.publicAdvertisements = data;
			}
			if (data?.length > 0) {
				this.publicAdvertisement = data[0];
			}
			this.loadingAdverts = false;

			setInterval(() => {
				this.changeSlider();
			}, 10000);
		});
		// this.sampleAdvertisement = this.sampleAdvertisements[0];
	}

	changeSlider(): void {
		if (this.currentActive < this.publicAdvertisements.length - 1) {
			this.currentActive += 1;
		} else {
			this.currentActive = 0;
		}
		this.publicAdvertisement = this.publicAdvertisements[this.currentActive];
	}

	moveNext(): void {
		if (this.currentActive < this.publicAdvertisements.length - 1) {
			this.currentActive += 1;
		} else {
			this.currentActive = 0;
		}
		this.publicAdvertisement = this.publicAdvertisements[this.currentActive];
	}

	movePrevious() {
		if (this.currentActive > 0 && this.publicAdvertisements.length) {
			this.currentActive -= 1;
		} else {
			this.currentActive = this.publicAdvertisements.length - 1;
		}
		this.publicAdvertisement = this.publicAdvertisements[this.currentActive];
	}

	currentIndexClicked(index: number): void {
		this.currentActive = index;
		this.publicAdvertisement = this.publicAdvertisements[index];
	}
}
