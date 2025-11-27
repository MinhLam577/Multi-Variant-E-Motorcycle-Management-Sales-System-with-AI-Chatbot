const regexEmpty = /([^\s])/;
const regexSubjectMaxLength = /^(?=.{0,255}$).*$/;
const regexCompanyMaxLength = regexSubjectMaxLength;
const regexName = /^[a-z0-9_.]+$/;
const regexFullName =
    /^[a-zA-ZàáảãạÀÁẢÃẠăằắẳẵặĂẰẮẲẴẶâầấẩẫậÂẦẤẨẪẬèéẻẽẹÈÉẺẼẸêềếểễệỀẾÊỂỄỆìíỉĩịÌÍỈĨỊòóỏõọÒÓỎÕỌôồốổỗộÔỒỐỔỖỘơờớởỡợƠỜỚỞỠỢùúủũụÙÚỦŨỤưừứửữựƯỪỨỬỮỰỳýỷỹỵỲÝỶỸỴđĐ]+(\s+[a-zA-ZàáảãạÀÁẢÃẠăằắẳẵặĂẰẮẲẴẶâầấẩẫậÂẦẤẨẪẬèéẻẽẹÈÉẺẼẸêềếểễệỀẾÊỂỄỆìíỉĩịÌÍỈĨỊòóỏõọÒÓỎÕỌôồốổỗộÔỒỐỔỖỘơờớởỡợƠỜỚỞỠỢùúủũụÙÚỦŨỤưừứửữựƯỪỨỬỮỰỳýỷỹỵỲÝỶỸỴđĐ]+)*$/;
const regexPhone =
    /0((3[2-9])|(5[2689])|(7[06789])|(8[12345689])|(9[012346789]))\d{7}/;
const regexPassWord = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d#@$!%*?&]{6,}$/;
const regexPassport = /^(?!^0+$)[a-zA-Z0-9]{8,10}$/;
const regexIdNumber = /^(\d{9}|\d{12}|([A-Za-z]{1, 3}\d{7, 9}))$/;
const regexColor = /^#[0-9A-Fa-f]{6}$/;
const regexNationalID = "([\\d]{9}|[\\d]{12}|([a-zA-Z]{2,6}\\d{2,6}))";
const regexUnsignedInteger = /^\+?(0|[1-9]\d*)$/;
const regexEmail =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regexUsername = /^.{3,30}$/; // 3-30 ký tự
export {
    regexUnsignedInteger,
    regexNationalID,
    regexColor,
    regexIdNumber,
    regexPassport,
    regexPassWord,
    regexPhone,
    regexFullName,
    regexName,
    regexCompanyMaxLength,
    regexSubjectMaxLength,
    regexEmpty,
    regexEmail,
    regexUsername,
};
