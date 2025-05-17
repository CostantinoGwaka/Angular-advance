import { NotificationService } from '../../../services/notification.service';
import { computed, effect, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  BlockingProgressDialogData,
  BlockingProgressLoaderComponent,
} from '../blocking-progress-loader/blocking-progress-loader.component';
import { BehaviorSubject } from 'rxjs';
import { BlockingProgressLoaderService } from '../blocking-progress-loader/blockin-progress-loader.service';
import { ItemsToShow } from './vertical-steps-form.component';

export type VerticalStepsFormStatus =
  | 'saving'
  | 'saved'
  | 'pending'
  | 'failed'
  | 'ready';

export interface UpdatedFormItem {
  itemUuid: string;
  label: string;
  status: VerticalStepsFormStatus;
  message?: string;
  value?: any;
}

export interface SaveFunctionResult {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class VerticalStepsFormService {
  dialogData: BlockingProgressDialogData;
  private dataSources = new Map<
    string,
    BehaviorSubject<BlockingProgressDialogData>
  >();

  itemToGoTo: ItemsToShow = null;

  updatedItems = signal<UpdatedFormItem[]>([]);
  errorMessage = signal<string>('');
  //unfilledItems = signal<UpdatedFormItem[]>([]);
  fillableItems = signal<string[]>([]);
  savedItems = signal<UpdatedFormItem[]>([]);

  failedItemsCount = computed(() => {
    return this.updatedItems().filter((i) => i.status === 'failed').length;
  });

  unfilledItems = computed(() => {
    return this.updatedItems().filter(
      (i) =>
        i.value === undefined ||
        i.value === '' ||
        i.value === null ||
        i?.value?.length === 0
    );
  });

  unsavedItems = computed(() => {
    return this.updatedItems().filter((i) => i.status != 'saved');
  });

  savedItemsPercent = computed(() => {
    const savedItems = this.updatedItems().filter((i) => i.status === 'saved');

    return parseInt(
      ((savedItems.length / this.updatedItems().length) * 100)
        .toString()
        .split('.')[0]
    );
  });
  saveInterval: any = null;

  constructor(
    private dialog: MatDialog,
    private notificationService: NotificationService,
    private blockingProgressLoaderService: BlockingProgressLoaderService
  ) {
    effect(() => {});
  }

  ngOnDestroy() {
    clearInterval(this.saveInterval);
  }

  finisWithFail(item: any, onSaveFailedFunction: any, errorMessage: string) {
    this.errorMessage.set(errorMessage);

    this.closeSavingDialog();
    clearInterval(this.saveInterval);
    if (onSaveFailedFunction) {
      onSaveFailedFunction();
      this.closeSavingDialog();
    }
  }

  updateItemsList(items: UpdatedFormItem[]) {
    this.updatedItems.update((prev) => {
      return prev.filter((i) =>
        items.some((item) => item.itemUuid === i.itemUuid)
      );
    });

    items.forEach((item) => {
      if (!this.updatedItems().some((i) => i.itemUuid === item.itemUuid)) {
        this.updatedItems.update((prev) => {
          return [
            ...prev,
            {
              itemUuid: item.itemUuid,
              label: item.label,
              value: item.value,
              status: item.status,
            },
          ];
        });
      } else {
        const itemToUpdate: UpdatedFormItem = {
          itemUuid: item.itemUuid,
          label: item.label,
          value: item.value,
          status: item.status,
        };

        this.updatedItems.update((prev) => {
          return prev.map((item) => {
            if (item.itemUuid === itemToUpdate.itemUuid) {
              return {
                ...item,
                ...itemToUpdate,
              };
            }
            return item;
          });
        });
      }
    });
  }

  initiateItems(items: UpdatedFormItem[]) {
    this.updatedItems.set(items);
  }

  showSavingDialog() {
    this.dialogData = {
      dialogId: 'savingFormItems',
      allowCancel: false,
      title: 'Saving data',
      message: 'Please wait...',
      progress: 0,
      failed: false,
    };
    this.dialog.open(BlockingProgressLoaderComponent, {
      disableClose: true,
      data: this.dialogData,
      width: '500px',
    });
  }

  updateProgressData(dialogId: string, data: BlockingProgressDialogData) {
    this.blockingProgressLoaderService.progress.set(data.progress);
  }
  init() {
    this.itemToGoTo = null;
    this.updatedItems.set([]);
    this.errorMessage.set('');
    this.fillableItems.set([]);
    this.savedItems.set([]);
  }

  addItemToSave(
    itemUuid: string,
    value: any,
    label: string,
    status: VerticalStepsFormStatus = 'pending'
  ) {
    if (!this.updatedItems().some((i) => i.itemUuid === itemUuid)) {
      this.updatedItems.update((prev) => {
        return [
          ...prev,
          {
            itemUuid,
            value,
            label,
            status,
          },
        ];
      });
    } else {
      this.updatedItems.update((prev) => {
        return prev.map((i) => {
          if (i.itemUuid === itemUuid) {
            return {
              ...i,
              status: status,
              value: value,
            };
          }
          return i;
        });
      });
    }
  }

  updateItem(
    itemUuid: string,
    status: VerticalStepsFormStatus,
    message?: string
  ) {
    this.updatedItems.update((prev) => {
      return prev.map((i) => {
        if (i.itemUuid === itemUuid) {
          return {
            ...i,
            status,
            message,
          };
        }
        return i;
      });
    });
  }

  setItemSaved(item: string) {
    this.updateItem(item, 'saved');
  }

  setItemSaving(item: string) {
    this.updateItem(item, 'saving');
  }

  setItemAsFailed(item: string, message: string) {
    this.updateItem(item, 'failed', message);
  }

  async saveItems(
    dataToSave: {
      formValue: any;
      isFormComplete: boolean;
      step: any;
    },
    saveFunction: (payload: any) => Promise<SaveFunctionResult>,
    onSaveSuccessFunction?: () => void,
    onSaveFailedFunction?: () => void
  ) {
    this.blockingProgressLoaderService.progress.set(0);
    this.updatedItems().forEach((i) => {
      if (i.status === 'failed') {
        this.updateItem(i.itemUuid, 'pending');
      }
    });

    let pendingItems = this.updatedItems().filter(
      (i) => i.status === 'pending'
    );
    this.errorMessage.set('');
    let processedItemsCount = 0;
    let totalPendingItems = pendingItems.length;

    if (pendingItems.length > 0) {
      this.showSavingDialog();
      this.saveInterval = setInterval(async () => {
        let item = pendingItems.shift();
        processedItemsCount++;

        if (!item) {
          clearInterval(this.saveInterval);
          this.doAfterSaveFinished(onSaveSuccessFunction, onSaveFailedFunction);
          return;
        }
        let _dataToSave = { ...item };

        delete _dataToSave.itemUuid;

        _dataToSave[item.label] = item.value;

        let payload = {
          ..._dataToSave,
          isFormComplete: dataToSave.isFormComplete,
          step: dataToSave.step,
        };

        this.setItemSaving(item.itemUuid);
        try {
          const result = await saveFunction(payload);
          if (result.success) {
            this.setItemSaved(item.itemUuid);
            this.updatedSavedItemsDialogProgress(
              totalPendingItems,
              processedItemsCount
            );
          } else {
            this.setItemAsFailed(item.itemUuid, result.message);
            let errorMessage = `An error occurred while saving one of the items, please try again`;
            this.finisWithFail(item, onSaveFailedFunction, errorMessage);
          }
        } catch (e) {
          console.error(e);
          this.setItemAsFailed(item.itemUuid, 'Unknown Error while saving');
          let errorMessage = `An unknown error occurred while saving one of the items, please try again`;
          this.finisWithFail(item, onSaveFailedFunction, errorMessage);
        }
      }, 500);
    } else {
      onSaveSuccessFunction();
    }
  }

  updatedSavedItemsDialogProgress(totalItems: number, savedItems: number) {
    if (this.dialogData?.dialogId) {
      let progress = parseInt(((savedItems / totalItems) * 100).toString());

      this.updateProgressData(this.dialogData.dialogId, {
        ...this.dialogData,
        progress,
      });
    }
  }

  doAfterSaveFinished(
    onSaveSuccessFunction?: () => void,
    onSaveFailedFunction?: () => void
  ) {
    this.closeSavingDialog();

    if (this.failedItemsCount() > 0) {
      if (onSaveFailedFunction) {
        onSaveFailedFunction();
      }
    } else {
      if (onSaveSuccessFunction) {
        onSaveSuccessFunction();
      }
    }
  }

  closeSavingDialog() {
    this.dialogData = null;
    this.dialog.closeAll();
  }
}
