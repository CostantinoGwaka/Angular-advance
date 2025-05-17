import {Component, Input} from '@angular/core';
import {Advertisement} from "../../../../modules/nest-settings/store/advertisements/advertisements.model";

@Component({
  selector: 'app-video-advertisement',
  standalone: true,
  imports: [],
  templateUrl: './video-advertisement.component.html',
  styleUrl: './video-advertisement.component.scss'
})
export class VideoAdvertisementComponent {
  @Input()
  sampleAdvertisement: Advertisement;
  constructor() { }

  ngOnInit(): void {

  }

  goToVideoLink() {
    window.open(this.sampleAdvertisement?.videoUrl, '_blank');
  }
}
