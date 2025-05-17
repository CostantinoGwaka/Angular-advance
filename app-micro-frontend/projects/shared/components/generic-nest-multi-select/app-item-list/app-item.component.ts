import {Component, Input} from '@angular/core';
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './app-item.component.html',
  styleUrl: './app-item.component.scss'
})
export class ItemComponent {
@Input() item:any;
}
