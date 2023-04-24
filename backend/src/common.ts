export const ensureDefined = <T>(value: T | undefined) => {
  if (value === undefined) {
    throw new Error('Unexpected undefined value');
  }
  return value;
};
