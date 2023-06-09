export const truncateWalletAddress = (walletAddress: string) => {
  return walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4);
};

export const copyToClipboard = (text: string) => {
  return navigator.clipboard.writeText(text);
};

export const sleep = async (timeInMs: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, timeInMs));
};

export const stringify = (object: any) => {
  return JSON.stringify(object, null, 2);
};

export const log = console.log;

export const byInstalledStatus = (a, b) => {
  if (a.readyState === "Installed" && b.readyState !== "Installed") {
    return -1;
  }
  if (a.readyState !== "Installed" && b.readyState === "Installed") {
    return 1;
  }
  return 0;
};
