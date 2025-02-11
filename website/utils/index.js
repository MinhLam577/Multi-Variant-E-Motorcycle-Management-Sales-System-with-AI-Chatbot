export const toCurrency = (value, currency = "VND", locale = "vi-VN") => {
  if (!value) return "Báo giá";
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
  return formatter.format(value);
};

export const toMileage = (value) => {
  return value;
};
