
import { Directive, Input, OnInit, ElementRef, EventEmitter, Output, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatSelect } from '@angular/material/select';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';

@Directive({
    selector: '[gInfiniteScroll]',
    standalone: true
})
export class SelectInfiniteScrollDirective implements OnInit, OnDestroy, AfterViewInit {


    @Input() threshold = '15%'; // Threshold for triggering the infinite scroll (percentage or pixel value)
    @Input() debounceTime = 150; // Debounce time in milliseconds
    @Output() infiniteScroll = new EventEmitter<boolean>(); // Event emitted when the scroll reaches the threshold
    private panel: HTMLElement; // Reference to the select panel element
    private thrPx = 0; // Threshold value in pixels
    private thrPc = 0; // Threshold value as a percentage
    private singleOptionHeight = 3; // Height of a single select option in pixels
    @Input() complete: boolean;
    @Input() selectOptions: any[];
    private destroyed$ = new Subject<boolean>(); // Subject to track the destruction of the directive

    private userHasScrolled = true; // Flag to track if the user has scrolled

    private timeoutId: ReturnType<typeof setTimeout> | null = null; // Declare the correct type for timeoutId

    constructor(private select: MatSelect, private ngZone: NgZone) {
    }

    ngOnInit() {
        this.evaluateThreshold();
    }

    ngAfterViewInit() {
        this.select.openedChange.pipe(
            takeUntil(this.destroyed$)
        ).subscribe((opened) => {
            if (opened) {
                this.panel = this.select.panel.nativeElement;
                this.singleOptionHeight = this.getSelectItemHeightPx();
                this.registerScrollListener();
            }
        });
    }

    /**
     * Gets the height of a single select option in pixels.
     * @returns The height of a single select option in pixels.
     */
    getSelectItemHeightPx(): number {
        return parseFloat(getComputedStyle(this.panel).fontSize) * 3;
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Evaluates the threshold value based on the provided input.
     */
    evaluateThreshold() {
        if (this.threshold.lastIndexOf('%') > -1) {
            this.thrPx = 0;
            this.thrPc = (parseFloat(this.threshold) / 100);

        } else {
            this.thrPx = parseFloat(this.threshold);
            this.thrPc = 0;
        }
    }
    /**
     * Registers the scroll event listener on the select panel.
     */
    registerScrollListener() {
        fromEvent(this.panel, 'scroll').pipe(
            takeUntil(this.destroyed$),
            debounceTime(this.debounceTime),
            tap((event) => {

                this.handleScrollEvent(event);
            })
        ).subscribe();
    }

    private debounce(fn: Function, delay: number) {
        return (...args: any[]) => {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }

            this.timeoutId = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    }
    /**
 * Handles the scroll event and emits the infiniteScroll event if the scroll reaches the threshold.
 * @param event The scroll event object.
 */
    handleScrollEvent(event) {
        this.ngZone.runOutsideAngular(() => {
            if (this.complete) {
                return;
            }
            const countOfRenderedOptions = this.select.options.length;
            const infiniteScrollDistance = this.singleOptionHeight * countOfRenderedOptions;
            const threshold = this.thrPc !== 0 ? (infiniteScrollDistance * this.thrPc) : this.thrPx;
            const scrolledDistance = this.panel.clientHeight + event.target.scrollTop;
            if ((scrolledDistance + threshold) >= infiniteScrollDistance && this.userHasScrolled) {
                this.ngZone.run(() => this.infiniteScroll.emit(true));
                // Set the userHasScrolled flag to true when the user scrolls
                this.userHasScrolled = false;
                // After debounceTime, set the flag back to false
                this.debounce(() => (this.userHasScrolled = true), 3000)();
                // this.scrollPanelToMiddle();
            }
        });
    }

    /**
 * Scrolls the panel back to the middle position.
 */
    // scrollPanelToMiddle() {
    //     const middleScrollPosition = this.panel.scrollHeight / 1.5 - this.panel.offsetHeight / 1.5;
    //     this.panel.scrollTop = middleScrollPosition;
    // }

}
