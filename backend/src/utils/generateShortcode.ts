const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const encodeBase62 = (num: number): string => {
  let code = '';
  while (num > 0) {
    code = BASE62[num % 62] + code;
    num = Math.floor(num / 62);
  }
  return code.padStart(6, '0'); 
};

export const generateShortcode = (): string => {
  const timestamp = Date.now(); 
  return encodeBase62(timestamp);
};
