import moment from "moment-timezone";
import S from "string";
export function currentIranTimeDB() {
  return moment().tz("Asia/Tehran").toISOString();
}
export function gregorian_to_jalali(gy, gm, gd) {
  var g_d_m, jy, jm, jd, gy2, days;
  g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  gy2 = gm > 2 ? gy + 1 : gy;
  days =
    355666 +
    365 * gy +
    ~~((gy2 + 3) / 4) -
    ~~((gy2 + 99) / 100) +
    ~~((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  jy = -1595 + 33 * ~~(days / 12053);
  days %= 12053;
  jy += 4 * ~~(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += ~~((days - 1) / 365);
    days = (days - 1) % 365;
  }
  if (days < 186) {
    jm = 1 + ~~(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + ~~((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}
export function parseDateFull(date) {
  if (date == null) return "";
  let d = new Date(date);
  let mom = moment(d).tz("Asia/Tehran");
  let ctime =
    gregorian_to_jalali(d.getFullYear(), d.getMonth() + 1, d.getDate()) +
    " " +
    mom.format("hh:mm A");
  ctime = S(ctime).replaceAll(",", "/").s;
  ctime = S(ctime).replaceAll("AM", "ق.ظ").s;
  ctime = S(ctime).replaceAll("PM", "ب.ظ").s;
  return ctime;
}
export function parseDate(date) {
  let d = new Date(date);
  let ctime = gregorian_to_jalali(
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate()
  );
  ctime = S(ctime).replaceAll(",", "/").s;
  return ctime;
}

export function EngDayNameToFa(name) {
  name = name?.toLowerCase();
  switch (name) {
    case "monday":
      return "دو شنبه";
    case "tuesday":
      return "سه شنبه";
    case "wednesday":
      return "چهار شنبه";
    case "thursday":
      return "پنج شنبه";
    case "friday":
      return "جمعه";
    case "saturday":
      return "شنبه";
    case "sunday":
      return "یک شنبه";
    default:
      return "";
  }
}
