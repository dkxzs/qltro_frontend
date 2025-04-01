const formatCurrency = (value) => {
  if (!value) return "";
  const number = value.replace(/\D/g, "");
  return new Intl.NumberFormat("vi-VN").format(number);
};

export { formatCurrency };
