import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

@Component({
    selector: 'app-tiny-circular-progress',
    templateUrl: './tiny-circular-progress.component.html',
    styleUrls: ['./tiny-circular-progress.component.scss'],
    standalone: true
})
export class TinyCircularProgressComponent implements AfterViewInit {
  @ViewChild('progressCanvas', { static: true }) progressCanvas: ElementRef;
  @Input() percentage: number = 0;
  constructor() { }

  ngAfterViewInit(): void {
    this.drawProgress();
  }

  drawProgress(): void {
    const canvas: HTMLCanvasElement = this.progressCanvas.nativeElement;
    const context: CanvasRenderingContext2D = canvas.getContext('2d');

    const canvasWidth: number = canvas.width;
    const canvasHeight: number = canvas.height;
    const circleSize: number = Math.min(canvasWidth, canvasHeight);

    const centerX: number = (canvasWidth - circleSize) / 2 + circleSize / 2;
    const centerY: number = (canvasHeight - circleSize) / 2 + circleSize / 2;
    const radius: number = circleSize / 2 - 5;

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (this.percentage >= 100) {

      // Draw check icon
      context.fillStyle = '#21A43F';
      context.font = 'bold 100px "Material Icons"';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText('check_circle', centerX, centerY);
    } else {
      // Draw gray border
      context.strokeStyle = '#e5e7eb';
      context.lineWidth = 20;
      context.beginPath();
      context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      context.stroke();

      // Draw green progress
      const progressAngle = (this.percentage / 100) * 2 * Math.PI;
      context.strokeStyle = '#21A43F';
      context.lineWidth = 20;
      context.beginPath();
      context.arc(centerX, centerY, radius, -0.5 * Math.PI, progressAngle - 0.5 * Math.PI);
      context.stroke();

      if (this.percentage > 0) {
        context.fillStyle = '#21A43F';
      } else {
        context.fillStyle = 'black';

      }

      // Draw text
      context.font = 'bold 42px Arial';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(`${this.percentage.toFixed(0)}%`, centerX, centerY);
    }

  }

}
