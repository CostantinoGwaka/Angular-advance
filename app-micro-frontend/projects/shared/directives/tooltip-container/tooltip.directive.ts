import { Overlay, OverlayRef, PositionStrategy } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import {
	Directive,
	ElementRef, HostListener,
	inject, Injector, Input,
	OnDestroy,
	ViewContainerRef
} from "@angular/core";
import {
	TOOLTIP_DATA,
	TooltipContainerComponent, TooltipData
} from "./container/tooltip-container.component";

@Directive({
	selector: "[appTooltip]",
	standalone: true,
})
export class TooltipDirective implements OnDestroy {
	private element = inject<ElementRef<HTMLElement>>(ElementRef);
	private overlay = inject(Overlay);
	private viewContainer = inject(ViewContainerRef);

	@Input() appTooltip!: TooltipData;
	@Input() appTooltipContext: any;

	private overlayRef: OverlayRef | null = null;

	@HostListener("mouseenter")
	@HostListener("focus")
	showTooltip(): void {
		if (this.overlayRef?.hasAttached() === true) {
			return;
		}

		this.attachTooltip();
	}

	@HostListener("mouseleave")
	@HostListener("blur")
	hideTooltip(): void {
		if (this.overlayRef?.hasAttached() === true) {
			this.overlayRef?.detach();
		}
	}

	ngOnDestroy(): void {
		this.overlayRef?.dispose();
	}

	private attachTooltip(): void {
		if (this.overlayRef === null) {
			const positionStrategy = this.getPositionStrategy();
			this.overlayRef = this.overlay.create({ positionStrategy });
		}

		const injector = Injector.create({
			providers: [
				{
					provide: TOOLTIP_DATA,
					useValue: { appTooltipContext: this.appTooltipContext, appTooltip: this.appTooltip },
				},
			],
		});
		const component = new ComponentPortal(TooltipContainerComponent, this.viewContainer, injector);
		this.overlayRef.attach(component);
	}

	private getPositionStrategy(): PositionStrategy {
		return this.overlay
			.position()
			.flexibleConnectedTo(this.element)
			.withPositions([
				{
					originX: "center",
					originY: "top",
					overlayX: "center",
					overlayY: "bottom",
					panelClass: "top",
				},
				{
					originX: "center",
					originY: "bottom",
					overlayX: "center",
					overlayY: "top",
					panelClass: "bottom",
				},
			]);
	}
}