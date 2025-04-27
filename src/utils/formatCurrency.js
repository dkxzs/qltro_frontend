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

function numberToText(num) {
  const CHU_SO = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const TIENTE = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ", "tỷ tỷ"];

  if (num === 0) return "Không đồng";
  if (typeof num !== "number" || num < 0) return "";

  let result = "";
  let i = 0;

  while (num > 0) {
    const block = num % 1000;
    if (block !== 0) {
      result = `${readThreeDigits(block)} ${TIENTE[i]} ${result}`.trim();
    }
    num = Math.floor(num / 1000);
    i++;
  }

  return result.replace(/\s+/g, " ").trim() + " đồng";
}

function readThreeDigits(number) {
  const CHU_SO = [
    "không",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];

  let str = "";
  const hundreds = Math.floor(number / 100);
  const tensUnits = number % 100;
  const tens = Math.floor(tensUnits / 10);
  const units = tensUnits % 10;

  // Hàng trăm
  if (hundreds > 0) {
    str += `${CHU_SO[hundreds]} trăm`;
    if (tens === 0 && units > 0) str += " lẻ";
  }

  // Hàng chục và đơn vị
  if (tens > 1) {
    str += ` ${CHU_SO[tens]} mươi`;
    if (units === 1) str += " mốt";
    else if (units === 5) str += " lăm";
    else if (units > 1) str += ` ${CHU_SO[units]}`;
  } else if (tens === 1) {
    str += " mười";
    if (units > 0) {
      if (units === 5) str += " lăm";
      else str += ` ${CHU_SO[units]}`;
    }
  } else if (tens === 0 && units > 0) {
    str += ` ${CHU_SO[units]}`;
  }

  return str.trim();
}

export { formatCurrency, numberToText };
