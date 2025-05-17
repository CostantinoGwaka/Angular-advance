import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DownloadService {
    private totalRecords: number;
    private downloadedRecords = 0;
    private startTime: number;
    private lastDownloadedRecords = 0;
    private lastTime: number;

    // Define signals for percentage and time left
    percentageSignal = signal<number>(0);
    timeLeftSignal = signal<number>(0);

    constructor() {
        this.startTime = Date.now();
        this.lastTime = this.startTime;

        // Update every second
        setInterval(() => {
            this.updateTimeLeft();
        }, 1000);
    }

    startDownload(totalRecords: number): void {
        this.totalRecords = totalRecords;
        this.downloadedRecords = 0;
        this.startTime = Date.now();
        this.lastDownloadedRecords = 0;
        this.lastTime = this.startTime;
        this.percentageSignal.set(0);
        this.timeLeftSignal.set(0);
    }

    updateProgress(downloadedRecords: number): void {
        this.downloadedRecords = downloadedRecords;
        const percentage = (downloadedRecords / this.totalRecords) * 100;
        this.percentageSignal.set(percentage);
    }

    private updateTimeLeft(): void {
        const now = Date.now();
        const timeElapsed = (now - this.startTime) / 1000; // time in seconds
        const recordsDownloaded = this.downloadedRecords - this.lastDownloadedRecords;
        const timeSinceLast = (now - this.lastTime) / 1000; // time in seconds

        if (timeSinceLast > 0) {
            const downloadRate = recordsDownloaded / timeSinceLast; // records per second
            const remainingRecords = this.totalRecords - this.downloadedRecords;
            const estimatedTimeLeft = remainingRecords / downloadRate; // seconds

            this.timeLeftSignal.set(estimatedTimeLeft);
        }

        // Update last values
        this.lastDownloadedRecords = this.downloadedRecords;
        this.lastTime = now;
    }
}
