/*
import {FormControl, ValidatorFn, Validators} from "@angular/forms";

export class NumberValidator {

  static number(prms = {}): ValidatorFn {
    return (control: FormControl): {[key: string]: any} => {
      if(isPresent(Validators.required(control))) {
        return null;
      }

      let val: number = control.value;

      if(isNaN(val) || /\D/.test(val.toString())) {

        return {"number": true};
      } else if(!isNaN(prms.min) && !isNaN(prms.max)) {

        return val < prms.min || val > prms.max ? {"number": true} : null;
      } else if(!isNaN(prms.min)) {

        return val < prms.min ? {"number": true} : null;
      } else if(!isNaN(prms.max)) {

        return val > prms.max ? {"number": true} : null;
      } else {

        return null;
      }
    };
  }
}
*/
