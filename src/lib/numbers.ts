const notNumberSymbolRegExp = /[^\d,-]/g;
const commaRegExp = /,/g;

export function parseNumber(str: string): number {
  return Number(str.replace(notNumberSymbolRegExp, '').replace(commaRegExp, '.'));
}
