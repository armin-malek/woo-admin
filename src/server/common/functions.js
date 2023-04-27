import Hashids from "hashids";
const hashids = new Hashids(process.env.NEXT_PUBLIC_HASHID_SALT, 16);
const SITE_URL = process.env.NEXTAUTH_URL;

export function CalcOrderPoints(totalCost, itemCount, paymentPoints) {
  let points = 0;
  if (totalCost >= 3000000) points += 10;
  if (totalCost >= 5000000) points += 5;
  if (totalCost >= 7000000) points += 5;
  if (totalCost >= 10000000) points += 10;

  if (itemCount >= 3) points += 5;
  if (itemCount >= 5) points += 5;
  if (itemCount >= 7) points += 5;

  if (paymentPoints) points += paymentPoints;
  return points;
}

export function parseBool(val) {
  if (
    (typeof val === "string" &&
      (val.toLowerCase() === "true" || val.toLowerCase() === "yes")) ||
    val === 1
  )
    return true;
  else if (
    (typeof val === "string" &&
      (val.toLowerCase() === "false" || val.toLowerCase() === "no")) ||
    val === 0
  )
    return false;

  return null;
}

export function priceToFaText(price) {
  if (price < 1000) {
    return price + " تومان";
  }
  // less than million
  if (price < 1000000) {
    return parseInt(price / 1000) + " هزار";
  }
  // less than billion
  if (price < 1000000000) {
    return parseFloat(price / 1000000).toFixed(1) + " میلیون";
  }
}

export function encodeInt(input) {
  return hashids.encode(input);
}
export function decodeInt(input) {
  return hashids.decode(input)[0];
}

export function showNoImage() {
  return SITE_URL + "/img/product-no-image.webp";
}

export function priceLocale(input) {
  if (!input) return "نامشخص";
  return parseInt(input).toLocaleString() + " تومان ";
}

export function toAbsoluteURL(url) {
  return SITE_URL + url;
}

export function orderStatusFa(status) {
  switch (status) {
    case "processing":
      return "در حال انجام";
    case "pending":
      return "در انتظار پرداخت";
    case "on-hold":
      return "در انتظار بررسی";
    case "completed":
      return "تکمیل شده";
    case "cancelled":
      return "لفو شده";
    case "refunded":
      return "مسترد شده";
    case "failed":
      return "ناموفق";
    case "checkout-draft":
      return "پیش نویس";
    case "trash":
      return "در زباله دان";
    default:
      return "نا مشخص";
  }
}

export function Base64encodeClient(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    return reader.result;
  };
  reader.onerror = function (error) {
    throw new Error(error);
  };
}

export function base64TOBuffer(base64) {
  let uri = base64.split(";base64,").pop();
  return Buffer.from(uri, "base64");
}
export function percentageOff(baseNum, percentageNum) {
  return baseNum * (1 - percentageNum / 100);
}

export function stringCut(string, limit) {
  if (string.length > limit - 3) {
    return string.substring(0, limit) + " ...";
  }
  return string;
}
