export function objToForEach(
  obj: Object,
  callback: (key: string, value: string) => void
) {
  const arrKeys = Object.keys(obj);
  const arrValues = Object.values(obj);

  arrKeys.forEach((key, index) => {
    const value = arrValues[index];

    callback(key, value);
  });
}
