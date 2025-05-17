import { Component, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-under-maintenance',
    templateUrl: './under-maintenance.component.html',
    styleUrls: ['./under-maintenance.component.scss'],
    standalone: true,
    imports: [MatIconModule]
})
export class UnderMaintenanceComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
