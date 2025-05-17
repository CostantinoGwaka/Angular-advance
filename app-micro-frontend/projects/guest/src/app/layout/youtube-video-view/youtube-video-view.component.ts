import { fadeIn, ROUTE_ANIMATIONS_ELEMENTS } from 'src/app/shared/animations/router-animation';
import { Component, Inject, OnInit, HostListener } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from '@angular/material/button';

declare var YT: any;
@Component({
    selector: 'app-youtube-video-view',
    templateUrl: './youtube-video-view.component.html',
    styleUrls: ['./youtube-video-view.component.scss'],
    animations: [fadeIn],
    standalone: true,
    imports: [MatButtonModule]
})
export class YoutubeVideoViewComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  player: any;
  loading: boolean = true;
  message: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) data,
    private _dialogRef:
      MatDialogRef<YoutubeVideoViewComponent>
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    try {
      setTimeout(() => {
        this.loadPlayer();
        this.loading = false;
      }, 3000);
    } catch (e) {
      this.message = "Something went wrong. Please close and reopen again"
    }

  }

  loadPlayer() {
    this.player = new YT.Player('player', {
      height: '450',
      width: '640',
      videoId: 'zhNaeWnwFH4',
      playerVars: {
        'autoplay': 0,
        'controls': 1,
        'rel': 0,
        'fs': 0,
      },
      events: {
        onReady: (event) => {
          event.target.playVideo();
        }
      }
    });

    // Add context menu event listener to the player element
    const playerElement = document.getElementById('player');
    playerElement.addEventListener('contextmenu', this.onContextMenu.bind(this));
  }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: Event): boolean {
    event.preventDefault(); // Prevent the default context menu behavior
    event.stopPropagation(); // Stop the event from bubbling up
    return false; // Prevent any additional default actions
  }


  closeModal() {
    this._dialogRef.close()
  }
}
