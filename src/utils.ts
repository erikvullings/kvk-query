export const padLeft = (str?: string | number, ch = ' ', len = 2): string =>
  str ? str.toString().length >= len ? str.toString() : padLeft(ch + str.toString(), ch, len) : undefined;
