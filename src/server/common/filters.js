export function isNumber(value) {
  return /^\d*$/.test(value);
}
export function isWord(value) {
  let status = false;
  if (/^[a-z]+$/.test(value)) status = true;
  //if (/^[ا-ی]+$/.test(value)) status = true;
  return status;
}
