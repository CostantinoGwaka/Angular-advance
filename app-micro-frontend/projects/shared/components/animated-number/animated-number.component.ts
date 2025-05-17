import { Component, Input, OnInit, OnChanges, SimpleChanges, input } from '@angular/core';

@Component({
    selector: 'app-animated-number',
    template: `<p>{{ formattedValue }}</p>`,
    standalone: true,
    styleUrls: ['./animated-number.component.scss']
})
export class AnimatedNumberComponent implements OnInit, OnChanges {
    targetValue = input<number>(0)
    maximumFractionDigits = input<number>(0)
    minimumFractionDigits = input<number>(0)
    displayedValue: number = 0;
    formattedValue: string = '0';

    ngOnInit(): void {
        this.animateNumber(0, this.targetValue());
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['targetValue']) {
            this.animateNumber(this.displayedValue, this.targetValue());
        }
    }

    private animateNumber(start: number, end: number): void {
        const duration = 1000; // Total duration of the animation in milliseconds
        const startTime = performance.now();
        const startDigits = Math.floor(start / 10000); // Initial thousands part
        const endDigits = Math.floor(end / 10000); // Final thousands part

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Apply easing: faster at the beginning, slower at the end
            const easedProgress = this.easeOutCubic(progress);

            const currentThousands = startDigits + (endDigits - startDigits) * easedProgress;
            const currentFraction = (end % 10000) * easedProgress; // Animate last 4 digits more slowly
            this.displayedValue = Math.floor(currentThousands * 10000 + currentFraction);

            this.formattedValue = this.formatNumber(this.displayedValue);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    }

    private formatNumber(value: number): string {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: this.minimumFractionDigits(),
            maximumFractionDigits: this.maximumFractionDigits()
        }).format(value);
    }

    private easeOutCubic(t: number): number {
        // Ease out cubic function: starts fast and slows towards the end
        return 1 - Math.pow(1 - t, 3);
    }
}
