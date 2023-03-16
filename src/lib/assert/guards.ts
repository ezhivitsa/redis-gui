/**
 * isNumber is a type guard for the number type.
 */
export const isNumber = (arg: unknown): arg is number => {
  return typeof arg === 'number';
};

/**
 * isString is a type guard for the string type. Note that this says nothing
 * about the length of strings (e.g. '' is still a string).
 */
export const isString = (arg: unknown): arg is string => typeof arg === 'string';

/**
 * isBoolean is a type guard for the boolean type. Note that this is different
 * from truthiness - see the `exists` guard in ./asserts for the closest
 * equivalent.
 */
export const isBoolean = (arg: unknown): arg is boolean => typeof arg === 'boolean';

/**
 * isNull is a type guard for the null primitive
 */
export const isNull = (arg: unknown): arg is null => arg === null;

/**
 * isUndefined is a type guard for the undefined primitive
 */
export const isUndefined = (arg: unknown): arg is undefined => arg === undefined;

/**
 * isObject is a type guard for Objects.
 */
export const isObject = (arg: unknown): arg is object =>
  !!arg && (typeof arg === 'object' || typeof arg === 'function');
