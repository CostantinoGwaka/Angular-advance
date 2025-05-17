import { AttachmentService } from '../../../services/attachment.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dowload',
  templateUrl: './dowload.component.html',
  standalone: true,
  imports: [MatProgressSpinnerModule],
})
export class DowloadComponent implements OnInit {
  file_uuid: string;
  loading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private attachmentService: AttachmentService
  ) {
    this.route.url.subscribe((params) => {
      const route = this.router.url.split('/');
      this.file_uuid = route[3];
    });
  }

  ngOnInit(): void {
    this.init();
  }

  async init() {
    this.loading = true;
    await this.attachmentService.fetchAttachment(this.file_uuid, 'pdf');
    this.loading = false;
  }
}
