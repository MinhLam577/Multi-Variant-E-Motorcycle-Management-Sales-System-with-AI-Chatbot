import numbro from 'numbro';

export const generateFileName = (fileName) => {
  const fileExtensions = fileName.split('.');
  const fileType = '.' + fileExtensions[fileExtensions.length - 1];
  const _fileName = fileName.split(fileType)[0];
  return _fileName.replace(/[^a-zA-Z0-9]/g, '_') + fileType;
};

export const sleepFuntions = async (time) => {
  return new Promise((resolve) =>
    setTimeout(
      () => { resolve('result') },
      time
    )
  );
};

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const formatVNDMoney = (value, option = {}) => {
  if (!value) {
    return 0;
  }
  return numbro(value).format({
    mantissa: 0,
    thousandSeparated: true,
    average: false,
    ...option,
  });
}

export const convertSortFromAntToServer = (value) => {
  if (value === 'ascend') {
    return 'asc';
  }

  return 'desc';
}

