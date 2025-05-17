

export class InputSanitizer {

  nameSanitizer(event: KeyboardEvent): void {
    const allowedChars = /^[A-Za-z0-9.' -]+$/;
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value + event.key;

    if (!allowedChars.test(inputValue)) {
      event.preventDefault();
    }
  }


  nameSanitizerRemoveSpaceChangeToUpperCase(event: KeyboardEvent): void {
    const allowedChars = /^[A-Za-z0-9.'-]+$/;  // Allowed characters
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value + event.key;

    // Check if the new input value is allowed
    if (!allowedChars.test(inputValue)) {
      event.preventDefault();  // Prevent invalid input
    } else {
      // Automatically convert input to uppercase and remove spaces
      inputElement.value = inputElement.value.replace(/\s+/g, '').toUpperCase();
    }
  }


  phoneSanitizer(event: KeyboardEvent): void {
    const allowedChars = /^[0-9 ()+]+$/;
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value + event.key;
    const key = event.key;

    if (
      key !== 'Backspace' &&
      key !== 'ArrowLeft' &&
      key !== 'ArrowRight' &&
      !allowedChars.test(inputValue + key)
    ) {
      event.preventDefault();
    }
  }


  decpSanitizer(event: KeyboardEvent): void {
    const allowedChars = /^[A-Za-z0-9.' -!"#%&'()*+,-./:;<=>?[\\]^_{|}~]+$/;
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value + event.key;

    if (!allowedChars.test(inputValue)) {
      event.preventDefault();
    }
  }

  validateWebsiteGlobal(website) {
    // Regular expression pattern to match a valid website URL
    //  
    //  
    //  
    //  
    const urlPattern = /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/\S*)?$/;
    return urlPattern.test(website);
  }

}