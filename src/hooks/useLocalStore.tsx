export function useLocalStore(storage: string) {
  return {
    onGet: () => {
      const storageData = localStorage.getItem(storage);

      return storageData ? JSON.parse(storageData) : undefined;
    },
    onSet: (value: any) => localStorage.setItem(storage, JSON.stringify(value)),
    onRemove: () => localStorage.removeItem(storage),
  };
}
