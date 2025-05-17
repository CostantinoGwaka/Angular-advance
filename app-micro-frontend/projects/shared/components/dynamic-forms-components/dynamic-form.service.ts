import { Injectable } from '@angular/core';
import { ApolloNamespace } from 'src/app/apollo.config';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';
import { FieldConfig, FieldType, Validator } from './field.interface';
import * as _moment from 'moment';

@Injectable({ providedIn: 'root' })
export class DynamicFormService {

  constructor(private formBuilder: UntypedFormBuilder, private settings: SettingsService) { }
  showWhenObj: { [key: string]: any } = {};
  selectedKeyValue: { [key: string]: any } = {};

  /**
   * Determines the visibility of a field based on conditional expressions.
   *
   * @param field - The field configuration containing the showWhen conditions.
   * @param form - The form group containing the form controls.
   * @param option - Optional parameter to set selected key-value pairs.
   * @returns A boolean indicating whether the field should be visible.
   */
  isVisible(field: FieldConfig, form?: UntypedFormGroup, option?: any): boolean {
    // Update the selected key-value pair if an option is provided
    if (option) {
      this.selectedKeyValue[field.key as string] = option;
    }

    let visible = true;

    // Check if the field has showWhen conditions and a key
    if (field.showWhen && field.key) {
      // Extract conditions enclosed in []
      if (field.showWhen.match(/(?<=\[)[^\][]*(?=])/g)) {
        this.showWhenObj[field.key] = field.showWhen.match(/(?<=\[)[^\][]*(?=])/g); // Get string inside []
      }

      // Check if there are nested conditions
      if (this.showWhenObj[field.key]?.length > 0) {
        // Remove all whitespace from the showWhen string
        const showWhenWithoutSpace = field.showWhen!.replace(/\s/g, '');

        // Extract outer joining logical operators enclosed in ][
        const outerJoiningValues = showWhenWithoutSpace.match(/\](.*?)\[/g) || [];

        // Evaluate each nested condition
        const visibleResults = this.showWhenObj[field.key].map((showWhen: string) =>
          this.checkShowWhen({ ...field, showWhen }, form)
        );

        // Check all conditions combined using the outer joining values
        visible = this.checkAllConditions(outerJoiningValues, visible, visibleResults);
        return visible;
      } else {
        // Evaluate the condition directly if no nested conditions
        visible = this.checkShowWhen(field, form);
      }
    }

    return visible; // Return the final visibility result
  }



  /**
   * Checks the visibility of a field based on conditional expressions.
   *
   * @param field - The field configuration containing the showWhen conditions.
   * @param form - The form group containing the form controls.
   * @returns A boolean indicating whether the field should be visible.
   */
  private checkShowWhen(field: FieldConfig, form: UntypedFormGroup | undefined): boolean {
    let visible = true;
    const conditions: { [key: string]: any } = {};
    const allVisibleResults: boolean[] = []; // Array to store results of individual conditions
    let joiningValues: any[] = []; // Array to store joining logical operators
    let showWhen: string[] = [];

    // Remove all whitespace from the showWhen string
    const showWhenWithoutSpace = field.showWhen!.replace(/\s/g, '');

    // Extract conditions enclosed in {}
    showWhen = showWhenWithoutSpace.match(/({([^}]*)})/g) || [];

    // Extract joining logical operators enclosed in }{
    joiningValues = showWhenWithoutSpace.match(/\}(.*?)\{/g) || [];

    let count = 0;

    // Iterate over each extracted condition
    showWhen.forEach((item: string) => {
      // Extract conditions enclosed in ()
      conditions[count] = item.match(/\((.*?)\)/g);

      // Remove parentheses from the extracted conditions
      conditions[count] = conditions[count].map((el: string) => el.replace('(', '').replace(')', ''));

      // Split the condition string by '.' to handle nested objects
      const conditionObjectArr = conditions[count][0].split('.');
      let controlValue = null;

      // Get the control value from the form or selected key-value pairs
      if (conditionObjectArr.length === 1) {
        controlValue = form?.get(conditionObjectArr[0])?.value;
      } else if (conditionObjectArr.length === 2 && Object.keys(this.selectedKeyValue).length > 0) {
        controlValue = this.selectedKeyValue[conditionObjectArr[0]][conditionObjectArr[1]];
      }

      // Determine the match control value based on the condition
      const matchControlValue: any = (conditions[count][2] === 'true' || conditions[count][2].toLowerCase() === 'true')
        ? true
        : (conditions[count][2] === 'false' || conditions[count][2].toLowerCase() === 'false')
          ? false
          : (conditions[count][2] === 'null' || conditions[count][2].toLowerCase() === 'null')
            ? null
            : conditions[count][2];

      // Check the validity of the condition
      visible = this.isValid(controlValue || null, matchControlValue || null, conditions[count][1]);
      allVisibleResults.push(visible);
      count++;
    });

    // Check all conditions combined using the joining values
    visible = this.checkAllConditions(joiningValues, visible, allVisibleResults);

    return visible; // Return the final visibility result
  }



  /**
   * Evaluates a series of conditions joined by logical operators and returns the overall visibility result.
   *
   * @param joiningValues - An array of strings representing the logical operators.
   * @param visible - The initial visibility state.
   * @param allVisibleResults - An array of boolean values representing the results of individual conditions.
   * @returns A boolean indicating the overall visibility based on the joined conditions.
   */
  private checkAllConditions(joiningValues: any[], visible: boolean, allVisibleResults: boolean[]): boolean {
    let joinValCount = 0; // Counter to track the current position in the allVisibleResults array
    let previousResult = allVisibleResults[joinValCount]; // Initialize the previous result with the first condition result

    // Iterate through the joining values to evaluate the conditions
    joiningValues.forEach((joinValue) => {
      joinValCount++;

      // Check for '&&' logical operator between conditions
      if (joinValue === '}&&{' || joinValue === ']&&[') {
        visible = previousResult && allVisibleResults[joinValCount];
      }
      // Check for '||' logical operator between conditions
      else if (joinValue === '}||{' || joinValue === ']||[') {
        visible = previousResult || allVisibleResults[joinValCount];
      }

      previousResult = visible; // Update the previous result with the current visibility state
    });

    return visible; // Return the final visibility result
  }


  /**
   * Validates a control value against a matching value using a relational operator.
   *
   * @param controlValue - The value of the control to be validated, which can be an array or a single value.
   * @param matchControlValue - The value to compare against.
   * @param relationalOperatorName - The relational operator to use for the comparison ('==', '!=', '>', '<', '>=', '<=').
   * @returns A boolean indicating whether the control value is valid based on the relational operator.
   */
  isValid(controlValue: any[] | any, matchControlValue: any, relationalOperatorName: string): boolean {
    const isMultiple = Array.isArray(controlValue); // Check if the control value is an array
    let isValid = false; // Initialize the validity flag

    switch (relationalOperatorName) {
      case '==':
        // Check if the control value equals the match control value
        isValid = isMultiple ? controlValue.includes(matchControlValue) : controlValue === matchControlValue;
        break;
      case '!=':
        // Check if the control value does not equal the match control value
        isValid = isMultiple ? !controlValue.includes(matchControlValue) : controlValue !== matchControlValue;
        break;
      case '>':
        // Check if the control value is greater than the match control value
        isValid = parseFloat(controlValue) > parseFloat(matchControlValue);
        break;
      case '<':
        // Check if the control value is less than the match control value
        isValid = parseFloat(controlValue) < parseFloat(matchControlValue);
        break;
      case '>=':
        // Check if the control value is greater than or equal to the match control value
        isValid = parseFloat(controlValue) >= parseFloat(matchControlValue);
        break;
      case '<=':
        // Check if the control value is less than or equal to the match control value
        isValid = parseFloat(controlValue) <= parseFloat(matchControlValue);
        break;
      default:
        // Handle unknown relational operators (optional)
        throw new Error(`Unknown relational operator: ${relationalOperatorName}`);
    }

    return isValid; // Return the validity result
  }



  /**
   * Creates a form group with controls based on the provided field configurations and form data.
   *
   * @param fields - An array of field configurations.
   * @param formData - An object containing the initial values for the form controls.
   * @returns A form group with the dynamically created form controls.
   */
  createControl(fields: FieldConfig[], formData: any): UntypedFormGroup {
    const group: { [key: string]: UntypedFormControl } = {};

    fields.forEach((field) => {
      // Skip 'button' type fields as they don't require form control
      if (field.type === FieldType.button) {
        return;
      }

      const key = field.key;

      // Determine the initial value based on formData or field configuration
      let initialValue = formData ? formData[key] : field.value ?? null;

      // Special handling for checkbox fields
      if (field.type === FieldType.checkbox) {
        initialValue = initialValue || false;
      } else {
        // Convert initial value to string or array of strings
        initialValue = initialValue == null
          ? field.multiple ? [] : null
          : Array.isArray(initialValue)
            ? initialValue.map(i => String(i))
            : String(initialValue);
      }
      // Create form control for the field;
      group[key] = new UntypedFormControl(
        { value: initialValue, disabled: field.disabled ?? false },
        this.bindValidations(field.validations ?? [])
      );

      // Additional control for sample attachments
      if (field.type === FieldType.sampleAttachment) {
        const attachmentKey = `${field.key}_attachment`;
        group[attachmentKey] = new UntypedFormControl(
          { value: null, disabled: field.disabled ?? false },
          this.bindValidations(field.validations ?? [])
        );
      }
    });

    // Return the constructed form group
    return new UntypedFormGroup(group);
  }


  bindValidations(validations: any[]) {
    if (validations.length > 0) {
      // Extract validator functions from the validation configuration
      const validList = validations.map(validation => validation.validator);
      // Compose multiple validators into one
      return Validators.compose(validList);
    }
    return null;
  }




  /**
   * Marks all form fields in a form group as touched to trigger validation.
   *
   * @param formGroup - The form group containing the form controls.
   */
  validateAllFormFields(formGroup: UntypedFormGroup): void {
    // Iterate over each control in the form group
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field); // Get the control for the current field
      control?.markAsTouched({ onlySelf: true }); // Mark the control as touched to trigger validation
    });
  }
  /**
   * Handles the form submission, processes the form data, and triggers validation if needed.
   *
   * @param event - The submit event (optional).
   * @param form - The form group containing the form controls (optional).
   * @param fields - The array of field configurations (optional).
   * @returns The processed form data if the form is valid, otherwise triggers validation.
   */
  onSubmit(event?: Event, form?: UntypedFormGroup, fields?: FieldConfig[]): any {
    event?.preventDefault(); // Prevent the default form submission behavior
    event?.stopPropagation(); // Stop the event from propagating further

    if (form) {
      if (form.valid) {
        const data = form.getRawValue(); // Get the raw form data

        // Process the form data based on field types
        fields?.forEach((field) => {
          if (field.type === FieldType.date) {
            // Format the date field using the specified date format
            data[field.key] = this.settings.formatDate(data[field.key], field.dateFormat);
          } else if (field.type === FieldType.input && field.inputType === 'formattedNumber' && data[field.key]) {
            // Remove commas from formatted number fields and convert to float
            data[field.key] = parseFloat(data[field.key].toString().replace(/,/g, ''));
          }
        });

        return data; // Return the processed form data
      } else {
        this.validateAllFormFields(form); // Trigger validation for all form fields if the form is invalid
      }
    }
  }


  updateFieldOption(fields: FieldConfig[], fieldKey: string, property: { [id: string]: any }) {
    return fields?.map(field => {
      if (field.key === fieldKey) {
        return {
          ...field,
          ...property
        }
      } else {
        return {
          ...field
        }
      }
    })
  }


  deepCompareArrays(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
      return false;
    }

    return arr1.every((obj, index) => this.deepCompareObjects(obj, arr2[index]));
  }

  deepCompareObjects(obj1: any, obj2: any): boolean {
    if (obj1 && obj2) {
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) {
        return false;
      }

      return keys1.every(key => {
        const val1 = obj1[key];
        const val2 = obj2[key];

        // Check if values are objects or arrays, and recursively compare them
        if (typeof val1 === 'object' && typeof val2 === 'object') {
          return this.deepCompareObjects(val1, val2);
        } else {
          return val1 === val2;
        }
      });
    }
    return false;

  }

}
