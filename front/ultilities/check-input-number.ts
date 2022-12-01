// Check if input is integer and greater than 0
export const checkPositiveIntNumberWOZero = (value: string): string => {
  const re = /^([1-9]\d*)$/;
  if (value && re.test(value)) {
    return value;
  }
  return '';
}