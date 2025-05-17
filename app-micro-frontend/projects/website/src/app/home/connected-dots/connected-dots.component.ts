import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';

interface Dot {
  x: number;
  y: number;
  radius: number;
  color: string;
  vx: number;
  vy: number;
}

@Component({
    selector: 'app-connected-dots',
    templateUrl: './connected-dots.component.html',
    styleUrls: ['./connected-dots.component.scss'],
    standalone: true,
})
export class ConnectedDotsComponent implements OnInit {
  constructor() { }

  canvas: any;
  ctx: any;

  dots: Dot[] = [];
  FPS: number = 60;
  totalDots = 40;
  mousePosition = {
    x: 0,
    y: 0,
  };

  dotColors = ['#2DB34B', '#2494D2', '#B5B5B5'];

  @ViewChild('canvasWrapper') private canvasWrapper: ElementRef;

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.setCanvas();
    this.initiliseDots();
    this.animate();
  }

  initiliseDots() {
    for (var i = 0; i < this.totalDots; i++) {
      this.dots.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: 2 + Math.floor(Math.random() * 3),
        color:
          this.dotColors[Math.floor(Math.random() * this.dotColors.length)],
        vx: Math.floor(Math.random() * 50) - 25,
        vy: Math.floor(Math.random() * 50) - 25,
      });
    }
  }

  setCanvas() {
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = this.canvasWrapper.nativeElement.offsetWidth;
    this.canvas.height = this.canvasWrapper.nativeElement.offsetHeight + 100;
  }

  distance(point1: any, point2: any) {
    var xs = 0;
    var ys = 0;

    xs = point2.x - point1.x;
    xs = xs * xs;

    ys = point2.y - point1.y;
    ys = ys * ys;

    return Math.sqrt(xs + ys);
  }

  update() {
    for (var i = 0, x = this.dots.length; i < x; i++) {
      var dot = this.dots[i];

      dot.x += dot.vx / this.FPS;
      dot.y += dot.vy / this.FPS;

      if (dot.x - dot.radius < 0 || dot.x + dot.radius > this.canvas.width)
        dot.vx = -dot.vx;
      if (dot.y - dot.radius < 0 || dot.y + dot.radius > this.canvas.height)
        dot.vy = -dot.vy;
    }
  }

  animate = () => {
    this.drawDots();
    this.update();
    requestAnimationFrame(this.animate);
  };

  drawDots = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.beginPath();

    for (var i = 0, x = this.dots.length; i < this.totalDots; i++) {
      var startDot: Dot = this.dots[i];
      this.ctx.moveTo(startDot.x, startDot.y, 0);

      for (var j = 0, x = this.dots.length; j < x; j++) {
        var endDot: Dot = this.dots[j];
        if (this.distance(startDot, endDot) < 200) {
          this.ctx.lineTo(endDot.x, endDot.y, 0);
        }
      }
    }

    this.ctx.lineWidth = 0.2;
    this.ctx.strokeStyle = 'white';
    this.ctx.stroke();

    for (var i = 0, x = this.dots.length; i < x; i++) {
      var dot: Dot = this.dots[i];

      this.ctx.fillStyle = dot.color;
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, dot.radius, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  };
}
