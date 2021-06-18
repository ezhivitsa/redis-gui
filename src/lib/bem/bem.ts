import { State, ClassNameGenerator } from './types';

const hyphenRegExp = /-([a-z])/g;

function toCamelCase(value: string): string {
  return value.replace(hyphenRegExp, (g) => g[1].toUpperCase());
}

/**
 * Module fro generating class names.
 */
export function block(styles: Record<string, string>, blockName: string, theme?: string): ClassNameGenerator {
  return (elementNameOrState?: string | State, state?: State): string => {
    let resultClassNames = '';
    let element = blockName;

    const themeStyleClass = theme ? styles[`${toCamelCase(blockName)}_theme_${theme}`] : '';

    if (elementNameOrState) {
      if (typeof elementNameOrState === 'string') {
        element += `__${elementNameOrState}`;

        resultClassNames = styles[toCamelCase(element)];
      } else if (typeof elementNameOrState === 'object') {
        state = elementNameOrState;
        resultClassNames = styles[toCamelCase(blockName)];

        if (theme && themeStyleClass) {
          resultClassNames += ` ${themeStyleClass}`;
        }
      }
    } else {
      resultClassNames = styles[toCamelCase(blockName)];

      if (theme && themeStyleClass) {
        resultClassNames += ` ${themeStyleClass}`;
      }
    }

    if (state) {
      Object.keys(state).forEach((key) => {
        if (!state) {
          return;
        }

        let className: string | undefined;
        if (state[key] === true) {
          className = styles[`_${toCamelCase(key)}`];
        } else if (state[key]) {
          const camelCaseKey = toCamelCase(key);
          className = styles[`_${camelCaseKey}_${state[camelCaseKey]}`];
        }

        if (className) {
          resultClassNames += ` ${className}`;
        }
      });
    }

    return resultClassNames;
  };
}
