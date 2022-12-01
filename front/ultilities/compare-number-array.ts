export const compareNumberArrays = (first: number[], second: number[]): boolean => {
  let result = true;
  if (first.length !== second.length) {
    return false;
  } else {
    for (let i = 0; i < first.length; i++) {
      if (first[i] !== second[i]) result = false;
      break;
    }
    return result;
  }
}