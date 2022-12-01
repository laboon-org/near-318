export const formatDateShort = (date: Date) => {
  const fixedDate = new Date(date);
  const format = `${fixedDate.toLocaleString('en-US', {month: 'short', day: "2-digit"})}, 
  ${fixedDate.toLocaleString('en-US', {year: 'numeric'})}${'ㅤ'}${fixedDate.toLocaleString('en-US', {hour: '2-digit', minute:'2-digit'})}`
  return format;
}