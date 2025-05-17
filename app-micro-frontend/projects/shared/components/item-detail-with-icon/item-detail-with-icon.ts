import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { fadeIn } from "../../animations/basic-animation";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';


@Component({
    selector: 'app-item-detail-with-icon',
    templateUrl: './item-detail-with-icon.html',
    styleUrls: ['./item-detail-with-icon.scss'],
    animations: [fadeIn],
    standalone: true,
    imports: [MatIconModule, MatProgressSpinnerModule]
})
export class ItemDetailWithIcon implements OnInit {

  @Input() label: string;
  @Input() title: string;
  @Input() icon: string; // material icon only
  @Input() imageLink: string; // local icon images
  @Input() loading: boolean = false;
  @Input() titleClass: string = '';
  @Input() labelClass: string = '';
  @Input() iconClass: string = '';

  constructor() { }

  ngOnInit(): void { }
}
