import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nest-custom-loader',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './nest-custom-loader.component.html',
  styleUrl: './nest-custom-loader.component.scss'
})
export class NestCustomLoaderComponent {
  @Input() show = false;
}
