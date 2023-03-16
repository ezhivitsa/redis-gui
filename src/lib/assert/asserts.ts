/**
 * Exclude null and undefined from T
 */
type NonNullable<T> = T & object;

export function assertExists<T>(arg: T): asserts arg is NonNullable<T> {
  if (arg === null || arg === undefined) {
    throw new Error(`Argument ${arg} is not valid`);
  }
}
