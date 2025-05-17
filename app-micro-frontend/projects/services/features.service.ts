import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root',
})
export class FeaturesService {
	constructor(private storageService: StorageService) {}

	featureIsEnabled(features: string[]): boolean {
		if (environment.ALLOW_PERMISSIONS) {
			return true;
		}

		const userSystemAccessFeature =
			this.storageService.getItem('accessPeFeatures');
		let enabled = false;
		features.forEach((feature) => {
			if (userSystemAccessFeature?.includes(feature)) {
				enabled = true;
			}
		});

		return enabled;
	}
}
