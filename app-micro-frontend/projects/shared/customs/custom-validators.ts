import {ValidationErrors, ValidatorFn, AbstractControl} from '@angular/forms';

export class CustomValidators {

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if control is empty return no error
        return null;
      }

      // test the value of the control against the regexp supplied
      const valid = regex.test(control.value);

      // if true, return no error (no error), else return error passed in the second parameter
      return valid ? null : error;
    };
  }

  static PasswordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    if (password.pristine || confirmPassword.pristine) {
      return null;
    }
    return password && confirmPassword && password.value !== confirmPassword.value ? {misMatch: true} : null;
  }


  static phoneNumberValidator(control: AbstractControl): any {
    const countryCode = control.get('country_code');
    const phone = control.get('phone');
    if (countryCode.value + '' !== '255') {
      return null;
    }
    return {phoneLengthError: true};
  }
}
