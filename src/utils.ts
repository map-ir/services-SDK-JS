/** Determines value is not undefined or null. */
export const isValue = <T>(value: T | undefined | null): value is T =>
  (value as T) !== undefined && (value as T) !== null;

type NonNullableProp<T, Cond> = {
  [P in keyof T]: Exclude<T[P], Cond>;
};

/** Cleans Object from undefined, null (normal), and also falsy valus (strict) */
export const cleanObj = <T extends Record<string, unknown>>(
  obj: T,
  strict = true
) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => (strict ? Boolean(v) : isValue(v)))
  ) as NonNullableProp<T, undefined | null>;

/** converts all properties of an object to string, using .toString method. */
export const convertAllPropsToString = (obj: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, String(value)])
  ) as Record<string, string>;

/** Generates a Url Query from a given object */
type StringConvetable = unknown & { toString(): string };
export const qs = <T extends Record<string, StringConvetable>>(obj: T) =>
  new URLSearchParams(convertAllPropsToString(cleanObj(obj))).toString();

/** Converts numbers in a string to Farsi (persian) numebrs */
export const toFaDigits = function (input: string | number) {
  input = input.toString();
  if (!input) return "";
  const id = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return input.replace(/[0-9]/g, function (w) {
    return id[+w];
  });
};
