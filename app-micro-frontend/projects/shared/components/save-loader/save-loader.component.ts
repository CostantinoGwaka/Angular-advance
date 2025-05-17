import { AfterViewInit, Component, effect, inject, OnInit, Signal } from "@angular/core";
import { MatDialogActions, MatDialogRef } from "@angular/material/dialog";
import { MatButton } from "@angular/material/button";
import { LoaderData, SaveLoaderHelper } from "../../../services/save-loader-helper.service";
import { SignalsStoreService } from "../../../services/signals-store.service";



@Component({
	selector: 'app-save-loader',
	standalone: true,
	imports: [
		MatButton,
		MatDialogActions,
	],
	templateUrl: './save-loader.component.html',
	styleUrl: './save-loader.component.scss',
})
export class SaveLoaderComponent implements OnInit, AfterViewInit {

	signalStoreService = inject(SignalsStoreService);
	loaderData: Signal<LoaderData>
	constructor(
		public dialogRef: MatDialogRef<SaveLoaderComponent>,
		public saveLoaderHelper: SaveLoaderHelper
	) {
		this.loaderData = this.signalStoreService.select('blockLoaderDataKey');
		effect(() => {
			const data = this.loaderData();
			this.setProgress((data.countDownSeconds / data.maxSeconds) * 100);
			if (data) {
				console.log('LoaderData changed:', data);
			}
		});
	}

	ngOnInit() { }

	ngAfterViewInit(): void {
		this.loadLottieScript()
			.then(() => {
				this.loadLottieAnimation();
			})
			.catch((error) => {
				console.error('Error loading Lottie script:', error);
			});
	}

	loadLottieScript(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (document.getElementById('lottie-script')) {
				// console.log('Lottie script already loaded.');
				resolve();
				return;
			}

			const script = document.createElement('script');
			script.id = 'lottie-script';
			script.src = 'assets/js/lottie.min.js';
			script.onload = () => {
				// console.log('Lottie script loaded successfully.');
				resolve();
			};
			script.onerror = () => {
				console.error('Lottie script failed to load.');
				reject('Lottie script failed to load');
			};
			document.body.appendChild(script);
		});
	}

	loadLottieAnimation(): void {
		const container = document.getElementById('lottie-container');
		if (container) {
			// console.log('Container found:', container);

			// Access Lottie via the window object
			const lottie = (window as any).lottie;

			if (lottie) {
				lottie.loadAnimation({
					container: container, // the DOM element that will contain the animation
					renderer: 'svg', // 'canvas' or 'html' as renderer
					loop: true, // animation loops
					autoplay: true, // autoplay
					path: 'assets/animations/json/save-loader.json', // path to your Lottie JSON file
				});
			} else {
				console.error('Lottie is not defined.');
			}
		} else {
			console.error('Container is missing.');
		}
	}


	onClose(): void {
		this.saveLoaderHelper.closeDialog()
	}


	onRetry() {
		this.loaderData().isLoading = true;
		if (this.loaderData()?.retryFunction) {
			this.loaderData()?.retryFunction();
			/** Small delay to allow DOM updates**/
			setTimeout(() => {
				const container = document.getElementById('lottie-container');
				if (container) {
					this.loadLottieAnimation();
				} else {
					console.error('Lottie container not found!');
				}
			}, 100);
		}
	}


	// setProgress(value: number) {
	//   const progressCircle = document.getElementById('progress-circle');
	//   const radius = 40;
	//   const circumference = 2 * Math.PI * radius;
	//   const offset = circumference - (value / 100) * circumference;
	//   progressCircle.style.strokeDashoffset = offset.toString();
	// }

	setProgress(value: number) {
		const progressCircle = document.getElementById('progress-circle');
		if (!progressCircle) {
			// console.error("Element with ID 'progress-circle' not found!");
			return;
		}

		const radius = 40;
		const circumference = 2 * Math.PI * radius;
		const offset = circumference - (value / 100) * circumference;
		progressCircle.style.strokeDashoffset = offset.toString();
	}

}
