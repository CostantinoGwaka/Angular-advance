import {Validators} from '@angular/forms';
import {FieldConfig, FieldType} from "../../dynamic-forms-components/field.interface";


export const assignSubordinateFields: FieldConfig[] = [
  {
    type: FieldType.input,
    label: 'Model UUID',
    key: 'modelUid',
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
    type: FieldType.select,
    label: 'Choose Subordinate to assign this task.',
    key: 'assigneeId',
    options: [],
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
    type: FieldType.textarea,
    label: 'Instructions',
    key: 'instructions',
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

