import {Validators} from '@angular/forms';
import {FieldConfig, FieldType} from "../../dynamic-forms-components/field.interface";


export const completeSubtaskFields: FieldConfig[] = [
  {
    type: FieldType.input,
    label: 'Subtask UUID',
    key: 'subTaskUid',
    validations: [
      {
        message: 'This field is required',
        validator: Validators.required,
        name: 'required',
      },
    ],
    visible: false,
    rowClass: 'col12',
  },
  {
    type: FieldType.textarea,
    label: 'Comment',
    key: 'comment',
    validations: [
      {
        message: 'This field is required.',
        validator: Validators.required,
        name: 'required',
      },
    ],
    rowClass: 'col12',
  },
  {
    type: FieldType.button,
    label: 'Assign',
    rowClass: 'col12',
  },
];


