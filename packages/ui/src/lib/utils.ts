export const truncateWalletAddress = (walletAddress: string ) => {
  return walletAddress.slice(0, 4) + '..' + walletAddress.slice(-4);
}

export const copyToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text);
}

export const sleep = async (timeInMs: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
};
