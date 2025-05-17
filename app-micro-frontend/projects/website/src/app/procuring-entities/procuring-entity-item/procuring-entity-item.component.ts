import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { AttachmentService } from '../../../services/attachment.service';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';


export interface ProcuringEntityLite {
  uuid: string;
  name: string;
  acronym: string;
  nameSW: string;
  phone: string;
  logoUuid: string;
  website: string;
  email: string;
  parentMinistry: ProcuringEntityLite;
  postalAddress: string;
  physicalAddress: string;
  region?: any;
}

@Component({
  selector: 'procuring-entity-item',
  templateUrl: './procuring-entity-item.component.html',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule
],
})
export class ProcuringEntityItemComponent implements OnInit {
  @Input()
  pe: ProcuringEntityLite;

  peLogo: string = null;
  loadingLogo: boolean = false;
  @Input() showRegion: boolean = false;

  constructor(private attachmentService: AttachmentService) { }

  ngOnInit(): void {
    this.getPELogo(this.pe.logoUuid).then();
  }

  async getPELogo(logoUuid: string) {
    let logo = null;
    if (logoUuid) {
      this.loadingLogo = true;
      logo = await this.attachmentService.getPELogo(logoUuid);
      if (logo) {
        this.peLogo = logo;
      }
    }
    if (!logo) {
      this.peLogo = '/assets/images/emblen.png';
    }
    this.loadingLogo = false;
  }

  setWebsiteAddress(website: string) {
    if (website.startsWith('http')) {
      return website;
    } else {
      return 'https://' + website;
    }
  }
}
