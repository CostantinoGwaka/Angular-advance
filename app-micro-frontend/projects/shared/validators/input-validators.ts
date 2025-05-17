import { environment } from "src/environments/environment";
let emailValidatorGovernmentStaff: string;
export const onlyTextInputValidator = '^[a-zA-Z.,][a-zA-Z0-9.,-s ]*$';
export const onlyNumberInputValidator = '^[0-9]+$';
// export const domainNameValidator = '/^https?:\/\/(www\.)?(\w+)(\.\w.*)|(\w+.\w+.\w+)$/';
export const domainNameValidator = '^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$';
// export const domainNameValidator = '((?:(?:http?|ftp)[s]*:\\/\\/)?[a-z0-9-%\\/\\&=?\\.]+\\.[a-z]{2,4}\\/?([^\\s<>\\#%"\\,\\{\\}\\\\|\\\\\\^\\[\\]`]+)?)';
export const phoneNumberValidatorOffice = '(255|0)([0-9]{9,13})$';
export const phoneNumberValidator = '(255)([0-9]{9})$';
// export const phoneNumberValidator = '(255|0)([0-9]{9})$';
export const phoneNumberValidatorWithPrefix = '[^0123459][0-9]{8}';
export const noSpaceRegex = /^[^\s]+$/;
export const noNumberRegex = /^[^\d]+$/;
export const simpleEmailValidator = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
export const emailValidator = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2})?$';
// export const emailValidator = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\.[a-zA-Z]{2,}$';
if (environment.EMAIL_CHECKER) {
    emailValidatorGovernmentStaff = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.([a-z]{2,}\.)?tz$';
} else {
    // emailValidatorGovernmentStaff = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\.[a-zA-Z]{2,}$';
    emailValidatorGovernmentStaff = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\.[a-z]{2,}$';
}
export const emailValidatorLowerLevel = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\.[a-z]{2,}$';
export { emailValidatorGovernmentStaff };
export const ipAddressValidator = '/^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$/';
/// TODO domainNameValidator re-test pending

