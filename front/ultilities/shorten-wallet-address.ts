// Shortening wallet address
// Format: <left>...<right>
// Example: left=2, right=4 => ab...wxyz
export const shortenWalletAddress = (address: string, leftWords: number, rightWords: number) => {
  return `${address.substring(0, leftWords)}...${address.substring(address.length - rightWords, address.length)}`
}