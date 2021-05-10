export const isPOJO = (value: unknown): value is Record<string, unknown> => {
  if (value == null || typeof value !== 'object') {
    return false;
  }

  const proto = Object.getPrototypeOf(value);
  if (proto == null) {
    return true;
  }

  return proto.constructor.name === 'Object';
};
