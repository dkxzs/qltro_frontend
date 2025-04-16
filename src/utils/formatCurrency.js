const formatCurrency = (value) => {
  if (!value && value !== 0) return "";
  let number;
  if (typeof value === "string") {
    number = value.replace(/\D/g, "");
  } else {
    number = value;
  }
  return new Intl.NumberFormat("vi-VN").format(number);
};

export { formatCurrency };
