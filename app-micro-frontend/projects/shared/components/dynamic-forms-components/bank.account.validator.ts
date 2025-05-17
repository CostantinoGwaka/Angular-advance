import { UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';
export class BankAccountValidator {

    /** Start Number Validation
     *
     * check for valid number ::: CustomValidators.number()
     * check for valid number and min value :: CustomValidators.number({min: 0})
     *  check for valid number and max value :: CustomValidators.number({max: 20})
     * check for valid number and value range ie: [0-20] ::  CustomValidators.number({min: 0, max: 20})
     *
     */
    static string(prms: { min?: number, max?: number } = {}): (control: UntypedFormControl) => { [key: string]: string } {
        const obj = {};
        // obj['number'] = true;
        return (control: UntypedFormControl): { [key: string]: string } => {

            // if (isPresent(Validators.required(control))) {
            //   return null;
            // }

            let hasSpace: boolean = false;
            if (/\s/.test(control.value)) {
                hasSpace = true;
            }
            const strLen = control.value.length;

            if (prms.min && !isNaN(prms.min) && prms.max && !isNaN(prms.max) && !hasSpace) {

                return strLen < prms.min || strLen > prms.max ? obj : {};
            }
            else if (prms.min && !isNaN(prms.min) && !hasSpace) {

                return strLen < prms.min ? obj : {};
            } else if (prms.max && !isNaN(prms.max) && !hasSpace) {

                return strLen > prms.max ? obj : {};
            } else {

                return {};
            }
        };
    }

}
