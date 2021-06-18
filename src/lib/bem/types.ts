export type State = Record<string, string | boolean | void | number>;

export interface ClassNameGenerator {
  (elementName?: string, state?: State): string;
  (state?: State): string;
}
