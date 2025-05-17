import { Component, Input, OnInit } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { WorkflowTaskAdvice } from "../../../../store/work-flow/work-flow-interfaces";
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-advices-viewer',
    templateUrl: './advices-viewer.component.html',
    styleUrls: ['./advices-viewer.component.scss'],
    standalone: true,
    imports: [DatePipe]
})
export class AdvicesViewerComponent implements OnInit {

  @Input() advices: WorkflowTaskAdvice[] = []

  constructor() { }

  ngOnInit(): void {
  }

}
