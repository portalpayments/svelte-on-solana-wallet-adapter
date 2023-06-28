export const log = console.log.bind(console);

// 'any' is OK - JSON.stringify itself uses 'any'
export const stringify = (object: any): string => {
  return JSON.stringify(object, null, 2);
};
