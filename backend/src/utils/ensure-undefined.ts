export const ensureDefinedWith = <T>(
  value: T | undefined,
  func: (arg: T) => void,
) => {
  if (value === undefined) {
    func(value);
  }
  return value;
};
