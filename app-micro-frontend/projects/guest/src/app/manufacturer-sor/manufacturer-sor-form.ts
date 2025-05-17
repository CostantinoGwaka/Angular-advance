import { Validators } from '@angular/forms';
import { FieldConfig, FieldType } from 'src/app/shared/components/dynamic-forms-components/field.interface';

export const fields: FieldConfig[] = [
  {
    type: FieldType.select,
    label: 'Decision',
    key: 'decision',
    options: [
      { name: 'Accept', value: 'ACCEPT' },
      { name: 'Reject', value: 'REJECT' },
    ],
    validations: [
      {
        message: 'This field is Required',
        validator: Validators.required,
        name: 'required',
      },
    ],
    rowClass: 'col-span-12 md:col-span-12',
  },
  {
    type: FieldType.textarea,
    label: 'Comment',
    showWhen: '{(decision)(==)(REJECT)}',
    key: 'comment',
    validations: [],
    rowClass: 'col-span-12 md:col-span-12',
  },

  {
    type: FieldType.button,
    label: 'Submit',
    rowClass: 'col12',
  },
];
