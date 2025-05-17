import { Injectable } from '@angular/core';
import { ApolloNamespace } from '../apollo.config';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from '../shared/components/delete-confirmation/delete-confirmation.component';
import { CustomAlertBoxModel } from '../shared/components/custom-alert-box/custom-alert-box.model';
import { CustomAlertBoxDialogComponent } from '../shared/components/custom-alert-box-dialog/custom-alert-box-dialog.component';
import {
  FrameworkLot,
  FrameworkMain,
} from '../modules/nest-framework-agreement/framework.model';
import { GET_BILLING_GLOBAL_SETTING_BY_KEY } from '../modules/nest-billing/store/billing-global-setting/billing-global-setting.graphql';
import { GraphqlService } from './graphql.service';
import { GET_GLOBAL_SETTING_BY_SETTING_KEY } from '../modules/nest-settings/store/global-settings/global-settings.graphql';
import { PaymentCode } from '../modules/nest-billing/store/billing-settings/payment-code/payment-code.model';
import { FIND_PAYMENT_CODE_BY_SYSTEM_CODE } from '../modules/nest-billing/store/billing-settings/payment-code/payment-code.graphql';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  constructor(
    public dialog: MatDialog,
    public graphqlService: GraphqlService,
    private http: HttpClient,
  ) { }
  async confirmation(data: ConfirmationData): Promise<any> {
    const config = new MatDialogConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.data = {
      uuid: data?.uuid,
      title: data?.title,
      message: data?.message,
      showTextInputField: data?.showTextInputField,
      textInputFieldPlaceholder: data?.textInputFieldPlaceholder,
      confirmInputValue: data?.confirmInputValue,
      textColor: data?.textColor,
      confirmText: data?.confirmText,
      cancelText: data?.cancelText,
      saveColor: data?.saveColor,
    };
    config.panelClass = ['bottom__sheet', 'w-50'];
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, config);

    return await lastValueFrom(dialogRef.afterClosed());
  }

  frameworkToTender(item: FrameworkLot) {
    return {
      uuid: item?.frameworkMain?.uuid,
      id: item?.frameworkMain?.id,
      tender: {
        descriptionOfTheProcurement: item?.frameworkMain?.description,
        estimatedBudget: 'N/A',
        invitationDate: item?.frameworkMain?.invitationDate,
        procurementCategoryAcronym: item?.frameworkMain?.tenderCategoryAcronym,
        tenderNumber: item?.frameworkMain?.frameworkNumber,
        tenderSubCategoryAcronym: item?.frameworkMain?.tenderSubCategoryAcronym,
        uuid: item?.frameworkMain?.uuid,
      },
    };
  }

  async customAlertBoxDialog(data: CustomAlertDialogData): Promise<any> {
    const config = new MatDialogConfig();
    config.autoFocus = 'dialog';
    config.closeOnNavigation = false;
    config.data = {
      alertInfo: data?.alertInfo,
      alertClass: data?.alertClass ?? 'border-blue-300 bg-blue-50',
      alertTextClass: data?.alertTextClass ?? 'text-black-50',
      loading: data?.loading ?? false,
      alertButtonClass:
        data?.alertButtonClass ??
        'border-primary !bg-primary hover:bg-indigo-700 text-white',
    };
    config.panelClass = ['w-50'];
    const dialogRef = this.dialog.open(CustomAlertBoxDialogComponent, config);
    return await lastValueFrom(dialogRef.afterClosed());
  }

  numberToWords(number) {
    const units = [
      '',
      'One',
      'Two',
      'Three',
      'Four',
      'Five',
      'Six',
      'Seven',
      'Eight',
      'Nine',
      'Ten',
      'Eleven',
      'Twelve',
    ];
    const teens = [
      'Thirteen',
      'Fourteen',
      'Fifteen',
      'Sixteen',
      'Seventeen',
      'Eighteen',
      'Nineteen',
    ];
    const tens = [
      '',
      '',
      'Twenty',
      'Thirty',
      'Forty',
      'Fifty',
      'Sixty',
      'Seventy',
      'Eighty',
      'Ninety',
    ];
    const unitsGroup = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];

    // Function to convert a two-digit number into words
    function convertTwoDigitNumber(num) {
      if (num < 13) {
        return units[num];
      } else if (num < 20) {
        return teens[num - 13];
      } else {
        const ten = Math.floor(num / 10);
        const unit = num % 10;
        return tens[ten] + (unit !== 0 ? '-' + units[unit] : '');
      }
    }

    // Function to convert a number less than 1000 into words
    function convertLessThanThousand(num) {
      if (num < 100) {
        return convertTwoDigitNumber(num);
      } else {
        const hundred = Math.floor(num / 100);
        const remainder = num % 100;
        return units[hundred] + ' Hundred ' + convertTwoDigitNumber(remainder);
      }
    }

    // Check if the number is within the supported range
    if (number < 0 || number > 999999999999.99) {
      return 'Number out of range';
    }

    let integerPart = Math.floor(number);
    const decimalPart = parseFloat(number + '')
      .toFixed(2)
      .slice(-2);

    let words = '';

    if (integerPart === 0) {
      words = 'Zero';
    } else {
      const groups = [];

      // Divide the integer part into groups of thousands
      while (integerPart > 0) {
        groups.push(integerPart % 1000);
        integerPart = Math.floor(integerPart / 1000);
      }

      const numGroups = groups.length;

      for (let i = numGroups - 1; i >= 0; i--) {
        const group = groups[i];

        if (group !== 0) {
          words += convertLessThanThousand(group) + ' ' + unitsGroup[i] + ' ';
        }
      }
    }

    if (decimalPart !== '00') {
      words += 'and ' + convertTwoDigitNumber(parseInt(decimalPart)) + ' Cents';
    }

    return words.trim();
  }

  // billing general.

  async getBillingStatus(): Promise<{
    billingStatus: boolean;
    failedToGetBillingStatus: boolean;
  }> {
    try {
      // const result: any = await this.graphqlService.fetchData({
      //   query: GET_GLOBAL_SETTING_BY_SETTING_KEY,
      //   apolloNamespace: ApolloNamespace.uaa,
      //   variables: { settingKey: 'ALLOW_BILLING' },
      // });

      // if (result.data.findGlobalSettingByKey.code === 9000) {
      //   const billingSettingsData = result.data.findGlobalSettingByKey.data;
      // const data: any = await firstValueFrom(
      //   this.http.get<any>(
      //     environment.AUTH_URL + `/nest-cache/settings/by/key/ALLOW_BILLING`
      //   )
      // );
      //
      // const billingSettingsData = data?.value;

      const billingSettingsData = environment.ALLOW_BILLING_SERVICE;
      return {
        billingStatus: billingSettingsData,
        failedToGetBillingStatus: false,
      };
    } catch (e) {
      return {
        billingStatus: false,
        failedToGetBillingStatus: true,
      };
    }
  }

  async getDenyServiceForPendingBills(): Promise<{
    denyServiceForPendingBills: boolean;
    failedToGetDenyServiceForPendingBillsStatus: boolean;
  }> {
    try {
      const result: any = await this.graphqlService.fetchData({
        apolloNamespace: ApolloNamespace.billing,
        query: GET_BILLING_GLOBAL_SETTING_BY_KEY,
        variables: { key: 'DENY_SERVICE_FOR_PENDING_BILLS' },
      });

      if (result.data.findBillingGlobalSettingByKey.code === 9000) {
        const billingGlobalSetting =
          result.data.findBillingGlobalSettingByKey.data;
        return {
          denyServiceForPendingBills: billingGlobalSetting.value === 'ON',
          failedToGetDenyServiceForPendingBillsStatus: false,
        };
      } else {
        return {
          denyServiceForPendingBills: false,
          failedToGetDenyServiceForPendingBillsStatus: true,
        };
      }
    } catch (e) {
      return {
        denyServiceForPendingBills: false,
        failedToGetDenyServiceForPendingBillsStatus: true,
      };
    }
  }

  async getPaymentCodeByServiceCode(serviceCode: string): Promise<PaymentCode> {
    try {
      const result: any = await this.graphqlService.fetchData({
        apolloNamespace: ApolloNamespace.billing,
        query: FIND_PAYMENT_CODE_BY_SYSTEM_CODE,
        variables: { systemPaymentCode: serviceCode },
      });

      if (result.data.findPaymentCodeBySystemCode.code === 9000) {
        return result.data.findPaymentCodeBySystemCode.data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

export interface ConfirmationData {
  uuid: string;
  title: string;
  message: string;
  showTextInputField: boolean;
  textInputFieldPlaceholder?: string;
  confirmInputValue?: string;
  textColor?: string;
  confirmText?: string;
  cancelText?: string;
  saveColor?: string;
}

export interface CustomAlertDialogData {
  alertInfo: CustomAlertBoxModel;
  alertClass?: string;
  alertTextClass?: string;
  loading?: boolean;
  alertButtonClass?: string;
  permissions?: string[];
}

///Volumes/SERVER/works/programming/angular/nest-frontend-ui-kit/src/app/services/ge
