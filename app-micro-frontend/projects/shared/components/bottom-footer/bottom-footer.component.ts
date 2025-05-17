import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { Menu } from "../../../store/global-interfaces/organizationHiarachy";

@Component({
    selector: 'app-bottom-footer',
    templateUrl: './bottom-footer.component.html',
    styleUrls: ['./bottom-footer.component.scss'],
    standalone: true
})
export class BottomFooterComponent implements OnInit {

  @Input() sidebarMenu: Menu;

  constructor() { }

  ngOnInit(): void {

  }
}
