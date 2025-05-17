import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { fadeInOut } from "../../../animations/router-animation";
import { fadeIn } from "../../../animations/basic-animation";
import { User } from "../../../../modules/nest-uaa/store/user-management/user/user.model";
import { ItemDetailWithIcon } from '../../item-detail-with-icon/item-detail-with-icon';
import { LoaderComponent } from '../../loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { JsonPipe } from '@angular/common';
import { NotificationService } from '../../../../services/notification.service';
import { MatBottomSheet, MatBottomSheetConfig } from '@angular/material/bottom-sheet';
import { HttpClient } from '@angular/common/http';
import { UpdateContractRegistrationBoardComponent } from './update-contract-registration-board/update-contract-registration-board.component';


@Component({
  selector: 'app-company-business-lines',
  templateUrl: './company-business-lines.component.html',
  styleUrls: ['./company-business-lines.component.scss'],
  animations: [fadeIn, fadeInOut],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    LoaderComponent,
    JsonPipe,
    ItemDetailWithIcon
],
})
export class CompanyBusinessLinesComponent implements OnInit {

  loading: boolean = true;
  @Input() user: User;
  @Input() tendererUuid: string;
  @Input() businessLineList = [];
  @Output() updateBusinessLines = new EventEmitter<any>();


  constructor(
    private _bottomSheet: MatBottomSheet,
    private notificationService: NotificationService,
    private http: HttpClient
  ) {

    if (this.businessLineList) {
      this.loading = false;
    }
  }

  ngOnInit(): void {
  }

  updateBusinessLineCrb(data, selectedbusinessLine) {
    const config = new MatBottomSheetConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.data = {
      businessLine: data,
      selectedBusinessLine: selectedbusinessLine,
      tenderer: this.user?.tenderer,
    };
    config.panelClass = ['bottom__sheet'];

    this._bottomSheet.open(UpdateContractRegistrationBoardComponent, config).afterDismissed().subscribe(async (refresh) => {

    });
  }

  updateCompanyBusinessLines() {
    this.updateBusinessLines.emit();
  }


}
