import { ClassNameGenerator, State } from './types';

const hyphenRegExp = /-([a-z])/g;

function toCamelCase(value: string): string {
  return value.replace(hyphenRegExp, (g) => g[1].toUpperCase());
}

function getModifierClasses(element: string, state: State): string[] {
  const result: string[] = [];

  Object.keys(state).forEach((key) => {
    if (state[key] === true) {
      result.push(`${toCamelCase(element)}_${toCamelCase(key)}`);
    } else if (state[key]) {
      const camelCaseKey = toCamelCase(key);
      result.push(`${toCamelCase(element)}_${camelCaseKey}_${state[camelCaseKey]}`);
    }
  });

  return result;
}

function getBlockClasses(block: string, theme?: string, additionalClassName?: string): string[] {
  const result: string[] = [];

  const themeStyleClass = theme ? `${toCamelCase(block)}_theme_${theme}` : '';
  result.push(toCamelCase(block));

  if (themeStyleClass) {
    result.push(themeStyleClass);
  }

  if (additionalClassName) {
    result.push(additionalClassName);
  }

  return result;
}

function getElementClass(block: string, element: string): string {
  return toCamelCase(`${block}__${element}`);
}

/**
 * Module for generating class names.
 */
export function block(
  styles: Record<string, string>,
  blockName: string,
  theme?: string,
  additionalClassName?: string,
): ClassNameGenerator {
  return (elementNameOrState?: string | State, state?: State): string => {
    const result: string[] = [];
    let element = blockName;

    if (elementNameOrState) {
      if (typeof elementNameOrState === 'string') {
        // element
        element = getElementClass(blockName, elementNameOrState);
        result.push(element);
      } else if (typeof elementNameOrState === 'object') {
        // block with modifiers
        result.push(...getBlockClasses(blockName, theme, additionalClassName));
        result.push(...getModifierClasses(blockName, elementNameOrState));
      }
    } else {
      // block
      result.push(...getBlockClasses(blockName, theme, additionalClassName));
    }

    if (state) {
      // modifiers for element
      result.push(...getModifierClasses(element, state));
    }

    return result
      .map((className) => (className === additionalClassName ? className : styles[className]))
      .filter(Boolean)
      .join(' ');
  };
}
