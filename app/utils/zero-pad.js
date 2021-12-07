// Add zero in front of numbers < 10
export default function zeroPad(value, trim) {
  let result = value.toString();

  if (value < 10) {
    result = `0${result}`;
  }

  if (result === '00' && trim) {
    result = '0';
  }

  return result;
}
