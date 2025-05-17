import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {ColorExtractionService} from "../../color-extraction-service.service";
import {Advertisement} from "../../../../modules/nest-settings/store/advertisements/advertisements.model";
import { MatTooltip } from '@angular/material/tooltip';

@Component({
	selector: 'app-image-advertisement',
	standalone: true,
	imports: [NgOptimizedImage, MatTooltip],
	templateUrl: './image-advertisement.component.html',
	styleUrl: './image-advertisement.component.scss',
})
export class ImageAdvertisementComponent implements OnInit {
	@Input()
	sampleAdvertisement: Advertisement;
	@ViewChild('imageElement', { static: true })
	imageElement!: ElementRef<HTMLImageElement>;

	colors: number[][] = [];

	constructor(private colorExtractionService: ColorExtractionService) {}

	ngOnInit(): void {
		this.imageElement.nativeElement.onload = () => {
			this.colors = this.colorExtractionService.getColors(
				this.imageElement.nativeElement,
			);
		};
	}

	openAdLink(url: string | null): void {
		if (url) {
			window.open(url, '_blank');
		}
	}
}
